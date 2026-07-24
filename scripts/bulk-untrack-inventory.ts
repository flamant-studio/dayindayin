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

  // 1. Collect every tracked inventory item across all active products
  let cursor: string | null = null
  const trackedItems: string[] = []
  do {
    const data: any = await graphql(token, `
      query($cursor: String) {
        products(first: 50, after: $cursor, query: "status:active") {
          pageInfo { hasNextPage endCursor }
          edges { node {
            variants(first: 30) { edges { node { inventoryItem { id tracked } } } }
          } }
        }
      }
    `, { cursor })
    for (const pe of data.products.edges) {
      for (const ve of pe.node.variants.edges) {
        if (ve.node.inventoryItem.tracked) trackedItems.push(ve.node.inventoryItem.id)
      }
    }
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)

  console.log(`Found ${trackedItems.length} tracked inventory items. Untracking...`)

  let done = 0
  for (const id of trackedItems) {
    await graphql(token, `
      mutation($id: ID!, $input: InventoryItemInput!) {
        inventoryItemUpdate(id: $id, input: $input) { inventoryItem { id tracked } userErrors { message } }
      }
    `, { id, input: { tracked: false } })
    done++
    if (done % 25 === 0) console.log(`${done}/${trackedItems.length}`)
    await sleep(120)
  }
  console.log(`Done. Untracked ${done} inventory items.`)
}
main().catch(err => { console.error(err); process.exit(1) })
