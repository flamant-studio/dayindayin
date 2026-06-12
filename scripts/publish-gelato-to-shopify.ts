/**
 * publish-gelato-to-shopify.ts
 *
 * Waits for Gelato products to sync to Shopify, then publishes them to Online Store.
 * Polls every 30s until all products have Shopify IDs, then bulk-publishes.
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
  externalId?: string
  variants: Array<{ externalId?: string }>
}

async function getGelatoProducts(): Promise<GelatoProduct[]> {
  const all: GelatoProduct[] = []
  let offset = 0
  const limit = 100
  while (true) {
    const res = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products?limit=${limit}&offset=${offset}`, {
      headers: { 'X-API-KEY': GELATO_API_KEY },
    })
    const data = await res.json() as { products?: GelatoProduct[]; data?: GelatoProduct[] }
    const page = data.products ?? data.data ?? []
    all.push(...page)
    if (page.length < limit) break
    offset += limit
    await new Promise(r => setTimeout(r, 200))
  }
  return all
}

async function getGelatoProduct(id: string): Promise<GelatoProduct> {
  const res = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products/${id}`, {
    headers: { 'X-API-KEY': GELATO_API_KEY },
  })
  return res.json() as Promise<GelatoProduct>
}

async function publishProduct(token: string, shopifyProductId: string): Promise<boolean> {
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
    console.error(`  Error: ${JSON.stringify(errs)}`)
    return false
  }
  return true
}

async function main() {
  console.log('=== Gelato → Shopify publish ===\n')

  let synced = 0
  let total = 0
  let shopifyIds: string[] = []

  // Poll until all products have Shopify IDs
  while (true) {
    const products = await getGelatoProducts()
    total = products.length

    // Use variant externalIds from list response (no individual calls needed)
    shopifyIds = []
    for (const p of products) {
      const variantWithId = p.variants?.find(v => v.externalId)
      if (variantWithId?.externalId) {
        shopifyIds.push(variantWithId.externalId)
      }
    }

    synced = shopifyIds.length
    const pct = Math.round((synced / total) * 100)
    process.stdout.write(`\rSynced: ${synced}/${total} (${pct}%)  `)

    if (synced === total) {
      console.log('\nAll products synced to Shopify!\n')
      break
    }

    if (synced > 0) {
      console.log(`\n${total - synced} still syncing — publishing the ${synced} that are ready...\n`)
      break
    }

    await new Promise(r => setTimeout(r, 30_000))
  }

  // Extract just the numeric IDs
  const numericIds = shopifyIds.map(id => {
    // externalId might be a Shopify numeric ID or a GID
    return id.replace('gid://shopify/ProductVariant/', '').replace('gid://shopify/Product/', '')
  })

  // For each variant ID, we need the product ID
  // Gelato's externalId in variants is the Shopify variant ID, not product ID
  // We need to resolve variant IDs → product IDs via Shopify
  console.log(`Publishing ${numericIds.length} products to Online Store...\n`)
  const token = await getShopifyToken()

  let published = 0
  let failed = 0

  for (const variantId of numericIds) {
    // Resolve variant → product
    const res = await shopifyGql(token,
      `query { productVariant(id: "gid://shopify/ProductVariant/${variantId}") { product { id title } } }`
    )
    const product = (res.data?.productVariant as { product: { id: string; title: string } })?.product
    if (!product) {
      console.log(`  Could not resolve variant ${variantId}`)
      failed++
      continue
    }

    const ok = await publishProduct(token, product.id.replace('gid://shopify/Product/', ''))
    if (ok) {
      console.log(`  ✓ ${product.title}`)
      published++
    } else {
      console.log(`  ✗ ${product.title}`)
      failed++
    }
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\nDone. Published: ${published} | Failed: ${failed}`)
}

main().catch(err => { console.error(err); process.exit(1) })
