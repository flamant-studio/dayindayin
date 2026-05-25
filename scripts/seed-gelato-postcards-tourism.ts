/**
 * seed-gelato-postcards-tourism.ts
 *
 * Creates postcard products from the horizontal postcard template.
 * Tourism series — perfect horizontal format for postcards.
 *
 * Run: npx tsx scripts/seed-gelato-postcards-tourism.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const TEMPLATE_ID    = 'c608faae-710c-4312-bb61-85b9c4a1f4f5'

const BLOB_BASE = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

const POSTCARD_DESC = `<p>Art postcard featuring original photography by Stine Weirsøe Flamant from the Tourism series. Printed on premium 350gsm coated silk card stock.</p>
<ul>
<li>A6 horizontal format (14.8 × 10.5 cm)</li>
<li>350gsm coated silk — feels substantial, not flimsy</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`

const ARTWORKS = [
  {
    blobUrl: `${BLOB_BASE}/gelato/tourism/tourism-1.jpg`,
    title: 'Tourism I — Postcard',
    tags: ['tourism', 'photography', 'greeting-card', 'postcard', 'landscape'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/tourism/tourism-2.jpg`,
    title: 'Tourism II — Postcard',
    tags: ['tourism', 'photography', 'greeting-card', 'postcard', 'landscape'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/tourism/tourism-3.jpg`,
    title: 'Tourism III — Postcard',
    tags: ['tourism', 'photography', 'greeting-card', 'postcard', 'landscape'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/tourism/tourism-4.jpg`,
    title: 'Tourism IV — Postcard',
    tags: ['tourism', 'photography', 'greeting-card', 'postcard', 'landscape'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/elephants/elephant-green.jpg`,
    title: 'Elephant Green — Postcard',
    tags: ['elephant', 'illustration', 'greeting-card', 'postcard', 'kids'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/elephants/elephant-yellow.jpg`,
    title: 'Elephant Yellow — Postcard',
    tags: ['elephant', 'illustration', 'greeting-card', 'postcard', 'kids'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/elephants/elephant-lilac.jpg`,
    title: 'Elephant Lilac — Postcard',
    tags: ['elephant', 'illustration', 'greeting-card', 'postcard', 'kids'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/elephants/elephant-red.jpg`,
    title: 'Elephant Red — Postcard',
    tags: ['elephant', 'illustration', 'greeting-card', 'postcard', 'kids'],
  },
]

async function createProduct(title: string, tags: string[]): Promise<string> {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: TEMPLATE_ID, title, description: POSTCARD_DESC, tags }),
    }
  )
  const json = await res.json() as any
  if (!res.ok) throw new Error(`Create failed: ${JSON.stringify(json)}`)
  return json.id as string
}

async function waitForVariants(productId: string, minVariants = 1, maxWait = 90000): Promise<any[]> {
  const start = Date.now()
  while (Date.now() - start < maxWait) {
    const res = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products/${productId}`,
      { headers: { 'X-API-KEY': GELATO_API_KEY } }
    )
    const json = await res.json() as any
    const variants = json.variants ?? []
    if (variants.length >= minVariants) return variants
    await new Promise(r => setTimeout(r, 4000))
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
  console.log(`Seeding ${ARTWORKS.length} postcards\n`)

  for (const artwork of ARTWORKS) {
    console.log(`▸ ${artwork.title}`)
    try {
      process.stdout.write(`  creating product... `)
      const productId = await createProduct(artwork.title, artwork.tags)
      console.log(`✓ ${productId}`)

      process.stdout.write(`  waiting for variants`)
      const variants = await waitForVariants(productId, 1)
      console.log(` ✓ (${variants.length})`)

      process.stdout.write(`  patching artwork... `)
      for (const v of variants) {
        await patchVariant(productId, v.id, artwork.blobUrl)
        await new Promise(r => setTimeout(r, 200))
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
