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
  let hasImages = 0, noImages = 0, cursor: string | null = null

  do {
    const data = await graphql(token, `
      query($cursor: String) {
        products(first: 100, after: $cursor, query: "status:active") {
          edges {
            node {
              title
              media(first: 1) { edges { node { id } } }
            }
            cursor
          }
          pageInfo { hasNextPage }
        }
      }
    `, { cursor })
    
    for (const { node } of data.products.edges) {
      if (node.media.edges.length > 0) hasImages++
      else noImages++
    }
    
    cursor = data.products.pageInfo.hasNextPage 
      ? data.products.edges[data.products.edges.length - 1].cursor 
      : null
    
    process.stdout.write(`\rChecked ${hasImages + noImages} products...`)
  } while (cursor)

  console.log(`\n\nResults:`)
  console.log(`  With images: ${hasImages}`)
  console.log(`  Without images: ${noImages}`)
  console.log(`  Total: ${hasImages + noImages}`)
}

main().catch(console.error)
