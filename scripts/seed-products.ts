/**
 * seed-products.ts
 *
 * Creates all products in Shopify with correct pricing, descriptions, tags,
 * and collection assignment.
 *
 * DO NOT RUN until:
 *   1. seed-collections.ts has been run and verified
 *   2. Gelato is installed and connected in Shopify admin
 *   3. SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET are set in .env.local
 *
 * Run with:
 *   npx tsx scripts/seed-products.ts
 *
 * The script creates products in batches, pausing between them to respect API rate limits.
 * Expected runtime: ~20–30 minutes for 285 products.
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

async function adminMutation<T>(token: string, mutation: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query: mutation, variables }),
  })
  const json = await res.json()
  if (json.errors?.length) throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`)
  return json.data as T
}

// Step 1: Fetch all existing collections to get their Shopify IDs
const LIST_COLLECTIONS = `
  query ListCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
        }
      }
    }
  }
`

const CREATE_PRODUCT = `
  mutation CreateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        handle
        title
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

const ADD_TO_COLLECTION = `
  mutation AddToCollection($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) {
      collection {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`

async function fetchCollectionIds(token: string): Promise<Record<string, string>> {
  const data = await adminMutation<{
    collections: { edges: Array<{ node: { id: string; handle: string } }> }
  }>(token, LIST_COLLECTIONS, { first: 250 })

  const map: Record<string, string> = {}
  for (const { node } of data.collections.edges) {
    map[node.handle] = node.id
  }
  return map
}

async function main() {
  console.log(`Seeding ${PRODUCT_COUNT} products into Shopify...`)
  console.log('Expected runtime: ~20–30 minutes\n')

  const token = await getToken()

  // Build collection handle → Shopify ID map
  console.log('Fetching collection IDs...')
  const collectionIds = await fetchCollectionIds(token)
  console.log(`Found ${Object.keys(collectionIds).length} collections\n`)

  let created = 0
  let failed = 0

  for (const product of ALL_PRODUCTS) {
    const catalogCollection = COLLECTIONS.find((c) => c.id === product.collectionId)
    const collectionShopifyId = catalogCollection
      ? collectionIds[catalogCollection.handle]
      : undefined

    try {
      const result = await adminMutation<{
        productCreate: {
          product: {
            id: string
            handle: string
            title: string
            variants: { edges: Array<{ node: { id: string } }> }
          } | null
          userErrors: Array<{ field: string; message: string }>
        }
      }>(token, CREATE_PRODUCT, {
        input: {
          title: product.title,
          handle: product.handle,
          descriptionHtml: `<p>${product.description}</p>`,
          productType: product.format,
          tags: product.tags,
          status: 'DRAFT', // Set to ACTIVE manually after Gelato image upload
          variants: [
            {
              price: product.priceKr.toString(),
              sku: product.did,
              taxable: true,
              requiresShipping: true,
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
      })

      if (result.productCreate.userErrors.length > 0) {
        console.error(`  ERROR ${product.handle}:`, result.productCreate.userErrors)
        failed++
        continue
      }

      const shopifyProduct = result.productCreate.product!
      console.log(`  ✓ [${++created}/${PRODUCT_COUNT}] ${product.title}`)

      // Assign to collection
      if (collectionShopifyId) {
        try {
          await adminMutation(token, ADD_TO_COLLECTION, {
            id: collectionShopifyId,
            productIds: [shopifyProduct.id],
          })
        } catch {
          console.warn(`    (collection assignment failed for ${product.handle})`)
        }
      }

      // Pause to respect rate limits
      await new Promise((r) => setTimeout(r, 600))
    } catch (err) {
      console.error(`  FAILED ${product.handle}:`, err)
      failed++
    }
  }

  console.log(`\nDone. Created: ${created}, Failed: ${failed}`)
  console.log('\nNext steps:')
  console.log('1. Go to Shopify admin → Products')
  console.log('2. For each product, use Gelato app to upload the artwork image')
  console.log('3. Set product status to Active')
  console.log('4. Verify prices and collection assignments')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
