/**
 * add-framed-variants.ts
 *
 * Adds 12 proper size/frame variants to every Shopify "Framed Print" product.
 * Current products have 1 "Default Title" variant — this replaces it with
 * A4/A3/A2/A1 × Black/White/Wood options and realistic DKK pricing.
 *
 * Run: npx tsx scripts/add-framed-variants.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!

// Framed print pricing in DKK (based on Gelato cost tiers)
const FRAMED_PRICES: Record<string, Record<string, string>> = {
  'A4': { Black: '399.00', White: '419.00', Wood: '419.00' },
  'A3': { Black: '549.00', White: '569.00', Wood: '569.00' },
  'A2': { Black: '749.00', White: '769.00', Wood: '769.00' },
  'A1': { Black: '999.00', White: '1019.00', Wood: '1019.00' },
}

const SIZES = ['A4', 'A3', 'A2', 'A1']
const FRAMES = ['Black', 'White', 'Wood']

interface Variant {
  size: string
  frame: string
  price: string
  displayTitle: string
}

function buildVariants(): Variant[] {
  const variants: Variant[] = []
  for (const size of SIZES) {
    for (const frame of FRAMES) {
      variants.push({
        size,
        frame,
        price: FRAMED_PRICES[size][frame],
        displayTitle: `${size} / ${frame} frame`,
      })
    }
  }
  return variants
}

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
  const data = await res.json() as { access_token: string }
  if (!data.access_token) throw new Error('Failed to get token')
  return data.access_token
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

async function getAllFramedProducts(token: string): Promise<{ id: string; title: string; handle: string; variantId: string }[]> {
  const all: { id: string; title: string; handle: string; variantId: string }[] = []
  let cursor: string | null = null
  while (true) {
    const data = await gql(token, `
      query($first: Int!, $after: String, $query: String!) {
        products(first: $first, after: $after, query: $query) {
          edges {
            node {
              id title handle
              variants(first: 5) { edges { node { id title } } }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    `, { first: 250, after: cursor, query: 'product_type:"Framed Print"' })
    for (const { node: p } of data.products.edges) {
      const variants = p.variants.edges.map((e: any) => e.node)
      // Only process products that still have a single "Default Title" variant
      if (variants.length === 1 && variants[0].title === 'Default Title') {
        all.push({ id: p.id, title: p.title, handle: p.handle, variantId: variants[0].id })
      }
    }
    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
  }
  return all
}

async function getProductState(token: string, productId: string): Promise<{
  options: { name: string; values: string[] }[]
  variants: { id: string; title: string; price: string }[]
}> {
  const data = await gql(token, `
    query($id: ID!) {
      product(id: $id) {
        options { name values }
        variants(first: 20) { edges { node { id title price } } }
      }
    }
  `, { id: productId })
  return {
    options: data?.product?.options ?? [],
    variants: (data?.product?.variants?.edges ?? []).map((e: any) => e.node),
  }
}

async function fixProduct(token: string, product: { id: string; title: string; handle: string; variantId: string }) {
  const allVariants = buildVariants()
  const state = await getProductState(token, product.id)

  const hasOptions = state.options.some(o => o.name === 'Size' || o.name === 'Frame')
  const existingTitles = new Set(state.variants.map(v => v.title))

  // Step 1: Create options if not yet created (for products still on "Default Title")
  if (!hasOptions) {
    // productOptionsCreate converts Default Title → first option combo and creates the options
    // Must provide at least one value per option
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
        { name: 'Size', values: [{ name: 'A4' }] },
        { name: 'Frame', values: [{ name: 'Black' }] },
      ],
    })
    const optErrors = optResult?.productOptionsCreate?.userErrors ?? []
    if (optErrors.length > 0) {
      throw new Error(`Options create errors: ${JSON.stringify(optErrors)}`)
    }
    // Re-fetch state after options created
    const newState = await getProductState(token, product.id)
    newState.variants.forEach(v => existingTitles.add(v.title))
  }

  // Step 2: Determine which of the 12 variants are missing
  // After productOptionsCreate, product has 1 variant (the old Default Title → now some combo)
  // We need to add all variants that aren't there yet
  const missingVariants = allVariants.filter(v => !existingTitles.has(`${v.size} / ${v.frame}`))

  if (missingVariants.length === 0) {
    return 0 // Already done
  }

  // Step 3: Bulk create missing variants
  const variantInputs = missingVariants.map(v => ({
    price: v.price,
    optionValues: [
      { optionName: 'Size', name: v.size },
      { optionName: 'Frame', name: v.frame },
    ],
    inventoryPolicy: 'CONTINUE',
  }))

  const bulkResult = await gql(token, `
    mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        productVariants { id title price }
        userErrors { field message }
      }
    }
  `, {
    productId: product.id,
    variants: variantInputs,
  })

  const createErrors = bulkResult?.productVariantsBulkCreate?.userErrors ?? []
  if (createErrors.length > 0) {
    throw new Error(`Variant creation errors: ${JSON.stringify(createErrors)}`)
  }

  return missingVariants.length
}

async function main() {
  console.log('Getting fresh Shopify token...')
  const token = await getToken()

  console.log('Finding framed print products with single "Default Title" variant...')
  const products = await getAllFramedProducts(token)
  console.log(`Found ${products.length} products to fix\n`)

  if (products.length === 0) {
    console.log('No products need fixing.')
    return
  }

  // Canary: process 1 first, then all
  const canary = products[0]
  console.log(`CANARY: Processing "${canary.title}" (${canary.handle})`)
  try {
    const added = await fixProduct(token, canary)
    console.log(`✓ Canary complete — ${added + 1} variants now (added ${added} new)`)
  } catch (err) {
    console.error(`✗ Canary failed: ${err}`)
    process.exit(1)
  }

  // Verify canary before continuing
  const verifyData = await gql(token, `
    query($id: ID!) {
      product(id: $id) {
        options { name values }
        variants(first: 15) { edges { node { title price } } }
      }
    }
  `, { id: canary.id })
  const verifiedVariants = verifyData?.product?.variants?.edges ?? []
  console.log(`Canary verification: ${verifiedVariants.length} variants`)
  for (const { node: v } of verifiedVariants.slice(0, 4)) {
    console.log(`  "${v.title}" → ${v.price}`)
  }

  if (verifiedVariants.length < 12) {
    console.error('\n⚠ Canary has fewer than 12 variants. Stopping.')
    process.exit(1)
  }

  console.log('\n✓ Canary looks good. Processing remaining products...\n')
  let success = 0
  let failed = 0

  for (const product of products.slice(1)) {
    process.stdout.write(`  "${product.title}"... `)
    try {
      await fixProduct(token, product)
      process.stdout.write('✓\n')
      success++
    } catch (err) {
      process.stdout.write(`✗ ${err}\n`)
      failed++
    }
    await new Promise(r => setTimeout(r, 300)) // rate limit
  }

  console.log(`\n=== Done ===`)
  console.log(`✓ Fixed: ${success + 1} (incl. canary)`)
  console.log(`✗ Failed: ${failed}`)
  console.log('\nAll framed print products should now have 12 size/frame variants.')
}

main().catch(err => { console.error(err); process.exit(1) })
