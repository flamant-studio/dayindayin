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

async function main() {
  const token = await getToken()
  // fetch all Framed Print products
  let cursor: string | null = null
  const products: any[] = []
  do {
    const data: any = await graphql(token, `
      query($cursor: String) {
        products(first: 50, after: $cursor, query: "title:*Framed Print* AND status:active") {
          pageInfo { hasNextPage endCursor }
          edges { node {
            id title
            variants(first: 30) { edges { node {
              id title image { url } price
            } } }
          } }
        }
      }
    `, { cursor })
    products.push(...data.products.edges.map((e:any)=>e.node))
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)

  console.log(`Found ${products.length} Framed Print products\n`)
  let totalGhosts = 0
  const results: any[] = []
  for (const p of products) {
    const variants = p.variants.edges.map((e:any)=>e.node)
    const withImage = variants.filter((v:any)=>v.image)
    const noImage = variants.filter((v:any)=>!v.image)
    totalGhosts += noImage.length
    results.push({ title: p.title, total: variants.length, withImage: withImage.length, ghosts: noImage.length })
    console.log(`${p.title.padEnd(40)} total=${variants.length} withImage=${withImage.length} ghosts(noImage)=${noImage.length}`)
  }
  console.log(`\nTotal ghost (no-image) variants across all Framed Print products: ${totalGhosts}`)
  const zeroImage = results.filter(r => r.withImage === 0)
  if (zeroImage.length) {
    console.log('\n!!! WARNING - products with ZERO imaged variants (would delete everything, do not touch):')
    zeroImage.forEach(r => console.log(' -', r.title))
  }
}
main().catch(err => { console.error(err); process.exit(1) })
