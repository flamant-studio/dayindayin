import * as dotenv from 'dotenv'
dotenv.config({ path: '/Users/flamant-mini/Projects/FLAMANT/dayindayin-site/.env.local' })
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
async function token() {
  const r = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.SHOPIFY_CLIENT_ID!, client_secret: process.env.SHOPIFY_CLIENT_SECRET! }).toString() })
  return ((await r.json()) as any).access_token as string
}
async function main() {
  const t = await token()
  let after: string | null = null; const out: any[] = []
  while (true) {
    const q = `{ products(first:100${after ? `, after:"${after}"` : ''}) { pageInfo{hasNextPage endCursor} nodes{ id handle title productType status tags totalInventory variantsCount{count} featuredImage{url} resourcePublicationsCount{count} } } }`
    const r = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': t }, body: JSON.stringify({ query: q }) })
    const j: any = await r.json()
    if (!j.data) { console.error(JSON.stringify(j).slice(0, 500)); process.exit(1) }
    out.push(...j.data.products.nodes)
    if (!j.data.products.pageInfo.hasNextPage) break
    after = j.data.products.pageInfo.endCursor
  }
  require('fs').writeFileSync(process.argv[2], JSON.stringify(out, null, 1))
  console.log(out.length)
}
main()
