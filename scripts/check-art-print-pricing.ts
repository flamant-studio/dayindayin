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
  const withA5: any[] = []
  do {
    const data: any = await graphql(token, `
      query($cursor: String) {
        products(first: 100, after: $cursor, query: "title:*Art Print*") {
          pageInfo { hasNextPage endCursor }
          edges { node {
            handle title
            variants(first: 10) { edges { node { title price } } }
          } }
        }
      }
    `, { cursor })
    for (const edge of data.products.edges) {
      const titles = edge.node.variants.edges.map((e: any) => e.node.title)
      if (titles.some((t: string) => /a5/i.test(t))) withA5.push(edge.node)
    }
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)

  console.log(`Products with an A5 variant: ${withA5.length}\n`)
  for (const p of withA5) {
    console.log(p.handle)
    for (const e of p.variants.edges) console.log(`  ${e.node.title}: ${e.node.price}`)
  }
}
main().catch(err => { console.error(err); process.exit(1) })
