/**
 * unpublish-bad-apparel.ts
 *
 * Removes from the Online Store any tank top, tote bag, or dad cap product
 * whose artwork has a rectangular background patch (photos, paintings, patterns
 * with solid backgrounds). Only keeps clean transparent-background illustrations
 * and text designs.
 *
 * KEEP rules:
 *   Tank Top / Tote Bag: titles matching "Neko" prefix, "Two Cats", "Sleeping Cat",
 *     "Moon Face", "Solar Face"
 *   Dad Cap: titles matching "Neko Paw" only
 *
 * Run: npx tsx scripts/unpublish-bad-apparel.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const SHOP_DOMAIN   = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID     = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!
const PUB_ID        = 'gid://shopify/Publication/337681482075'

async function mintToken(): Promise<string> {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }).toString(),
  })
  const data = await res.json() as { access_token: string }
  return data.access_token
}

async function gql(token: string, query: string, variables?: Record<string, unknown>) {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  })
  return res.json() as Promise<{ data: Record<string, unknown>; errors?: unknown[] }>
}

interface ShopifyProduct {
  id: string
  title: string
  productType: string
  publishedOnPublication: boolean
}

async function getAllTargetProducts(token: string): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = []
  let cursor: string | null = null

  const APPAREL_TYPES = new Set(['Tank Top', 'Tote Bag', 'Dad Cap'])

  const query = `
    query($cursor: String, $pubId: ID!) {
      products(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          title
          productType
          publishedOnPublication(publicationId: $pubId)
        }
      }
    }
  `

  while (true) {
    const res = await gql(token, query, { cursor, pubId: PUB_ID })
    const data = res.data?.products as { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: ShopifyProduct[] }
    if (!data?.nodes) break
    products.push(...data.nodes.filter(p => APPAREL_TYPES.has(p.productType)))
    if (!data.pageInfo.hasNextPage) break
    cursor = data.pageInfo.endCursor
  }

  return products
}

function shouldKeep(title: string, productType: string): boolean {
  const t = title.toLowerCase()

  if (productType === 'Dad Cap') {
    // Keep only Neko Paw caps
    return t.startsWith('neko paw')
  }

  // Tank Top / Tote Bag: keep Neko series + a few clean illustrations
  if (t.startsWith('neko')) return true
  if (t === 'two cats') return true
  if (t === 'sleeping cat') return true
  if (t === 'moon face') return true
  if (t === 'solar face') return true

  return false
}

async function unpublish(token: string, productId: string): Promise<void> {
  const mutation = `
    mutation($id: ID!, $input: [PublicationInput!]!) {
      publishableUnpublish(id: $id, input: $input) {
        userErrors { field message }
      }
    }
  `
  const res = await gql(token, mutation, {
    id: productId,
    input: [{ publicationId: PUB_ID }],
  })
  const errors = (res.data?.publishableUnpublish as { userErrors: { message: string }[] })?.userErrors
  if (errors?.length) throw new Error(errors.map(e => e.message).join(', '))
}

async function main() {
  console.log('Minting Shopify token...')
  const token = await mintToken()

  console.log('Fetching tank tops, tote bags, and dad caps...')
  const products = await getAllTargetProducts(token)

  const toRemove = products.filter(p => p.publishedOnPublication && !shouldKeep(p.title, p.productType))
  const toKeep   = products.filter(p => shouldKeep(p.title, p.productType))

  console.log(`\nTotal found: ${products.length}`)
  console.log(`Will KEEP: ${toKeep.length}`)
  console.log(`Will UNPUBLISH: ${toRemove.length}`)

  console.log('\nKeeping:')
  toKeep.forEach(p => console.log(`  ✓ [${p.productType}] ${p.title}`))

  console.log('\nUnpublishing:')
  let done = 0
  for (const p of toRemove) {
    try {
      await unpublish(token, p.id)
      console.log(`  ✗ [${p.productType}] ${p.title}`)
      done++
    } catch (err) {
      console.error(`  ! Failed to unpublish ${p.title}: ${err}`)
    }
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\nDone. Unpublished ${done}/${toRemove.length} products.`)
}

main().catch(console.error)
