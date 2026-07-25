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

// Same raw-title patterns as lib ProductOptions.tsx normalizeTitle()
function normalize(title: string): string | null {
  let t = title.replace(/\s*-\s*(Vertical|Horizontal)$/i, '').trim()
  if (/21[×x]29\.?7\s*cm\s*\/\s*8[×x]12[""″]/i.test(t)) return 'A4'
  if (/15[×x]20\s*cm\s*\/\s*6[×x]8[""″]/i.test(t)) return 'A5'
  const aMatch = t.match(/^(A[1-4])\b/)
  if (aMatch) return aMatch[1]
  return null
}

async function main() {
  const token = await getToken()
  let cursor: string | null = null
  const affected: any[] = []
  do {
    const data: any = await graphql(token, `
      query($cursor: String) {
        products(first: 100, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          edges { node {
            handle title
            variants(first: 10) { edges { node { title price } } }
          } }
        }
      }
    `, { cursor })
    for (const edge of data.products.edges) {
      const p = edge.node
      const sizes: Record<string, number> = {}
      for (const v of p.variants.edges) {
        const label = normalize(v.node.title)
        if (label) sizes[label] = parseFloat(v.node.price)
      }
      if (sizes['A5'] != null && sizes['A4'] != null && sizes['A5'] > sizes['A4']) {
        affected.push({ handle: p.handle, title: p.title, sizes })
      }
    }
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)

  console.log(`Products where A5 > A4: ${affected.length}\n`)
  for (const p of affected) console.log(p.handle, JSON.stringify(p.sizes))
}
main().catch(err => { console.error(err); process.exit(1) })
