import { readFileSync } from 'fs'

const domain = 'dayindayin.myshopify.com'
const clientId = '2e4910e46f5e7ccce75e8c86ba05a014'
const envContent = readFileSync('/Users/flamant-mini/Documents/FLAMANT/dayindayin-site/.env.local', 'utf8')
const clientSecret = envContent.match(/SHOPIFY_CLIENT_SECRET=(.+)/)?.[1]?.trim()

async function getToken() {
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' })
  })
  const data = await res.json() as any
  return data.access_token
}

async function graphql(token: string, query: string, variables: any = {}) {
  const res = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables })
  })
  const data = await res.json() as any
  return data.data
}

async function main() {
  const token = await getToken()
  let cursor: string | null = null
  const all: any[] = []
  do {
    const data: any = await graphql(token, `
      query($cursor: String) {
        products(first: 100, after: $cursor, query: "status:active") {
          pageInfo { hasNextPage endCursor }
          edges { node { title tags handle } }
        }
      }
    `, { cursor })
    all.push(...data.products.edges.map((e: any) => e.node))
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)

  console.log('Total active products:', all.length)

  const tagCounts: Record<string, number> = {}
  for (const p of all) {
    for (const t of p.tags) tagCounts[t] = (tagCounts[t] || 0) + 1
  }
  console.log('\n--- All tags with counts ---')
  console.log(JSON.stringify(tagCounts, null, 2))

  const MOTIFS = [
    'Neko Paw Black & White','Neko Paw Colour','Neko Pussy Human','Shero','Elephant',
    'Gangster rabbit','Mask against Unsolicited Phone Calls','Mask against Conformism',
    'Mask against Indifference','Mask against Boredom','Mask against Binary Expectations',
    'Greek Sea Monsters','Tourism I','Tourism II','Tourism III','Tourism IV',
    'Bird Man','Vaginals','Poppy Field','Night Poppies','Printed Tufting Works'
  ]
  console.log('\n--- Title search per motif (first 3 matches) ---')
  for (const m of MOTIFS) {
    const key = m.split(' ')[0].toLowerCase()
    const matches = all.filter(p => p.title.toLowerCase().includes(key.replace(/[^a-z]/g, '')))
    console.log(`${m}: ${matches.length} title-matches ->`, matches.slice(0,3).map(p=>p.title))
  }
}
main().catch(err => { console.error(err); process.exit(1) })
