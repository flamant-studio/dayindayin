import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!

async function main() {
  const res = await fetch(`https://${DOMAIN}/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': TOKEN },
    body: JSON.stringify({ query: `{ product(handle: "mask-ii-framed-print") { priceRange { minVariantPrice { amount } maxVariantPrice { amount } } } }` }),
  })
  const d = await res.json() as any
  console.log('Price range:', d.data?.product?.priceRange)
}
main().catch(console.error)
