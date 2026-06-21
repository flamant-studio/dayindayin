/**
 * Audit product types and variant counts for known sample products.
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

const HANDLES = [
  'taped-objects-tote-bag',
  'rainbow-ii-tank-top',
  'sleeping-cat',
  'neko-paw-yellow-mug',
  'mask-ii-mug',
  'mask-iii-mug',
  'mask-iii-tote-bag',
  'neko-paw-yellow-tank-top',
  'neko-paw-yellow-poster',
  'tourism-i-poster',
]

async function main() {
  const token = await getToken()
  for (const handle of HANDLES) {
    const data = await gql(token, `{
      productByHandle(handle: "${handle}") {
        title handle productType tags
        variants(first: 10) { edges { node { title } } }
      }
    }`)
    const p = data?.productByHandle
    if (!p) { console.log(`${handle}: NOT FOUND`); continue }
    const vt = p.variants.edges.map((e: any) => e.node.title).join(', ')
    console.log(`\n${p.title}`)
    console.log(`  type: "${p.productType}" | tags: [${p.tags.join(', ')}]`)
    console.log(`  ${p.variants.edges.length} variants: ${vt.slice(0, 100)}`)
  }
}
main().catch(console.error)
