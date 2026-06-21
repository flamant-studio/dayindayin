import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!

async function getToken() {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }).toString(),
  })
  return ((await res.json()) as { access_token: string }).access_token
}

async function gql(token: string, q: string, v: any = {}): Promise<any> {
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query: q, variables: v }),
  })
  return (await res.json() as any).data
}

async function main() {
  const token = await getToken()
  // Get variant count distribution for each product type
  const types = ['Mug', 'Tank Top', 'Tote Bag', 'Art Print', 'Poster', 'Framed Print', 'Print Material', 'Postcard', 'Water Bottle', 'Wood Print', 'Apparel', 'Greeting Card']
  
  for (const type of types) {
    const data = await gql(token, `query($q: String!) {
      products(first: 5, query: $q) {
        edges { node { title handle variants(first: 10) { edges { node { title } } } } }
      }
    }`, { q: `product_type:"${type}" status:active` })
    
    const products = data?.products?.edges ?? []
    if (!products.length) continue
    
    const sample = products[0].node
    const variantCounts = products.map((e: any) => e.node.variants.edges.length)
    const vTitles = sample.variants.edges.map((e: any) => e.node.title).slice(0, 4).join(' | ')
    console.log(`${type.padEnd(18)} ${products.length} sampled | variants: [${variantCounts.join(',')}] | sample: "${vTitles}"`)
  }
}
main().catch(console.error)
