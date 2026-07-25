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

const TAG_CATEGORY: Record<string, string> = {
  tufting: 'Tufted Work', embroidery: 'Embroidery', framed: 'Framed Print', mug: 'Mug',
  postcard: 'Postcard', poster: 'Poster', apparel: 'Apparel', photography: 'Photo Print',
  'greeting-card': 'Greeting Card', tote: 'Tote Bag', 'water-bottle': 'Water Bottle', 'wood-print': 'Wood Print',
}
function categoryLabel(tags: string[], title: string): string {
  for (const tag of tags) { const l = TAG_CATEGORY[tag.toLowerCase()]; if (l) return l }
  const t = title.toLowerCase()
  if (t.includes('tote bag') || t.includes('tote')) return 'Tote Bag'
  if (t.includes('greeting card')) return 'Greeting Card'
  if (t.includes('postcard')) return 'Postcard'
  if (t.includes('framed print')) return 'Framed Print'
  if (t.includes('wood print')) return 'Wood Print'
  if (t.includes('poster')) return 'Poster'
  if (t.includes('mug')) return 'Mug'
  if (t.includes('tank top') || t.includes('apparel')) return 'Apparel'
  if (t.includes('water bottle')) return 'Water Bottle'
  if (t.includes('fine art print') || t.includes('art print')) return 'Art Print'
  return 'Art Print'
}

async function main() {
  const token = await getToken()
  let cursor: string | null = null
  const byCategory = new Map<string, any[]>()
  do {
    const data: any = await graphql(token, `
      query($cursor: String) {
        products(first: 100, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          edges { node {
            handle title tags
            variants(first: 15) { edges { node { title image { url } } } }
          } }
        }
      }
    `, { cursor })
    for (const edge of data.products.edges) {
      const p = edge.node
      const cat = categoryLabel(p.tags, p.title)
      if (!byCategory.has(cat)) byCategory.set(cat, [])
      byCategory.get(cat)!.push(p)
    }
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)

  for (const [cat, products] of [...byCategory.entries()].sort()) {
    let distinct = 0, allSame = 0, missing = 0, singleVariant = 0
    const distinctHandles: string[] = []
    for (const p of products) {
      const images = p.variants.edges.map((e: any) => e.node.image?.url ?? null)
      if (images.length === 1) { singleVariant++; continue }
      const uniqueImages = new Set(images.filter(Boolean))
      if (images.some((i: any) => i === null)) missing++
      else if (uniqueImages.size === 1) allSame++
      else { distinct++; distinctHandles.push(p.handle) }
    }
    console.log(`${cat}: ${products.length} total — ${distinct} distinct-per-variant, ${allSame} all-same-image, ${missing} missing-image, ${singleVariant} single-variant${distinctHandles.length ? '  [' + distinctHandles.slice(0,3).join(', ') + ']' : ''}`)
  }
}
main().catch(err => { console.error(err); process.exit(1) })
