/**
 * publish-to-online-store.ts
 *
 * Publishes all ACTIVE Shopify products to the Online Store sales channel
 * so the Storefront API can access them for cart operations.
 *
 * Run: npx tsx scripts/publish-to-online-store.ts
 * Dry run: DRY_RUN=1 npx tsx scripts/publish-to-online-store.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!
const DRY_RUN = process.env.DRY_RUN === '1'

const ONLINE_STORE_PUBLICATION_ID = 'gid://shopify/Publication/337681482075'

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

let _token: string | null = null
async function graphql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!_token) _token = await getToken()
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': _token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json() as { data: T; errors?: unknown[] }
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
  return json.data
}

interface ProductNode {
  id: string
  title: string
  publishedOnPublication: boolean
}

async function getActiveProducts(): Promise<ProductNode[]> {
  let products: ProductNode[] = []
  let cursor: string | null = null

  while (true) {
    const data = await graphql<{
      products: {
        edges: { node: ProductNode }[]
        pageInfo: { hasNextPage: boolean; endCursor: string }
      }
    }>(
      `query GetActive($after: String, $pubId: ID!) {
        products(first: 50, after: $after, query: "status:active") {
          edges {
            node {
              id
              title
              publishedOnPublication(publicationId: $pubId)
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { after: cursor, pubId: ONLINE_STORE_PUBLICATION_ID }
    )
    products = products.concat(data.products.edges.map((e) => e.node))
    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
  }

  return products
}

async function publishProduct(productId: string): Promise<void> {
  const data = await graphql<{
    publishablePublish: { userErrors: { field: string[]; message: string }[] }
  }>(
    `mutation Publish($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        userErrors { field message }
      }
    }`,
    { id: productId, input: [{ publicationId: ONLINE_STORE_PUBLICATION_ID }] }
  )
  const errs = data.publishablePublish.userErrors
  if (errs.length > 0) throw new Error(errs.map((e) => e.message).join(', '))
}

async function main() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET not set')
    process.exit(1)
  }

  console.log('Fetching active products...')
  const products = await getActiveProducts()
  const unpublished = products.filter((p) => !p.publishedOnPublication)

  console.log(`Total active: ${products.length}`)
  console.log(`Already published to Online Store: ${products.length - unpublished.length}`)
  console.log(`Need to publish: ${unpublished.length}`)

  if (unpublished.length === 0) {
    console.log('\nAll products already published. Nothing to do.')
    return
  }

  if (DRY_RUN) {
    console.log('\nDRY RUN — would publish:')
    unpublished.forEach((p) => console.log(`  ${p.title}`))
    return
  }

  console.log('\nPublishing...')
  let ok = 0
  let failed = 0

  for (const p of unpublished) {
    process.stdout.write(`▸ ${p.title.slice(0, 60)} ... `)
    try {
      await publishProduct(p.id)
      console.log('✓')
      ok++
      await new Promise((r) => setTimeout(r, 200))
    } catch (err) {
      console.log(`FAILED: ${err}`)
      failed++
    }
  }

  console.log(`\nDone. Published: ${ok}, Failed: ${failed}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
