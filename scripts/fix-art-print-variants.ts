/**
 * Add A4/A3/A2 size variants to Art Print products.
 * Also handles Poster type (A3/A2/A1).
 * Default Title becomes A4 for art prints, A3 for posters.
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!

// Art print pricing DKK
const ART_PRINT_PRICES: Record<string, string> = {
  'A4': '149.00',
  'A3': '199.00',
  'A2': '299.00',
}

// Poster pricing DKK (semi-glossy, larger format)
const POSTER_PRICES: Record<string, string> = {
  'A3': '149.00',
  'A2': '199.00',
  'A1': '299.00',
}

async function getToken(): Promise<string> {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }).toString(),
  })
  return ((await res.json()) as { access_token: string }).access_token
}

async function gql(token: string, query: string, variables: Record<string, unknown> = {}): Promise<any> {
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json() as any
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

async function getProducts(token: string, type: string) {
  const all: { id: string; title: string }[] = []
  let cursor: string | null = null
  while (true) {
    const data = await gql(token, `
      query($first: Int!, $after: String, $q: String!) {
        products(first: $first, after: $after, query: $q) {
          edges { node { id title variants(first: 3) { edges { node { id title price } } } } }
          pageInfo { hasNextPage endCursor }
        }
      }
    `, { first: 250, after: cursor, q: `product_type:"${type}" status:active` })
    for (const { node: p } of data.products.edges) {
      const variants = p.variants.edges.map((e: any) => e.node)
      if (variants.length === 1 && variants[0].title === 'Default Title') {
        all.push({ id: p.id, title: p.title })
      }
    }
    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
  }
  return all
}

async function fixProduct(token: string, product: { id: string; title: string }, firstSize: string, missingSizes: string[], prices: Record<string, string>) {
  // productOptionsCreate converts Default Title → firstSize
  const optResult = await gql(token, `
    mutation($productId: ID!, $options: [OptionCreateInput!]!) {
      productOptionsCreate(productId: $productId, options: $options) {
        product { id }
        userErrors { field message }
      }
    }
  `, {
    productId: product.id,
    options: [{ name: 'Size', values: [{ name: firstSize }] }],
  })
  const optErrors = optResult?.productOptionsCreate?.userErrors ?? []
  if (optErrors.length) throw new Error(`Options error: ${JSON.stringify(optErrors)}`)

  const bulkResult = await gql(token, `
    mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        productVariants { id title price }
        userErrors { field message }
      }
    }
  `, {
    productId: product.id,
    variants: missingSizes.map(size => ({
      price: prices[size],
      optionValues: [{ optionName: 'Size', name: size }],
      inventoryPolicy: 'CONTINUE',
    })),
  })
  const errors = bulkResult?.productVariantsBulkCreate?.userErrors ?? []
  if (errors.length) throw new Error(`Variant create error: ${JSON.stringify(errors)}`)
  return missingSizes.length
}

async function processType(token: string, type: string, firstSize: string, missingSizes: string[], prices: Record<string, string>) {
  console.log(`\n--- ${type} ---`)
  const products = await getProducts(token, type)
  console.log(`Found ${products.length} to fix`)
  if (!products.length) return

  const canary = products[0]
  console.log(`Canary: "${canary.title}"`)
  try {
    await fixProduct(token, canary, firstSize, missingSizes, prices)
    console.log(`✓ Canary done`)
  } catch (err) {
    console.error(`✗ Canary failed: ${err}`)
    return
  }

  let ok = 0, fail = 0
  for (const p of products.slice(1)) {
    process.stdout.write(`  "${p.title}"... `)
    try {
      await fixProduct(token, p, firstSize, missingSizes, prices)
      process.stdout.write('✓\n')
      ok++
    } catch (err) {
      process.stdout.write(`✗ ${err}\n`)
      fail++
    }
    await new Promise(r => setTimeout(r, 250))
  }
  console.log(`✓ ${ok + 1} fixed, ${fail} failed`)
}

async function main() {
  console.log('Minting token...')
  const token = await getToken()

  // Art Prints: A4 (from Default Title) + A3 + A2
  await processType(token, 'Art Print', 'A4', ['A3', 'A2'], ART_PRINT_PRICES)

  // Posters: A3 (from Default Title) + A2 + A1
  await processType(token, 'Poster', 'A3', ['A2', 'A1'], POSTER_PRICES)

  console.log('\n=== All done ===')
}
main().catch(e => { console.error(e); process.exit(1) })
