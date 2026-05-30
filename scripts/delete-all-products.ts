/**
 * delete-all-products.ts
 *
 * Deletes every product in the Shopify store.
 * DRY_RUN=1 to preview without deleting.
 *
 * Run:     npx tsx scripts/delete-all-products.ts
 * Dry run: DRY_RUN=1 npx tsx scripts/delete-all-products.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN        = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID     = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!
const DRY_RUN       = process.env.DRY_RUN === '1'

let token: string | null = null

async function getToken() {
  if (token) return token
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  })
  const data = await res.json() as any
  token = data.access_token
  return token!
}

async function graphql<T>(query: string, variables: any = {}): Promise<T> {
  const t = await getToken()
  const res = await fetch(`https://${DOMAIN}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': t },
    body: JSON.stringify({ query, variables })
  })
  const json = await res.json() as any
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data as T
}

async function getAllProductIds(): Promise<{ id: string; title: string }[]> {
  const products: { id: string; title: string }[] = []
  let cursor: string | null = null

  do {
    const data = await graphql<any>(`
      query($cursor: String) {
        products(first: 100, after: $cursor) {
          edges { node { id title } cursor }
          pageInfo { hasNextPage }
        }
      }
    `, { cursor })

    for (const { node } of data.products.edges) {
      products.push({ id: node.id, title: node.title })
    }

    cursor = data.products.pageInfo.hasNextPage
      ? data.products.edges[data.products.edges.length - 1].cursor
      : null

    process.stdout.write(`\rFetched ${products.length} products...`)
  } while (cursor)

  console.log()
  return products
}

async function deleteProduct(id: string): Promise<void> {
  await graphql(`
    mutation DeleteProduct($id: ID!) {
      productDelete(input: { id: $id }) {
        deletedProductId
        userErrors { field message }
      }
    }
  `, { id })
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN — no deletions ===' : '=== DELETING ALL PRODUCTS ===')
  const products = await getAllProductIds()
  console.log(`Total: ${products.length} products`)

  if (DRY_RUN) {
    console.log('First 10:')
    products.slice(0, 10).forEach(p => console.log(` - ${p.title}`))
    console.log('...')
    return
  }

  let deleted = 0, failed = 0

  for (const product of products) {
    try {
      await deleteProduct(product.id)
      deleted++
      process.stdout.write(`\r  Deleted ${deleted}/${products.length}  `)
    } catch (e) {
      failed++
      console.error(`\n  FAILED: ${product.title} — ${e}`)
    }
    // Shopify rate limit: ~2 req/s safe for bulk operations
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n\nDone. Deleted: ${deleted}, Failed: ${failed}`)
}

main().catch(console.error)
