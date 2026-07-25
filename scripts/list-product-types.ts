import { readFileSync } from 'fs'
const domain = 'dayindayin.myshopify.com'
const clientId = '2e4910e46f5e7ccce75e8c86ba05a014'
const envContent = readFileSync('/Users/flamant-mini/Documents/FLAMANT/dayindayin-site/.env.local', 'utf8')
const clientSecret = envContent.match(/SHOPIFY_CLIENT_SECRET=(.+)/)?.[1]?.trim()

async function getToken() {
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' })
  })
  return (await res.json() as any).access_token
}
async function graphql(token: string, query: string, variables: any = {}) {
  const res = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables })
  })
  return (await res.json() as any).data
}

async function main() {
  const token = await getToken()
  let cursor: string | null = null
  const counts = new Map<string, number>()
  do {
    const data: any = await graphql(token, `
      query($cursor: String) {
        products(first: 100, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          edges { node { productType, variantsCount: variants(first: 1) { edges { node { id } } } } }
        }
      }
    `, { cursor })
    for (const edge of data.products.edges) {
      const t = edge.node.productType || '(empty)'
      counts.set(t, (counts.get(t) ?? 0) + 1)
    }
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)
  for (const [type, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`${count}\t${type}`)
  }
}
main().catch(err => { console.error(err); process.exit(1) })
