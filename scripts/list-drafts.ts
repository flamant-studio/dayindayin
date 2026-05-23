import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!

async function getToken(): Promise<string> {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }).toString(),
  })
  const data = await res.json() as { access_token: string }
  return data.access_token
}

async function main() {
  const token = await getToken()
  // Sort by creation date, newest first to see our just-created products
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{ products(first: 10, query: "status:draft", sortKey: CREATED_AT, reverse: true) {
        edges { node { id title tags createdAt } }
      } }`
    }),
  })
  const data = await res.json() as { data: { products: { edges: { node: { id: string; title: string; tags: string[]; createdAt: string } }[] } } }
  for (const { node } of data.data.products.edges) {
    console.log(`[${node.createdAt.slice(0,10)}] ${node.title}`)
    console.log(`  tags: [${node.tags.join(', ')}]`)
    console.log(`  id:   ${node.id}`)
  }
}

main().catch(console.error)
