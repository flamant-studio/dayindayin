import { readFileSync } from 'fs'

const domain = 'dayindayin.myshopify.com'
const clientId = '2e4910e46f5e7ccce75e8c86ba05a014'
const envContent = readFileSync('/Users/flamant-mini/Documents/FLAMANT/dayindayin-site/.env.local', 'utf8')
const clientSecret = envContent.match(/SHOPIFY_CLIENT_SECRET=(.+)/)?.[1]?.trim()

async function getToken() {
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' })
  })
  const data = await res.json() as any
  return data.access_token
}

async function graphql(token: string, query: string, variables: any = {}) {
  const res = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables })
  })
  const data = await res.json() as any
  return data.data
}

async function main() {
  const token = await getToken()
  let cursor: string | null = null
  const all: any[] = []
  do {
    const data: any = await graphql(token, `
      query($cursor: String) {
        products(first: 100, after: $cursor, query: "status:active") {
          pageInfo { hasNextPage endCursor }
          edges { node { title tags handle } }
        }
      }
    `, { cursor })
    all.push(...data.products.edges.map((e: any) => e.node))
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)

  const uniqueTitlesByPrefix = (needle: string) => {
    const set = new Set(all.filter(p => p.title.toLowerCase().includes(needle)).map(p => p.title.replace(/ — [^—]+$/, '')))
    return [...set]
  }

  for (const needle of ['mask', 'sea monster', 'rabbit', 'tuft', 'neko paw', 'pussy', 'vaginal', 'bird man']) {
    console.log(`\n--- unique base-titles containing "${needle}" ---`)
    console.log(uniqueTitlesByPrefix(needle))
  }
}
main().catch(err => { console.error(err); process.exit(1) })
