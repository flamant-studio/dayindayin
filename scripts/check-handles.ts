import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!

async function main() {
  const r = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }).toString(),
  })
  const { access_token } = (await r.json()) as { access_token: string }

  const q = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': access_token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `{ products(first: 8, query: "status:active", sortKey: CREATED_AT, reverse: true) { edges { node { title handle tags } } } }` }),
  })
  const data = (await q.json()) as { data: { products: { edges: { node: { title: string; handle: string; tags: string[] } }[] } } }
  for (const { node } of data.data?.products?.edges ?? []) {
    console.log(`"${node.title}"`)
    console.log(`  handle: ${node.handle}`)
    console.log(`  tags:   [${node.tags.join(', ')}]`)
  }
}
main().catch(console.error)
