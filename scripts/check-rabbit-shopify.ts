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
  const data = await graphql(token, `
    query {
      products(first: 5, query: "title:*Rabbit*") {
        edges {
          node {
            id
            title
            handle
            status
            onlineStoreUrl
            media(first: 5) { edges { node { ... on MediaImage { image { url } } } } }
          }
        }
      }
    }
  `)
  console.log(JSON.stringify(data, null, 2))
}
main().catch(err => { console.error(err); process.exit(1) })
