import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!

async function getToken(): Promise<string> {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SHOPIFY_CLIENT_ID!,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET!,
    }).toString(),
  })
  const data = await res.json() as { access_token: string }
  return data.access_token
}

async function main() {
  const tok = await getToken()
  const searches = ['Hole', 'Nothing Here', 'Collage', 'Du Und', 'Fleur']
  for (const q of searches) {
    const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: { 'X-Shopify-Access-Token': tok, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `{ products(first: 5, query: "title:*${q}* status:active") { edges { node { title } } } }` }),
    })
    const j = await res.json() as any
    const titles = j.data?.products?.edges?.map((e: any) => e.node.title) ?? []
    if (titles.length) console.log(`"${q}": ${titles.join(', ')}`)
    else console.log(`"${q}": (not found in Shopify yet)`)
  }
}
main().catch(console.error)
