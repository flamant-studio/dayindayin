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

async function gql(token: string, q: string, v: any = {}) {
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query: q, variables: v }),
  })
  return (await res.json() as any).data
}

async function main() {
  const token = await getToken()
  let total = 0, singleVariant = 0, cursor: string | null = null
  while (true) {
    const data = await gql(token, `query($f: Int!, $a: String) {
      products(first: $f, after: $a, query: "product_type:\\"Dad Cap\\" status:active") {
        edges { node { title variants(first: 3) { edges { node { title price } } } } }
        pageInfo { hasNextPage endCursor }
      }
    }`, { f: 250, a: cursor })
    for (const { node: p } of data.products.edges) {
      total++
      const variants = p.variants.edges.map((e: any) => e.node.title)
      if (variants.length === 1 && variants[0] === 'Default Title') singleVariant++
    }
    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
  }
  console.log(`Total dad caps: ${total}`)
  console.log(`Single "Default Title": ${singleVariant}`)
}
main().catch(console.error)
