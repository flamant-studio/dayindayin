/**
 * Find one published product per category for mobile audit. Uses Admin API.
 */
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
  return ((await res.json()) as { access_token: string }).access_token
}

async function gql(token: string, q: string): Promise<any> {
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query: q }),
  })
  return (await res.json() as any).data
}

const TYPES = [
  { label: 'Art Print',     type: 'Art Print' },
  { label: 'Framed Print',  type: 'Framed Print' },
  { label: 'Print Material (framed)', type: 'Print Material' },
  { label: 'Poster',        type: 'Poster' },
  { label: 'Mug',           type: 'Mug' },
  { label: 'Tote Bag',      type: 'Tote Bag' },
  { label: 'Tank Top',      type: 'Tank Top' },
  { label: 'Postcard',      type: 'Postcard' },
  { label: 'Wood Print',    type: 'Wood Print' },
  { label: 'Water Bottle',  type: 'Water Bottle' },
  { label: 'Apparel (cap)', type: 'Apparel' },
  { label: 'Greeting Card', type: 'Greeting Card' },
]

async function main() {
  const token = await getToken()
  for (const { label, type } of TYPES) {
    const data = await gql(token, `{
      products(first: 1, query: "product_type:\\"${type}\\" status:active") {
        edges { node { handle title variants(first: 20) { edges { node { title } } } } }
      }
    }`)
    const p = data?.products?.edges?.[0]?.node
    if (!p) { console.log(`${label}: NONE`); continue }
    const vt = p.variants.edges.map((e: any) => e.node.title).join(', ')
    console.log(`${label.padEnd(25)} /shop/${p.handle}`)
    console.log(`${''.padEnd(25)} ${p.variants.edges.length} variants: ${vt.slice(0, 90)}`)
  }
}
main().catch(console.error)
