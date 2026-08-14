import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!

async function getToken() {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }).toString(),
  })
  return ((await res.json()) as any).access_token
}

async function main() {
  const token = await getToken()
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query: `{ products(first: 5, query: "product_type:\\"Dad Cap\\" status:active") { edges { node { title handle variants(first: 5) { edges { node { title price } } } } } } }` }),
  })
  const data = (await res.json() as any).data
  data.products.edges.forEach((e: any) => {
    const v = e.node.variants.edges.map((ve: any) => `${ve.node.title} (${ve.node.price})`)
    console.log(`${e.node.handle}: [${v.join(', ')}]`)
  })
}
main().catch(console.error)
