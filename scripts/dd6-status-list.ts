// DD6: dump handle<TAB>status for every product (Admin API). Usage: npx tsx scripts/dd6-status-list.ts > out.tsv
import * as dotenv from 'dotenv'
dotenv.config({ path: '/Users/flamant-mini/Projects/FLAMANT/dayindayin-site/.env.local' })
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
async function gql(t: string, query: string, variables?: any) {
  const r = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': t }, body: JSON.stringify({ query, variables }) })
  return (await r.json()) as any
}
async function main() {
  const r = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.SHOPIFY_CLIENT_ID!, client_secret: process.env.SHOPIFY_CLIENT_SECRET! }).toString() })
  const t = ((await r.json()) as any).access_token as string
  const rows: string[] = []
  let after: string | null = null
  for (;;) {
    const d: any = await gql(t, `query($a:String){ products(first:250, after:$a){ pageInfo{hasNextPage endCursor} nodes{ handle status } } }`, { a: after })
    const p = d.data?.products
    if (!p) { console.error(JSON.stringify(d.errors)); process.exit(1) }
    for (const n of p.nodes) rows.push(`${n.handle}\t${n.status}`)
    if (!p.pageInfo.hasNextPage) break
    after = p.pageInfo.endCursor
  }
  console.log(rows.sort().join('\n'))
}
main()
