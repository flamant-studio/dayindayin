import { readFileSync } from 'fs'
const domain = 'dayindayin.myshopify.com'
const clientId = '2e4910e46f5e7ccce75e8c86ba05a014'
const envContent = readFileSync('/Users/flamant-mini/Documents/FLAMANT/dayindayin-site/.env.local', 'utf8')
const clientSecret = envContent.match(/SHOPIFY_CLIENT_SECRET=(.+)/)?.[1]?.trim()

async function main() {
  const tokenRes = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' })
  })
  const token = (await tokenRes.json() as any).access_token
  const res = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query: `{ products(first: 30, query: "tag:framed") { edges { node { handle images(first: 20) { edges { node { url } } } } } } }` })
  })
  const data = (await res.json() as any).data
  const sorted = data.products.edges.map((e: any) => ({ handle: e.node.handle, count: e.node.images.edges.length })).sort((a: any, b: any) => b.count - a.count)
  for (const p of sorted.slice(0, 10)) console.log(p.handle, '-', p.count, 'images')
}
main().catch(err => { console.error(err); process.exit(1) })
