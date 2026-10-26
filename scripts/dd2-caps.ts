import * as dotenv from 'dotenv'
dotenv.config({ path: '/Users/flamant-mini/Projects/FLAMANT/dayindayin-site/.env.local' })
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
async function main() {
  const r0 = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.SHOPIFY_CLIENT_ID!, client_secret: process.env.SHOPIFY_CLIENT_SECRET! }).toString() })
  const t = ((await r0.json()) as any).access_token
  const q = `{ products(first:50, query:"title:*Cap*") { nodes{ handle title status media(first:20){nodes{ ... on MediaImage{ id image{url} } }} variants(first:20){ nodes{ id title image{url} selectedOptions{name value} } } } } }`
  const r = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': t }, body: JSON.stringify({ query: q }) })
  console.log(JSON.stringify((await r.json() as any).data, null, 1))
}
main()
