/**
 * seed-gelato-framed-horizontal.ts
 *
 * Framed horizontal art prints — Tourism series + Elephant series.
 * Same workflow as framed-vertical: create from template → poll variants → PATCH artwork.
 *
 * Run: npx tsx scripts/seed-gelato-framed-horizontal.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const TEMPLATE_ID    = '992be2b6-4005-4abb-884c-9d4fa2f4affb'

const BLOB_BASE = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

function framedDesc(series: string) {
  return `<p>Fine art giclée print from Stine Weirsøe Flamant's ${series} series, mounted in a premium wooden frame with museum-quality matte archival paper.</p>
<ul>
<li>Available in A4, A3, A2, and A1</li>
<li>Frame options: white, natural wood, black</li>
<li>250gsm off-white archival matte paper</li>
<li>Plexiglass front — ready to hang</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 5–10 business days</li>
</ul>`
}

// Reuse existing Blob URLs from seed-gelato-horizontal.ts seed
const ARTWORKS = [
  {
    blobUrl: `${BLOB_BASE}/gelato/tourism/tourism-1.jpg`,
    title: 'Tourism I — Framed',
    tags: ['tourism', 'photography', 'art-print', 'framed', 'landscape'],
    desc: framedDesc('Tourism'),
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/tourism/tourism-2.jpg`,
    title: 'Tourism II — Framed',
    tags: ['tourism', 'photography', 'art-print', 'framed', 'landscape'],
    desc: framedDesc('Tourism'),
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/tourism/tourism-3.jpg`,
    title: 'Tourism III — Framed',
    tags: ['tourism', 'photography', 'art-print', 'framed', 'landscape'],
    desc: framedDesc('Tourism'),
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/tourism/tourism-4.jpg`,
    title: 'Tourism IV — Framed',
    tags: ['tourism', 'photography', 'art-print', 'framed', 'landscape'],
    desc: framedDesc('Tourism'),
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/elephants/elephant-green.jpg`,
    title: 'Elephant Green — Framed',
    tags: ['elephant', 'illustration', 'art-print', 'framed', 'kids'],
    desc: framedDesc('Elephant'),
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/elephants/elephant-yellow.jpg`,
    title: 'Elephant Yellow — Framed',
    tags: ['elephant', 'illustration', 'art-print', 'framed', 'kids'],
    desc: framedDesc('Elephant'),
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/elephants/elephant-lilac.jpg`,
    title: 'Elephant Lilac — Framed',
    tags: ['elephant', 'illustration', 'art-print', 'framed', 'kids'],
    desc: framedDesc('Elephant'),
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/elephants/elephant-red.jpg`,
    title: 'Elephant Red — Framed',
    tags: ['elephant', 'illustration', 'art-print', 'framed', 'kids'],
    desc: framedDesc('Elephant'),
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

async function waitForVariants(productId: string, expected = 12, maxWait = 120000): Promise<any[]> {
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
  throw new Error(`Timed out waiting for variants on ${productId}`)
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
  console.log(`Seeding ${ARTWORKS.length} framed horizontal prints\n`)

  for (const artwork of ARTWORKS) {
    console.log(`▸ ${artwork.title}`)
    try {
      process.stdout.write(`  creating product... `)
      const productId = await createProduct(artwork.title, artwork.desc, artwork.tags)
      console.log(`✓ ${productId}`)

      process.stdout.write(`  waiting for variants`)
      const variants = await waitForVariants(productId, 12)
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
