/**
 * Add 4 color/design variants to all Mug products.
 * Targets "Default Title" mugs. Adds: Ceramic White × Design Option 1/2, Ceramic Black × Design Option 1/2.
 * ⚠️ Fulfillment note: new variants won't be auto-linked to Gelato — document for Sebastian.
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!

// Mug pricing — ceramic mugs are same price regardless of color
// Check Gelato for actual pricing
const MUG_PRICE = '89.00' // as seen on live site

const MUG_VARIANTS = [
  { color: 'White', design: '1', title: 'Ceramic White / Design Option 1' },
  { color: 'White', design: '2', title: 'Ceramic White / Design Option 2' },
  { color: 'Black', design: '1', title: 'Ceramic Black / Design Option 1' },
  { color: 'Black', design: '2', title: 'Ceramic Black / Design Option 2' },
]

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

async function getMugProducts(token: string) {
  const all: { id: string; title: string; handle: string; variantId: string; price: string }[] = []
  let cursor: string | null = null
  while (true) {
    const data = await gql(token, `
      query($first: Int!, $after: String) {
        products(first: $first, after: $after, query: "product_type:Mug status:active") {
          edges { node { id title handle variants(first: 5) { edges { node { id title price } } } } }
          pageInfo { hasNextPage endCursor }
        }
      }
    `, { first: 250, after: cursor })
    for (const { node: p } of data.products.edges) {
      const variants = p.variants.edges.map((e: any) => e.node)
      if (variants.length === 1 && variants[0].title === 'Default Title') {
        all.push({ id: p.id, title: p.title, handle: p.handle, variantId: variants[0].id, price: variants[0].price })
      }
    }
    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
  }
  return all
}

async function fixMug(token: string, product: { id: string; title: string; variantId: string; price: string }) {
  // 1. Create options: Color (White, Black) and Design (Option 1, Option 2)
  // But Gelato uses a flat title format "Ceramic White / Design Option 1"
  // We'll use a single "Style" option with 4 values to keep it flat
  const optResult = await gql(token, `
    mutation($productId: ID!, $options: [OptionCreateInput!]!) {
      productOptionsCreate(productId: $productId, options: $options) {
        product { id }
        userErrors { field message }
      }
    }
  `, {
    productId: product.id,
    options: [
      { name: 'Style', values: [{ name: 'Ceramic White / Design Option 1' }] },
    ],
  })
  const optErrors = optResult?.productOptionsCreate?.userErrors ?? []
  if (optErrors.length) throw new Error(`Options error: ${JSON.stringify(optErrors)}`)

  // After productOptionsCreate, "Default Title" → "Ceramic White / Design Option 1" (first value)
  // Now add the 3 missing variants
  const bulkResult = await gql(token, `
    mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        productVariants { id title price }
        userErrors { field message }
      }
    }
  `, {
    productId: product.id,
    variants: [
      { price: MUG_PRICE, optionValues: [{ optionName: 'Style', name: 'Ceramic White / Design Option 2' }], inventoryPolicy: 'CONTINUE' },
      { price: MUG_PRICE, optionValues: [{ optionName: 'Style', name: 'Ceramic Black / Design Option 1' }], inventoryPolicy: 'CONTINUE' },
      { price: MUG_PRICE, optionValues: [{ optionName: 'Style', name: 'Ceramic Black / Design Option 2' }], inventoryPolicy: 'CONTINUE' },
    ],
  })
  const errors = bulkResult?.productVariantsBulkCreate?.userErrors ?? []
  if (errors.length) throw new Error(`Variant create error: ${JSON.stringify(errors)}`)
  return 3
}

async function main() {
  console.log('Minting token...')
  const token = await getToken()

  console.log('Finding mug products with Default Title...')
  const products = await getMugProducts(token)
  console.log(`Found ${products.length} mugs to fix\n`)

  if (products.length === 0) { console.log('All mugs already fixed.'); return }

  // Canary
  const canary = products[0]
  console.log(`CANARY: "${canary.title}"`)
  try {
    await fixMug(token, canary)
    console.log(`✓ Canary done`)
  } catch (err) {
    console.error(`✗ Canary failed: ${err}`)
    process.exit(1)
  }

  // Verify canary
  const verify = await gql(token, `query($id: ID!) { product(id: $id) { variants(first: 10) { edges { node { title } } } } }`, { id: canary.id })
  const vCount = verify?.product?.variants?.edges?.length ?? 0
  console.log(`Canary has ${vCount} variants`)
  if (vCount < 4) { console.error('⚠ Fewer than 4 variants — stopping'); process.exit(1) }

  console.log(`✓ Canary OK. Processing remaining ${products.length - 1}...\n`)
  let ok = 0, fail = 0
  for (const p of products.slice(1)) {
    process.stdout.write(`  "${p.title}"... `)
    try {
      await fixMug(token, p)
      process.stdout.write('✓\n')
      ok++
    } catch (err) {
      process.stdout.write(`✗ ${err}\n`)
      fail++
    }
    await new Promise(r => setTimeout(r, 250))
  }
  console.log(`\n=== Done: ${ok + 1} fixed, ${fail} failed ===`)
}
main().catch(e => { console.error(e); process.exit(1) })
