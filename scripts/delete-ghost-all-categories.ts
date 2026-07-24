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
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  const token = await getToken()
  let cursor: string | null = null
  const products: any[] = []
  do {
    const data: any = await graphql(token, `
      query($cursor: String) {
        products(first: 50, after: $cursor, query: "status:active") {
          pageInfo { hasNextPage endCursor }
          edges { node {
            id title
            variants(first: 30) { edges { node { id image { url } } } }
          } }
        }
      }
    `, { cursor })
    products.push(...data.products.edges.map((e:any)=>e.node))
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)

  // exact-suffix match, no substring overlap; skip Framed Print (already done)
  const targets = products.filter((p:any) =>
    (p.title.endsWith('Fine Art Print') || p.title.endsWith('Poster') || p.title.endsWith('Art Print')) &&
    !p.title.endsWith('Framed Print')
  )
  console.log(`Scanning ${targets.length} products (Fine Art Print / Poster / Art Print)\n`)

  let totalDeleted = 0
  for (const p of targets) {
    const variants = p.variants.edges.map((e:any)=>e.node)
    const ghostIds = variants.filter((v:any)=>!v.image).map((v:any)=>v.id)
    const withImageCount = variants.length - ghostIds.length
    if (ghostIds.length === 0) continue
    if (withImageCount === 0) { console.log(`${p.title}: SKIP - would delete all variants, refusing`); continue }

    const result = await graphql(token, `
      mutation($productId: ID!, $variantsIds: [ID!]!) {
        productVariantsBulkDelete(productId: $productId, variantsIds: $variantsIds) {
          userErrors { field message }
        }
      }
    `, { productId: p.id, variantsIds: ghostIds })

    const errors = result.productVariantsBulkDelete.userErrors
    if (errors.length) {
      console.log(`${p.title}: ERROR`, JSON.stringify(errors))
    } else {
      totalDeleted += ghostIds.length
      console.log(`${p.title}: deleted ${ghostIds.length} (kept ${withImageCount})`)
    }
    await sleep(300)
  }
  console.log(`\nTotal ghost variants deleted: ${totalDeleted}`)
}
main().catch(err => { console.error(err); process.exit(1) })
