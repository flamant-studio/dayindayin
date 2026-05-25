/**
 * seed-gelato-apparel.ts
 *
 * Creates two apparel products:
 *   1. Neko Paw Tank Top (men's, white, DTG, XS–2XL)
 *   2. Neko Paw T-Shirt with embroidered chest logo (men's, white, S–3XL)
 *
 * Uses the Neko paw outline artwork already in Blob.
 *
 * Run: npx tsx scripts/seed-gelato-apparel.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

const BLOB_BASE = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

const PRODUCTS = [
  {
    templateId: '2edd0df8-f9b1-4037-a7a2-456cd768739d',
    artUrl: `${BLOB_BASE}/gelato/neko/nekopaw_yellow_outline.png`,
    title: 'Neko Paw — Tank Top',
    tags: ['neko', 'cat', 'apparel', 'tank-top', 'yellow'],
    expectedVariants: 6,
    description: `<p>Men's white tank top featuring the Neko Paw icon by Stine Weirsøe Flamant, printed using DTG (direct-to-garment) technology.</p>
<ul>
<li>100% jersey cotton, pre-shrunk</li>
<li>Sizes XS–2XL</li>
<li>DTG print — soft feel, washes well</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 5–10 business days</li>
</ul>`,
  },
  {
    templateId: '461771cb-a59e-4d1b-b767-18bab73d6f6c',
    artUrl: `${BLOB_BASE}/gelato/neko/nekopaw_yellow_outline.png`,
    title: 'Neko Paw — Embroidered T-Shirt',
    tags: ['neko', 'cat', 'apparel', 'tshirt', 'embroidery', 'yellow'],
    expectedVariants: 6,
    description: `<p>Men's white t-shirt with the Neko Paw icon embroidered on the left chest by Stine Weirsøe Flamant.</p>
<ul>
<li>100% jersey cotton, pre-shrunk</li>
<li>Sizes S–3XL</li>
<li>Embroidered logo on left chest — textured, premium feel</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 5–10 business days</li>
</ul>`,
  },
]

async function createProduct(templateId: string, title: string, desc: string, tags: string[]): Promise<string> {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, title, description: desc, tags }),
    }
  )
  const json = await res.json() as any
  if (!res.ok) throw new Error(`Create failed: ${JSON.stringify(json)}`)
  return json.id as string
}

async function waitForVariants(productId: string, expected: number, maxWait = 90000): Promise<any[]> {
  const start = Date.now()
  while (Date.now() - start < maxWait) {
    const res = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products/${productId}`,
      { headers: { 'X-API-KEY': GELATO_API_KEY } }
    )
    const json = await res.json() as any
    const variants = json.variants ?? []
    if (variants.length >= expected) return variants
    await new Promise(r => setTimeout(r, 5000))
    process.stdout.write('.')
  }
  throw new Error(`Timed out on ${productId}`)
}

async function patchVariant(productId: string, variantId: string, fileUrl: string): Promise<void> {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products/${productId}/variants/${variantId}`,
    {
      method: 'PATCH',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileUrl }),
    }
  )
  if (!res.ok) throw new Error(`Patch failed: ${await res.text()}`)
}

async function main() {
  console.log(`Seeding ${PRODUCTS.length} apparel products\n`)

  for (const product of PRODUCTS) {
    console.log(`▸ ${product.title}`)
    try {
      process.stdout.write(`  creating product... `)
      const productId = await createProduct(product.templateId, product.title, product.description, product.tags)
      console.log(`✓ ${productId}`)

      process.stdout.write(`  waiting for variants`)
      const variants = await waitForVariants(productId, product.expectedVariants)
      console.log(` ✓ (${variants.length})`)

      process.stdout.write(`  patching artwork... `)
      for (const v of variants) {
        await patchVariant(productId, v.id, product.artUrl)
        await new Promise(r => setTimeout(r, 300))
      }
      console.log(`✓`)
    } catch (err) {
      console.error(`\n  FAILED: ${err}`)
    }
    console.log()
  }

  console.log('Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
