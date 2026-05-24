/**
 * backfill-series-tags.ts
 *
 * Detects which Shopify products belong to each art series and adds the
 * corresponding tag if it isn't already present.
 *
 * Detection rules: title keywords + existing partial tags (case-insensitive).
 *
 * Run:     npx tsx scripts/backfill-series-tags.ts
 * Dry run: DRY_RUN=1 npx tsx scripts/backfill-series-tags.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN        = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID     = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!
const DRY_RUN       = process.env.DRY_RUN === '1'

if (!CLIENT_ID || !CLIENT_SECRET) { console.error('SHOPIFY_CLIENT_ID / SHOPIFY_CLIENT_SECRET not set'); process.exit(1) }

let _token: string | null = null
async function getToken(): Promise<string> {
  if (_token) return _token
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }).toString(),
  })
  if (!res.ok) throw new Error(`Token mint failed: ${res.status}`)
  const data = await res.json() as { access_token: string }
  _token = data.access_token
  return _token
}

// ── Series detection rules ────────────────────────────────────────────────────
// Each rule: tag to add → patterns to match against (title + existing tags).
// Patterns are lowercased and tested with .includes().

const SERIES_RULES: { tag: string; label: string; patterns: string[] }[] = [
  {
    tag: 'shero',
    label: 'SHERO',
    patterns: ['shero', 'she-ro', 'the fist', 'fist', 'sheroprint', 'sheroshine', 'neko_pote', 'neko pote'],
  },
  {
    tag: 'neko',
    label: 'NEKO',
    patterns: ['neko', 'sleeping cat', 'two cats', 'cat paw', 'neko human', 'neko paw'],
  },
  {
    tag: 'sea-monsters',
    label: 'Sea Monsters',
    patterns: ['sea monster', 'sea-monster', 'havuhyre', 'greek monster', 'dragon pattern'],
  },
  {
    tag: 'botanical',
    label: 'Botanical',
    patterns: ['botanical', 'garden —', 'garden-', 'geometric garden', 'master composition', 'sommertæt'],
  },
  {
    tag: 'floral',
    label: 'Floral',
    patterns: ['floral', 'poppy', 'poppies', 'forget-me-not', 'forget me not', 'blomst', 'peony'],
  },
  {
    tag: 'faces',
    label: 'Faces',
    patterns: ['mask —', 'mask-', 'maske', 'moon face', 'solar face', 'face —', 'ansigt', 'sri lanka mask'],
  },
  {
    tag: 'sommerby',
    label: 'Sommerby',
    patterns: ['sommerby'],
  },
]

// ── GraphQL helpers ───────────────────────────────────────────────────────────

async function graphql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const token = await getToken()
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json() as { data: T; errors?: unknown[] }
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
  return json.data
}

interface ProductNode {
  id: string
  title: string
  handle: string
  tags: string[]
}

async function getAllProducts(): Promise<ProductNode[]> {
  const products: ProductNode[] = []
  let cursor: string | null = null

  while (true) {
    const data = await graphql<{
      products: {
        edges: { node: ProductNode; cursor: string }[]
        pageInfo: { hasNextPage: boolean }
      }
    }>(`
      query($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            cursor
            node { id title handle tags }
          }
          pageInfo { hasNextPage }
        }
      }
    `, { first: 250, after: cursor })

    const edges = data.products.edges
    edges.forEach(e => products.push(e.node))
    if (!data.products.pageInfo.hasNextPage) break
    cursor = edges[edges.length - 1].cursor
  }

  return products
}

async function addTag(productId: string, currentTags: string[], newTag: string): Promise<void> {
  const allTags = [...currentTags, newTag]
  await graphql<unknown>(`
    mutation($id: ID!, $tags: [String!]!) {
      productUpdate(input: { id: $id, tags: $tags }) {
        product { id tags }
        userErrors { field message }
      }
    }
  `, { id: productId, tags: allTags })
}

// ── Detection ─────────────────────────────────────────────────────────────────

function detectSeries(product: ProductNode): string[] {
  const haystack = [product.title, ...product.tags].join(' ').toLowerCase()
  const matches: string[] = []
  for (const rule of SERIES_RULES) {
    if (product.tags.map(t => t.toLowerCase()).includes(rule.tag)) continue // already tagged
    if (rule.patterns.some(p => haystack.includes(p))) {
      matches.push(rule.tag)
    }
  }
  return matches
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Fetching all products...`)
  const products = await getAllProducts()
  console.log(`Found ${products.length} products\n`)

  const toUpdate: { product: ProductNode; tagsToAdd: string[] }[] = []

  for (const product of products) {
    const tagsToAdd = detectSeries(product)
    if (tagsToAdd.length > 0) {
      toUpdate.push({ product, tagsToAdd })
    }
  }

  // Summary by series
  const bySeries: Record<string, number> = {}
  for (const { tagsToAdd } of toUpdate) {
    for (const tag of tagsToAdd) {
      bySeries[tag] = (bySeries[tag] ?? 0) + 1
    }
  }

  console.log(`Will tag ${toUpdate.length} products:`)
  for (const [tag, count] of Object.entries(bySeries)) {
    console.log(`  ${tag}: ${count} products`)
  }
  console.log()

  if (DRY_RUN) {
    console.log('DRY RUN — sample matches:\n')
    toUpdate.slice(0, 20).forEach(({ product, tagsToAdd }) => {
      console.log(`  "${product.title}" → +[${tagsToAdd.join(', ')}]`)
    })
    return
  }

  let updated = 0, failed = 0

  for (const { product, tagsToAdd } of toUpdate) {
    try {
      let currentTags = [...product.tags]
      for (const tag of tagsToAdd) {
        await addTag(product.id, currentTags, tag)
        currentTags = [...currentTags, tag]
        await new Promise(r => setTimeout(r, 200))
      }
      process.stdout.write(`✓ ${product.title.slice(0, 50)}\n`)
      updated++
    } catch (err) {
      console.error(`FAILED ${product.title}: ${err}`)
      failed++
    }
  }

  console.log(`\nDone. Updated: ${updated}  Failed: ${failed}`)
}

main().catch(err => { console.error(err); process.exit(1) })
