/**
 * Fix "Print Material" type framed print products.
 * These have "framed print" in the title but productType="Print Material".
 * They still have a single "Default Title" variant — add 12 size/frame variants.
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!

const FRAMED_PRICES: Record<string, Record<string, string>> = {
  'A4': { Black: '399.00', White: '419.00', Wood: '419.00' },
  'A3': { Black: '549.00', White: '569.00', Wood: '569.00' },
  'A2': { Black: '749.00', White: '769.00', Wood: '769.00' },
  'A1': { Black: '999.00', White: '1019.00', Wood: '1019.00' },
}
const SIZES = ['A4', 'A3', 'A2', 'A1']
const FRAMES = ['Black', 'White', 'Wood']

async function getToken(): Promise<string> {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }).toString(),
  })
  const data = await res.json() as { access_token: string }
  if (!data.access_token) throw new Error('Token mint failed')
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

async function getTargetProducts(token: string) {
  const all: { id: string; title: string; handle: string; variantId: string }[] = []
  let cursor: string | null = null
  while (true) {
    const data = await gql(token, `
      query($first: Int!, $after: String) {
        products(first: $first, after: $after, query: "product_type:'Print Material' title:*framed*") {
          edges { node { id title handle variants(first: 5) { edges { node { id title } } } } }
          pageInfo { hasNextPage endCursor }
        }
      }
    `, { first: 250, after: cursor })
    for (const { node: p } of data.products.edges) {
      const variants = p.variants.edges.map((e: any) => e.node)
      if (variants.length === 1 && variants[0].title === 'Default Title') {
        all.push({ id: p.id, title: p.title, handle: p.handle, variantId: variants[0].id })
      }
    }
    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
  }
  return all
}

async function getProductState(token: string, productId: string) {
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
  const state = await getProductState(token, product.id)
  const hasOptions = state.options.some((o: any) => o.name === 'Size' || o.name === 'Frame')
  const existingTitles = new Set(state.variants.map((v: any) => v.title))

  if (!hasOptions) {
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
    const errors = optResult?.productOptionsCreate?.userErrors ?? []
    if (errors.length) throw new Error(`Options error: ${JSON.stringify(errors)}`)
    const newState = await getProductState(token, product.id)
    newState.variants.forEach((v: any) => existingTitles.add(v.title))
  }

  const allVariants = []
  for (const size of SIZES) {
    for (const frame of FRAMES) {
      allVariants.push({ size, frame, price: FRAMED_PRICES[size][frame] })
    }
  }
  const missing = allVariants.filter(v => !existingTitles.has(`${v.size} / ${v.frame}`))
  if (missing.length === 0) return 0

  const bulkResult = await gql(token, `
    mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        productVariants { id title price }
        userErrors { field message }
      }
    }
  `, {
    productId: product.id,
    variants: missing.map(v => ({
      price: v.price,
      optionValues: [
        { optionName: 'Size', name: v.size },
        { optionName: 'Frame', name: v.frame },
      ],
      inventoryPolicy: 'CONTINUE',
    })),
  })

  const createErrors = bulkResult?.productVariantsBulkCreate?.userErrors ?? []
  if (createErrors.length) throw new Error(`Variant create error: ${JSON.stringify(createErrors)}`)
  return missing.length
}

async function main() {
  console.log('Minting token...')
  const token = await getToken()

  console.log('Finding Print Material framed print products with Default Title...')
  const products = await getTargetProducts(token)
  console.log(`Found ${products.length} products to fix\n`)

  if (products.length === 0) {
    console.log('Nothing to fix.')
    return
  }

  // Show first 5 to confirm
  console.log('Sample:')
  products.slice(0, 5).forEach(p => console.log(` "${p.title}" (${p.handle})`))
  console.log()

  // Canary
  const canary = products[0]
  console.log(`CANARY: "${canary.title}"`)
  try {
    const added = await fixProduct(token, canary)
    console.log(`✓ Canary done — added ${added} new variants`)
  } catch (err) {
    console.error(`✗ Canary failed: ${err}`)
    process.exit(1)
  }

  // Verify canary
  const verify = await getProductState(token, canary.id)
  console.log(`Canary has ${verify.variants.length} variants after fix`)
  if (verify.variants.length < 12) {
    console.error('⚠ Fewer than 12 variants — stopping')
    process.exit(1)
  }
  console.log(`✓ Canary verified. Processing remaining ${products.length - 1}...\n`)

  let ok = 0, fail = 0
  for (const p of products.slice(1)) {
    process.stdout.write(`  "${p.title}"... `)
    try {
      await fixProduct(token, p)
      process.stdout.write('✓\n')
      ok++
    } catch (err) {
      process.stdout.write(`✗ ${err}\n`)
      fail++
    }
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n=== Done ===`)
  console.log(`✓ Fixed: ${ok + 1}`)
  console.log(`✗ Failed: ${fail}`)
}

main().catch(e => { console.error(e); process.exit(1) })
