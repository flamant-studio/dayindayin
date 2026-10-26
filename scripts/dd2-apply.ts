// DD2: archive (reversible: set status back to ACTIVE) SHERO art prints + broken-artwork caps.
// Run: cd dayindayin-site && npx tsx scripts/dd2-apply.ts   (reads keys from .env.local, prints no secrets)
import * as dotenv from 'dotenv'
dotenv.config({ path: '/Users/flamant-mini/Projects/FLAMANT/dayindayin-site/.env.local' })
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const HANDLES = ['shero-purple-fine-art-print', 'shero-indigo-fine-art-print', 'shero-iii-fine-art-print', 'neko-paw-cap-blue', 'neko-paw-cap-lilac', 'neko-paw-cap-yellow']
async function gql(t: string, query: string, variables?: any) {
  const r = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': t }, body: JSON.stringify({ query, variables }) })
  return (await r.json()) as any
}
async function main() {
  const r = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.SHOPIFY_CLIENT_ID!, client_secret: process.env.SHOPIFY_CLIENT_SECRET! }).toString() })
  const t = ((await r.json()) as any).access_token as string
  for (const h of HANDLES) {
    const f = await gql(t, `query($q:String!){ productByHandle(handle:$q){ id title status } }`, { q: h })
    const p = f.data?.productByHandle
    if (!p) { console.log('MISSING', h); continue }
    const u = await gql(t, `mutation($i:ProductInput!){ productUpdate(input:$i){ product{ handle status } userErrors{ message } } }`, { i: { id: p.id, status: 'ARCHIVED' } })
    console.log(h, p.status, '->', JSON.stringify(u.data?.productUpdate ?? u.errors))
  }
}
main()
