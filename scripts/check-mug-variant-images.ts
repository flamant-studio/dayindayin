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
  return (await res.json() as any).data
}

async function main() {
  const token = await getToken()
  let cursor: string | null = null
  const mugs: any[] = []
  do {
    const data: any = await graphql(token, `
      query($cursor: String) {
        products(first: 50, after: $cursor, query: "product_type:Mug") {
          pageInfo { hasNextPage endCursor }
          edges { node {
            title
            handle
            variants(first: 10) {
              edges { node {
                title
                image { url }
              } }
            }
          } }
        }
      }
    `, { cursor })
    for (const edge of data.products.edges) mugs.push(edge.node)
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)

  console.log(`Total mug products: ${mugs.length}\n`)
  let allSame = 0, distinct = 0, missing = 0
  for (const m of mugs) {
    const images = m.variants.edges.map((e: any) => e.node.image?.url ?? null)
    const uniqueImages = new Set(images.filter(Boolean))
    const hasNull = images.some((i: any) => i === null)
    let status: string
    if (hasNull) { status = 'MISSING image on ≥1 variant'; missing++ }
    else if (uniqueImages.size === 1) { status = 'ALL VARIANTS SAME IMAGE'; allSame++ }
    else { status = `${uniqueImages.size} distinct images across ${images.length} variants`; distinct++ }
    console.log(`${m.handle}: ${status}`)
  }
  console.log(`\nSummary: ${distinct} with distinct per-variant images, ${allSame} all-same-image, ${missing} with missing images`)
}
main().catch(err => { console.error(err); process.exit(1) })
