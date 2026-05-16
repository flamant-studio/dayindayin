/**
 * seed-collections.ts
 *
 * Creates 25 Shopify collections for the DayInDayIn shop.
 *
 * DO NOT RUN until:
 *   1. Gelato is installed in Shopify admin
 *   2. SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET are set in .env.local
 *
 * Run with:
 *   npx tsx scripts/seed-collections.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { COLLECTIONS } from '../lib/catalog/collections'

// Load .env.local
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

const CREATE_COLLECTION = `
  mutation CreateCollection($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        handle
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`

async function main() {
  console.log(`Creating ${COLLECTIONS.length} collections in Shopify...`)
  const token = await getToken()

  for (const col of COLLECTIONS) {
    try {
      const result = await adminMutation<{
        collectionCreate: {
          collection: { id: string; handle: string; title: string } | null
          userErrors: Array<{ field: string; message: string }>
        }
      }>(token, CREATE_COLLECTION, {
        input: {
          title: col.title,
          handle: col.handle,
          descriptionHtml: `<p>${col.description}</p>`,
        },
      })

      if (result.collectionCreate.userErrors.length > 0) {
        console.error(`  ERROR ${col.handle}:`, result.collectionCreate.userErrors)
      } else {
        console.log(`  ✓ ${col.title} → ${result.collectionCreate.collection?.id}`)
      }

      // Rate limit: ~2 requests/second is safe for Admin API
      await new Promise((r) => setTimeout(r, 500))
    } catch (err) {
      console.error(`  FAILED ${col.handle}:`, err)
    }
  }

  console.log('\nDone. Verify collections in Shopify admin before running seed-products.ts')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
