/**
 * Broader check: find ALL framed print products in Shopify via Admin API
 * Also check the specific Gelato-linked product (Tourism III)
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
  const data = await res.json() as { access_token: string }
  return data.access_token
}

async function adminFetch(token: string, query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json() as any
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

async function main() {
  const token = await getToken()

  // Check specific product from Gelato (Tourism III, externalId: 10541222953307)
  const gelatoProduct = await adminFetch(token, `
    query {
      product(id: "gid://shopify/Product/10541222953307") {
        id title handle productType
        variants(first: 20) {
          edges { node { id title price availableForSale } }
        }
      }
    }
  `)
  console.log('Gelato-linked product (Tourism III):')
  console.log(JSON.stringify(gelatoProduct?.product, null, 2))
  console.log()

  // Get all framed prints from Shopify
  const allFramed = await adminFetch(token, `
    query {
      products(first: 250, query: "product_type:Framed Print") {
        edges {
          node {
            id title handle
            variants(first: 5) {
              edges { node { id title price } }
            }
          }
        }
        pageInfo { hasNextPage }
      }
    }
  `)
  const products = allFramed?.products?.edges ?? []
  console.log(`Shopify products with type "Framed Print": ${products.length}`)
  // Show variant count distribution
  const dist: Record<string, number> = {}
  for (const { node: p } of products) {
    const n = p.variants?.edges?.length ?? 0
    dist[n] = (dist[n] ?? 0) + 1
  }
  console.log('Variant count distribution:', dist)
  console.log()

  // Show first 3 products
  for (const { node: p } of products.slice(0, 3)) {
    console.log(`"${p.title}" (${p.handle})`)
    for (const { node: v } of p.variants?.edges ?? []) {
      console.log(`  variant: "${v.title}" ${v.price}`)
    }
  }
}

main().catch(console.error)
