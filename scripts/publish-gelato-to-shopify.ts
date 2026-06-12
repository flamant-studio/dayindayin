/**
 * publish-gelato-to-shopify.ts
 *
 * Publishes all synced Gelato products to the Shopify Online Store channel.
 * Uses the product-level externalId (Shopify product ID) directly — no variant resolution needed.
 * Handles pagination for 300+ products.
 *
 * Run: npx tsx scripts/publish-gelato-to-shopify.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!
const ONLINE_STORE_PUB_ID = 'gid://shopify/Publication/337681482075'

async function getShopifyToken(): Promise<string> {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }).toString(),
  })
  const data = await res.json() as { access_token: string }
  return data.access_token
}

async function shopifyGql(token: string, query: string, variables?: Record<string, unknown>) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  })
  return res.json() as Promise<{ data: Record<string, unknown>; errors?: unknown[] }>
}

interface GelatoProduct {
  id: string
  title: string
  externalId?: string | null
  status?: string
}

async function getGelatoProducts(): Promise<GelatoProduct[]> {
  const all: GelatoProduct[] = []
  let offset = 0
  const limit = 100
  while (true) {
    const res = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products?limit=${limit}&offset=${offset}`, {
      headers: { 'X-API-KEY': GELATO_API_KEY },
    })
    const data = await res.json() as { products?: GelatoProduct[] }
    const page = data.products ?? []
    all.push(...page)
    if (page.length < limit) break
    offset += limit
    await new Promise(r => setTimeout(r, 200))
  }
  return all
}

async function publishProduct(token: string, shopifyProductId: string, title: string): Promise<boolean> {
  const res = await shopifyGql(token,
    `mutation Publish($id: ID!, $pubId: ID!) {
      publishablePublish(id: $id, input: { publicationIds: [$pubId] }) {
        userErrors { field message }
      }
    }`,
    { id: `gid://shopify/Product/${shopifyProductId}`, pubId: ONLINE_STORE_PUB_ID }
  )
  const errs = (res.data?.publishablePublish as { userErrors: Array<{ message: string }> })?.userErrors ?? []
  if (errs.length > 0) {
    console.error(`  ✗ ${title}: ${JSON.stringify(errs)}`)
    return false
  }
  console.log(`  ✓ ${title}`)
  return true
}

async function main() {
  console.log('=== Gelato → Shopify Online Store publish ===\n')

  const products = await getGelatoProducts()
  console.log(`Fetched ${products.length} Gelato products`)

  const synced = products.filter(p => p.externalId)
  const notSynced = products.filter(p => !p.externalId)

  console.log(`Synced to Shopify: ${synced.length}`)
  if (notSynced.length > 0) {
    console.log(`Not yet synced: ${notSynced.length} (${notSynced.slice(0, 5).map(p => p.title).join(', ')}${notSynced.length > 5 ? '...' : ''})`)
    console.log('These will appear after Gelato finishes syncing (usually 1–5 min per product).\n')
  }
  console.log()

  const token = await getShopifyToken()

  let published = 0
  let failed = 0

  for (const p of synced) {
    const ok = await publishProduct(token, p.externalId!, p.title)
    if (ok) published++; else failed++
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\nDone. Published: ${published} | Failed: ${failed}`)
  if (notSynced.length > 0) {
    console.log(`Re-run after Gelato syncs the remaining ${notSynced.length} products.`)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
