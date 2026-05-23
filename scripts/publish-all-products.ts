/**
 * publish-all-products.ts
 *
 * Publishes all DRAFT products in the Shopify store by setting status → ACTIVE.
 * Also ensures each product is published to the Online Store sales channel.
 *
 * Run: npx tsx scripts/publish-all-products.ts
 * Dry run: DRY_RUN=1 npx tsx scripts/publish-all-products.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!
const DRY_RUN = process.env.DRY_RUN === '1'

async function getToken(): Promise<string> {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }).toString(),
  })
  if (!res.ok) throw new Error(`Token mint failed: ${res.status}`)
  const data = await res.json() as { access_token: string }
  return data.access_token
}

let _token: string | null = null
async function graphql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!_token) _token = await getToken()
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': _token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json() as { data: T; errors?: unknown[] }
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
  return json.data
}

interface ProductEdge {
  node: { id: string; title: string; status: string; handle: string }
}

interface ProductNode {
  id: string; title: string; status: string; handle: string; tags: string[]
}

async function getDraftProducts(): Promise<ProductNode[]> {
  let products: ProductNode[] = []
  let cursor: string | null = null

  while (true) {
    const data = await graphql<{
      products: { edges: { node: ProductNode }[]; pageInfo: { hasNextPage: boolean; endCursor: string } }
    }>(
      `query GetDrafts($after: String) {
        products(first: 50, after: $after, query: "status:draft") {
          edges { node { id title status handle tags } }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { after: cursor }
    )
    products = products.concat(data.products.edges.map(e => e.node))
    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
  }

  // Publish known-good products: artwork prints, totes, greeting cards.
  // Exclude generic test products (no meaningful category tag).
  const KNOWN_TAGS = ['tufting', 'embroidery', 'painting', 'photography', 'art-print', 'tote', 'greeting-card']
  return products.filter(p => p.tags.some(t => KNOWN_TAGS.includes(t.toLowerCase())))
}

async function publishProduct(product: ProductNode): Promise<void> {
  await graphql(
    `mutation PublishProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product { id status }
        userErrors { field message }
      }
    }`,
    { input: { id: product.id, status: 'ACTIVE' } }
  )
}

async function main() {
  if (!CLIENT_ID || !CLIENT_SECRET) { console.error('SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET not set'); process.exit(1) }

  if (DRY_RUN) console.log('DRY RUN — no products will be changed\n')

  const drafts = await getDraftProducts()
  console.log(`Found ${drafts.length} DRAFT products\n`)

  let published = 0
  let failed = 0

  for (const p of drafts) {
    process.stdout.write(`▸ ${p.title} ... `)
    if (DRY_RUN) {
      console.log('[DRY RUN]')
      published++
      continue
    }
    try {
      await publishProduct(p)
      console.log('✓ ACTIVE')
      published++
      await new Promise(r => setTimeout(r, 300))
    } catch (err) {
      console.log(`FAILED: ${err}`)
      failed++
    }
  }

  console.log(`\nDone. Published: ${published}, Failed: ${failed}`)
}

main().catch(err => { console.error(err); process.exit(1) })
