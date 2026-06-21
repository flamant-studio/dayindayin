import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!

async function main() {
  for (const handle of ['mask-ii-framed-print', 'elsk-framed-print']) {
    const res = await fetch(`https://${DOMAIN}/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': TOKEN },
      body: JSON.stringify({ query: `{ product(handle: "${handle}") { title productType variants(first: 20) { edges { node { title price { amount } availableForSale } } } } }` }),
    })
    const data = await res.json() as any
    const p = data.data?.product
    if (!p) { console.log(`${handle}: NOT FOUND`); continue }
    console.log(`\n${p.title} (${p.productType}) — ${p.variants.edges.length} variants`)
    for (const { node: v } of p.variants.edges) console.log(`  "${v.title}" ${v.price.amount} available=${v.availableForSale}`)
  }
}
main().catch(console.error)
