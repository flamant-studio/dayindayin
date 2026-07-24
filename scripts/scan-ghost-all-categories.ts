import { readFileSync } from 'fs'
const domain = 'dayindayin.myshopify.com'
const clientId = '2e4910e46f5e7ccce75e8c86ba05a014'
const envContent = readFileSync('/Users/flamant-mini/Documents/FLAMANT/dayindayin-site/.env.local', 'utf8')
const clientSecret = envContent.match(/SHOPIFY_CLIENT_SECRET=(.+)/)?.[1]?.trim()

async function getToken() {
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' })
  })
  return (await res.json() as any).access_token
}
async function graphql(token: string, query: string, variables: any = {}) {
  const res = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables })
  })
  const j = await res.json() as any
  if (j.errors) throw new Error(JSON.stringify(j.errors))
  return j.data
}

async function scanCategory(token: string, suffix: string) {
  let cursor: string | null = null
  const products: any[] = []
  do {
    const data: any = await graphql(token, `
      query($cursor: String, $q: String!) {
        products(first: 50, after: $cursor, query: $q) {
          pageInfo { hasNextPage endCursor }
          edges { node {
            title
            variants(first: 30) { edges { node { image { url } } } }
          } }
        }
      }
    `, { cursor, q: `title:*${suffix}* AND status:active` })
    products.push(...data.products.edges.map((e:any)=>e.node))
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)

  let totalGhosts = 0, totalReal = 0
  for (const p of products) {
    const variants = p.variants.edges.map((e:any)=>e.node)
    const ghosts = variants.filter((v:any)=>!v.image).length
    const real = variants.length - ghosts
    totalGhosts += ghosts
    totalReal += real
    if (ghosts > 0) console.log(`  GHOST: ${p.title} — ${real} real, ${ghosts} ghost`)
  }
  console.log(`${suffix}: ${products.length} products, ${totalReal} real variants, ${totalGhosts} ghost variants`)
}

async function main() {
  const token = await getToken()
  await scanCategory(token, 'Fine Art Print')
  await scanCategory(token, 'Poster')
  await scanCategory(token, 'Art Print')
}
main().catch(err => { console.error(err); process.exit(1) })
