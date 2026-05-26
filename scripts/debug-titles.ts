import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!

async function getToken(): Promise<string> {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials',
      client_id: process.env.SHOPIFY_CLIENT_ID!, client_secret: process.env.SHOPIFY_CLIENT_SECRET! }).toString(),
  })
  return ((await res.json()) as any).access_token
}

async function main() {
  const tok = await getToken()
  // Search for the newly created products that might have wrong titles
  for (const q of ['Universe Hole', 'Theres Nothing', 'Collage Bw', 'Be A Dragon']) {
    const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: { 'X-Shopify-Access-Token': tok, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `{ products(first:3, query:"title:*${q}*") { edges { node { id title status } } } }` }),
    })
    const j = await res.json() as any
    const edges = j.data?.products?.edges ?? []
    if (edges.length) {
      console.log(`"${q}": ${edges.map((e: any) => `${e.node.title} (${e.node.status})`).join(', ')}`)
    } else {
      console.log(`"${q}": not found`)
    }
  }
}
main().catch(console.error)
