/**
 * seed-products.ts
 *
 * Creates all products in Shopify via REST API.
 * Shopify Admin API 2025-01 removed variants from ProductInput in GraphQL —
 * REST POST /products.json still supports variants in one call.
 *
 * Prerequisites:
 *   1. seed-collections.ts has been run
 *   2. .env.local has SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET
 *
 *   npx tsx scripts/seed-products.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { ALL_PRODUCTS, PRODUCT_COUNT } from '../lib/catalog/products'
import { COLLECTIONS } from '../lib/catalog/collections'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!
const API_VERSION = '2025-01'

async function getToken(): Promise<string> {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }).toString(),
  })
  if (!res.ok) throw new Error(`Token mint failed: ${res.status}`)
  const data = await res.json() as { access_token: string }
  return data.access_token
}

async function rest<T>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`REST ${method} ${path}: ${res.status} — ${err.slice(0, 200)}`)
  }
  return res.json() as Promise<T>
}

async function fetchCollectionMap(token: string): Promise<Record<string, number>> {
  const data = await rest<{ custom_collections: Array<{ id: number; handle: string }> }>(
    token, 'GET', '/custom_collections.json?limit=250'
  )
  const map: Record<string, number> = {}
  for (const c of data.custom_collections) {
    map[c.handle] = c.id
  }
  return map
}

async function main() {
  console.log(`Seeding ${PRODUCT_COUNT} products into Shopify via REST API...`)

  const token = await getToken()

  console.log('Fetching collection IDs...')
  const collectionMap = await fetchCollectionMap(token)
  console.log(`Found ${Object.keys(collectionMap).length} collections\n`)

  let created = 0
  let failed = 0

  for (const product of ALL_PRODUCTS) {
    const catalogCollection = COLLECTIONS.find(c => c.id === product.collectionId)
    const collectionId = catalogCollection ? collectionMap[catalogCollection.handle] : undefined

    try {
      const result = await rest<{ product: { id: number; handle: string } }>(
        token, 'POST', '/products.json',
        {
          product: {
            title: product.title,
            handle: product.handle,
            body_html: `<p>${product.description}</p>`,
            product_type: product.format,
            tags: product.tags.join(', '),
            status: 'draft',
            variants: [
              {
                price: product.priceKr.toFixed(2),
                sku: product.did,
                taxable: true,
                requires_shipping: true,
                inventory_management: null,
              },
            ],
            metafields: [
              {
                namespace: 'did',
                key: 'id',
                value: product.did,
                type: 'single_line_text_field',
              },
              {
                namespace: 'gelato',
                key: 'product_uid',
                value: product.gelatoProductUid,
                type: 'single_line_text_field',
              },
            ],
          },
        }
      )

      const shopifyProductId = result.product.id
      console.log(`  ✓ [${++created}/${PRODUCT_COUNT}] ${product.title}`)

      if (collectionId) {
        try {
          await rest(token, 'POST', '/collects.json', {
            collect: { product_id: shopifyProductId, collection_id: collectionId },
          })
        } catch {
          // Collection assignment is non-fatal
        }
      }

      await new Promise(r => setTimeout(r, 500))
    } catch (err) {
      console.error(`  FAILED [${product.handle}]:`, err instanceof Error ? err.message : err)
      failed++
    }
  }

  console.log(`\nDone. Created: ${created}  Failed: ${failed}`)
  console.log('\nNext steps:')
  console.log('1. In Shopify admin → Products: confirm products created with correct prices')
  console.log('2. Use Gelato app to attach artwork images to each product')
  console.log('3. Set products to Active once images are attached')
}

main().catch(err => { console.error(err); process.exit(1) })
