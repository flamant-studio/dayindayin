/**
 * Fix A4/Black price on framed prints.
 * When productOptionsCreate converts "Default Title" → "A4 / Black",
 * it inherits the original variant price (~417.77). Correct it to 399.00.
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!

async function getToken(): Promise<string> {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }).toString(),
  })
  const data = await res.json() as { access_token: string }
  if (!data.access_token) throw new Error('Token mint failed')
  return data.access_token
}

async function gql(token: string, query: string, variables: Record<string, unknown> = {}): Promise<any> {
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json() as any
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

async function getFramedProducts(token: string) {
  const all: { id: string; title: string; variants: { id: string; title: string; price: string }[] }[] = []
  for (const type of ['Framed Print', 'Print Material']) {
    let cursor: string | null = null
    while (true) {
      const data = await gql(token, `
        query($first: Int!, $after: String, $q: String!) {
          products(first: $first, after: $after, query: $q) {
            edges { node { id title variants(first: 15) { edges { node { id title price } } } } }
            pageInfo { hasNextPage endCursor }
          }
        }
      `, { first: 250, after: cursor, q: `product_type:"${type}"` })
      for (const { node: p } of data.products.edges) {
        const variants = p.variants.edges.map((e: any) => e.node)
        const a4Black = variants.find((v: any) => v.title === 'A4 / Black' && parseFloat(v.price) !== 399.00)
        if (a4Black) all.push({ id: p.id, title: p.title, variants: [a4Black] })
      }
      if (!data.products.pageInfo.hasNextPage) break
      cursor = data.products.pageInfo.endCursor
    }
  }
  return all
}

async function main() {
  console.log('Minting token...')
  const token = await getToken()

  console.log('Finding framed prints with incorrect A4/Black price...')
  const products = await getFramedProducts(token)
  console.log(`Found ${products.length} products to fix\n`)

  if (products.length === 0) {
    console.log('All A4/Black prices already correct.')
    return
  }

  let ok = 0, fail = 0
  for (const p of products) {
    const v = p.variants[0]
    process.stdout.write(`  "${p.title}" A4/Black: ${v.price} → 399.00... `)
    try {
      const result = await gql(token, `
        mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) {
            productVariants { id title price }
            userErrors { field message }
          }
        }
      `, {
        productId: p.id,
        variants: [{ id: v.id, price: '399.00' }],
      })
      const errors = result?.productVariantsBulkUpdate?.userErrors ?? []
      if (errors.length) throw new Error(JSON.stringify(errors))
      const updated = result?.productVariantsBulkUpdate?.productVariants?.[0]
      process.stdout.write(`✓ → ${updated?.price}\n`)
      ok++
    } catch (err) {
      process.stdout.write(`✗ ${err}\n`)
      fail++
    }
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\n=== Done: ${ok} fixed, ${fail} failed ===`)
}

main().catch(e => { console.error(e); process.exit(1) })
