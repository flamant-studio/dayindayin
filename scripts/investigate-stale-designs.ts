import { readFileSync } from 'fs'
const domain = 'dayindayin.myshopify.com'
const clientId = '2e4910e46f5e7ccce75e8c86ba05a014'
const envContent = readFileSync('/Users/flamant-mini/Documents/FLAMANT/dayindayin-site/.env.local', 'utf8')
const clientSecret = envContent.match(/SHOPIFY_CLIENT_SECRET=(.+)/)?.[1]?.trim()
const GELATO_KEY = envContent.match(/GELATO_API_KEY=(.+)/)?.[1]?.trim()
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

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

async function shopifySearch(token: string, q: string, n: number) {
  const data: any = await graphql(token, `
    query($q: String!) {
      products(first: ${n}, query: $q) {
        edges { node {
          id title handle updatedAt
          images(first: 12) { edges { node { url } } }
          media(first: 12) { edges { node { ... on MediaImage { updatedAt image { url } } } } }
          variants(first: 12) { edges { node { title image { url } } } }
        } }
      }
    }
  `, { q })
  return data.products.edges.map((e: any) => e.node)
}

async function fetchAllGelato() {
  let offset = 0, limit = 100
  const all: any[] = []
  while (true) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=${limit}&offset=${offset}`, { headers: { 'X-API-KEY': GELATO_KEY! } })
    const j = await r.json() as any
    const products = j.products ?? []
    all.push(...products)
    if (products.length < limit) break
    offset += limit
  }
  return all
}
async function gelatoDetail(id: string) {
  const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${id}`, { headers: { 'X-API-KEY': GELATO_KEY! } })
  return await r.json() as any
}

function shortUrl(u?: string | null) {
  if (!u) return 'none'
  try {
    const url = new URL(u)
    const file = url.pathname.split('/').pop()
    const v = url.searchParams.get('v')
    return `${file}${v ? `?v=${v}` : ''}`
  } catch { return u }
}

async function reportProduct(token: string, gelatoAll: any[], node: any) {
  console.log(`\n════════ ${node.title}  (${node.handle})`)
  console.log(`  Shopify updatedAt: ${node.updatedAt}`)
  const imgs = node.images.edges.map((e: any) => e.node.url)
  console.log(`  Shopify images (${imgs.length}):`)
  for (const u of imgs) console.log(`    - ${shortUrl(u)}`)
  console.log(`  Shopify media updatedAt:`)
  for (const e of node.media.edges) {
    if (e.node.image) console.log(`    - ${shortUrl(e.node.image.url)}   mediaUpdatedAt=${e.node.updatedAt}`)
  }
  const varImgs = node.variants.edges.map((e: any) => e.node.image?.url ?? null)
  const uniq = new Set(varImgs.filter(Boolean))
  console.log(`  Variant images: ${node.variants.edges.length} variants, ${uniq.size} distinct` + (varImgs.some((v:any)=>!v) ? ' (some NULL)' : ''))

  // match gelato by title
  const matches = gelatoAll.filter(p => p.title === node.title)
  if (!matches.length) { console.log(`  Gelato: NO product with matching title`); return }
  for (const m of matches) {
    const d = await gelatoDetail(m.id)
    const statuses = (d.productImages ?? []).map((i: any) => ({ status: i.status, updatedAt: i.updatedAt }))
    console.log(`  Gelato id=${d.id} status=${d.status} publishedAt=${d.publishedAt} updatedAt=${d.updatedAt}`)
    console.log(`    productImages: ${JSON.stringify(statuses)}`)
  }
}

async function main() {
  const token = await getToken()
  const gelatoAll = await fetchAllGelato()
  console.log(`Gelato store products total: ${gelatoAll.length}`)

  console.log('\n########## SHERO PRODUCTS ##########')
  const shero = await shopifySearch(token, 'title:*shero*', 6)
  console.log(`Found ${shero.length} SHERO products (showing up to 4 varied types)`)
  // pick variety
  const pick = shero.slice(0, 4)
  for (const n of pick) await reportProduct(token, gelatoAll, n)

  console.log('\n\n########## MUG PRODUCTS ##########')
  const mugs = await shopifySearch(token, 'product_type:Mug', 4)
  for (const n of mugs.slice(0, 3)) await reportProduct(token, gelatoAll, n)
}
main().catch(err => { console.error(err); process.exit(1) })
