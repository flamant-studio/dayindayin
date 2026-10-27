// DD7: read-only snapshot of all products (handle, status, Online Store published) + detail of the 4 new prints.
// Run: npx tsx scripts/dd7-read.ts <out.tsv> <detail.json>   (keys from main-tree .env.local, prints no secrets)
import * as dotenv from 'dotenv'
import { writeFileSync } from 'fs'
dotenv.config({ path: '/Users/flamant-mini/Projects/FLAMANT/dayindayin-site/.env.local' })
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const PUB = 'gid://shopify/Publication/337681482075'
async function main() {
  const r = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.SHOPIFY_CLIENT_ID!, client_secret: process.env.SHOPIFY_CLIENT_SECRET! }).toString() })
  const t = ((await r.json()) as any).access_token as string
  const gql = async (query: string, variables?: any) => (await (await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': t }, body: JSON.stringify({ query, variables }) })).json()) as any
  const rows: string[] = []; let after: string | null = null
  while (true) {
    const d = await gql(`query($a:String,$p:ID!){ products(first:100, after:$a){ edges{ node{ handle status publishedOnPublication(publicationId:$p) } } pageInfo{hasNextPage endCursor} } }`, { a: after, p: PUB })
    if (d.errors) throw new Error(JSON.stringify(d.errors))
    for (const e of d.data.products.edges) rows.push(`${e.node.handle}\t${e.node.status}\t${e.node.publishedOnPublication ? 'PUBLISHED' : 'unpublished'}`)
    if (!d.data.products.pageInfo.hasNextPage) break
    after = d.data.products.pageInfo.endCursor
  }
  rows.sort(); writeFileSync(process.argv[2], rows.join('\n') + '\n'); console.log('products:', rows.length)
  const H = ['blue-flower-on-green-wood-fine-art-print','dead-flowers-fine-art-print','red-and-green-moss-fine-art-print','taped-objects-fine-art-print','purple-flower-fine-art-print','two-cats-fine-art-print','tourism-i-fine-art-print']
  const out: any[] = []
  for (const h of H) {
    const d = await gql(`query($h:String!,$p:ID!){ productByHandle(handle:$h){ id handle title status productType vendor tags templateSuffix onlineStoreUrl publishedOnPublication(publicationId:$p)
      featuredImage{ url width height } images(first:8){ edges{ node{ url width height } } }
      options{ name values } variants(first:20){ edges{ node{ title sku price selectedOptions{name value} image{ url } } } } } }`, { h, p: PUB })
    if (d.errors) throw new Error(JSON.stringify(d.errors))
    out.push(d.data.productByHandle)
  }
  writeFileSync(process.argv[3], JSON.stringify(out, null, 1))
}
main()
