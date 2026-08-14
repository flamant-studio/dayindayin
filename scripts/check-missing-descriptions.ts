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

async function gql(token: string, query: string, variables: Record<string, unknown> = {}): Promise<any> {
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  })
  return (await res.json() as any).data
}

async function main() {
  const token = await getToken()
  let noDesc = 0, hasDesc = 0
  let cursor: string | null = null
  const examples: { title: string; type: string }[] = []
  
  while (true) {
    const data = await gql(token, `
      query($first: Int!, $after: String) {
        products(first: $first, after: $after, query: "status:active") {
          edges { node { title productType bodyHtml } }
          pageInfo { hasNextPage endCursor }
        }
      }
    `, { first: 250, after: cursor })
    
    for (const { node: p } of data.products.edges) {
      const stripped = (p.bodyHtml ?? '').replace(/<[^>]*>/g, '').trim()
      if (!stripped) {
        noDesc++
        if (examples.length < 15) examples.push({ title: p.title, type: p.productType })
      } else {
        hasDesc++
      }
    }
    
    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
  }
  
  console.log(`Has description: ${hasDesc}`)
  console.log(`No description: ${noDesc}`)
  console.log(`\nExamples without desc:`)
  examples.forEach(e => console.log(`  [${e.type}] ${e.title}`))
}
main().catch(e => { console.error(e); process.exit(1) })
