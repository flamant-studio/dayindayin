/**
 * Quick diagnostic: check what variant data Shopify has for framed print products
 * Run: npx tsx scripts/check-framed-shopify.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!

async function sfFetch(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(`https://${DOMAIN}/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store' as RequestCache,
  })
  const json = await res.json() as any
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

async function main() {
  // Search for framed print products
  const data = await sfFetch(`
    query {
      products(first: 10, query: "title:Framed OR product_type:Framed") {
        edges {
          node {
            id
            handle
            title
            productType
            tags
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  price { amount }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `)

  const products = data.products.edges
  console.log(`Found ${products.length} framed print products\n`)

  for (const { node: p } of products) {
    const variants = p.variants.edges.map((e: any) => e.node)
    console.log(`"${p.title}" (${p.handle})`)
    console.log(`  type: ${p.productType}, tags: ${p.tags.join(', ')}`)
    console.log(`  variants (${variants.length}):`)
    for (const v of variants) {
      console.log(`    - "${v.title}" ${v.price.amount} kr available=${v.availableForSale}`)
    }
    console.log()
  }
}

main().catch(console.error)
