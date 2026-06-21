/**
 * Add 6 size variants to all Tank Top products (XS/S/M/L/XL/2XL).
 * ⚠️ Fulfillment note: new size variants won't auto-link to Gelato.
 * The "Default Title" → "M" conversion keeps the original M variant connected.
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!

// Tank top pricing — unisex, typically flat across sizes (or slight uplift for 2XL)
// Price from the existing "Default Title" variant will be used for all sizes
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL']

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

async function getTankTopProducts(token: string) {
  const all: { id: string; title: string; price: string }[] = []
  let cursor: string | null = null
  while (true) {
    const data = await gql(token, `
      query($first: Int!, $after: String) {
        products(first: $first, after: $after, query: "product_type:'Tank Top' status:active") {
          edges { node { id title variants(first: 5) { edges { node { id title price } } } } }
          pageInfo { hasNextPage endCursor }
        }
      }
    `, { first: 250, after: cursor })
    for (const { node: p } of data.products.edges) {
      const variants = p.variants.edges.map((e: any) => e.node)
      if (variants.length === 1 && variants[0].title === 'Default Title') {
        all.push({ id: p.id, title: p.title, price: variants[0].price })
      }
    }
    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
  }
  return all
}

async function fixTankTop(token: string, product: { id: string; title: string; price: string }) {
  const price = product.price

  // Create Size option — productOptionsCreate converts Default Title → first size
  // We use M as first since Default Title is likely M (medium) in Gelato
  const optResult = await gql(token, `
    mutation($productId: ID!, $options: [OptionCreateInput!]!) {
      productOptionsCreate(productId: $productId, options: $options) {
        product { id }
        userErrors { field message }
      }
    }
  `, {
    productId: product.id,
    options: [{ name: 'Size', values: [{ name: 'M' }] }],
  })
  const optErrors = optResult?.productOptionsCreate?.userErrors ?? []
  if (optErrors.length) throw new Error(`Options error: ${JSON.stringify(optErrors)}`)

  // Add XS, S, L, XL, 2XL (M is already created as the converted Default Title)
  const missingSizes = ['XS', 'S', 'L', 'XL', '2XL']
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
      price,
      optionValues: [{ optionName: 'Size', name: size }],
      inventoryPolicy: 'CONTINUE',
    })),
  })
  const errors = bulkResult?.productVariantsBulkCreate?.userErrors ?? []
  if (errors.length) throw new Error(`Variant create error: ${JSON.stringify(errors)}`)

  return 5
}

async function main() {
  console.log('Minting token...')
  const token = await getToken()

  console.log('Finding tank top products with Default Title...')
  const products = await getTankTopProducts(token)
  console.log(`Found ${products.length} tank tops to fix\n`)

  if (products.length === 0) { console.log('All tank tops already fixed.'); return }

  // Canary
  const canary = products[0]
  console.log(`CANARY: "${canary.title}"`)
  try {
    await fixTankTop(token, canary)
    console.log(`✓ Canary done`)
  } catch (err) {
    console.error(`✗ Canary failed: ${err}`)
    process.exit(1)
  }

  const verify = await gql(token, `query($id: ID!) { product(id: $id) { variants(first: 10) { edges { node { title } } } } }`, { id: canary.id })
  const vCount = verify?.product?.variants?.edges?.length ?? 0
  const vTitles = verify?.product?.variants?.edges?.map((e: any) => e.node.title).join(', ')
  console.log(`Canary has ${vCount} variants: ${vTitles}`)
  if (vCount < 6) { console.error('⚠ Fewer than 6 variants — stopping'); process.exit(1) }

  console.log(`✓ Canary OK. Processing remaining ${products.length - 1}...\n`)
  let ok = 0, fail = 0
  for (const p of products.slice(1)) {
    process.stdout.write(`  "${p.title}"... `)
    try {
      await fixTankTop(token, p)
      process.stdout.write('✓\n')
      ok++
    } catch (err) {
      process.stdout.write(`✗ ${err}\n`)
      fail++
    }
    await new Promise(r => setTimeout(r, 300))
  }
  console.log(`\n=== Done: ${ok + 1} fixed, ${fail} failed ===`)
}
main().catch(e => { console.error(e); process.exit(1) })
