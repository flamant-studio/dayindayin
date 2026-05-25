/**
 * seed-gelato-mug.ts
 *
 * Creates white porcelain mug products.
 * Template has 4 variants: Ceramic White/Black × Design Option 1/2.
 * "Design Option 1" and "Design Option 2" are two different print positions on the mug.
 * We apply the same artwork to all 4 variants.
 *
 * Run: npx tsx scripts/seed-gelato-mug.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, existsSync } from 'fs'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const TEMPLATE_ID    = '0e9a0a04-1016-4216-9a40-4f42a00b8dca'

const BLOB_BASE = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'
const DROPBOX_NEKO = '/Users/flamant-mini/Dropbox/_KUNST/Studio/Shop of Words'

function mugDesc(title: string) {
  return `<p>White porcelain mug featuring <em>${title}</em> by Stine Weirsøe Flamant.</p>
<ul>
<li>330ml capacity</li>
<li>Ceramic White or Ceramic Black</li>
<li>Dishwasher safe</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 5–10 business days</li>
</ul>`
}

// Neko paw artworks — already in Blob
const ARTWORKS = [
  {
    blobUrl: `${BLOB_BASE}/gelato/neko/nekopaw_yellow_outline.png`,
    title: 'Neko Paw Mug — Yellow',
    tags: ['neko', 'cat', 'mug', 'yellow'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/neko/nekopaw_pink_outline.png`,
    title: 'Neko Paw Mug — Pink',
    tags: ['neko', 'cat', 'mug', 'pink'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/neko/nekopaw_lilac_outline.png`,
    title: 'Neko Paw Mug — Lilac',
    tags: ['neko', 'cat', 'mug', 'lilac'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/neko/nekopaw_yellow_blue.png`,
    title: 'Neko Paw Mug — Yellow & Blue',
    tags: ['neko', 'cat', 'mug', 'yellow', 'blue'],
  },
]

async function createProduct(title: string, desc: string, tags: string[]): Promise<string> {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: TEMPLATE_ID, title, description: desc, tags }),
    }
  )
  const json = await res.json() as any
  if (!res.ok) throw new Error(`Create failed: ${JSON.stringify(json)}`)
  return json.id as string
}

async function waitForVariants(productId: string, expected = 4, maxWait = 90000): Promise<any[]> {
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
  console.log(`Seeding ${ARTWORKS.length} mug products\n`)

  for (const artwork of ARTWORKS) {
    console.log(`▸ ${artwork.title}`)
    try {
      process.stdout.write(`  creating product... `)
      const productId = await createProduct(artwork.title, mugDesc(artwork.title), artwork.tags)
      console.log(`✓ ${productId}`)

      process.stdout.write(`  waiting for variants`)
      const variants = await waitForVariants(productId, 4)
      console.log(` ✓ (${variants.length} variants: ${variants.map(v => v.title?.split(' - ')[0]).join(', ')})`)

      process.stdout.write(`  patching artwork on all variants... `)
      for (const v of variants) {
        await patchVariant(productId, v.id, artwork.blobUrl)
        await new Promise(r => setTimeout(r, 300))
      }
      console.log(`✓`)
    } catch (err) {
      console.error(`\n  FAILED: ${err}`)
    }
    console.log()
  }

  console.log('Done. Check Shopify — mug listings should be auto-published.')
  console.log('Note: "Design Option 1" vs "Design Option 2" variants are different mug sides — both get same artwork.')
}

main().catch(err => { console.error(err); process.exit(1) })
