/**
 * seed-gelato-neko.ts
 *
 * Creates 6 Neko paw products in Gelato via create-from-template.
 * Each artwork is supplied via imagePlaceholders, replacing the template
 * default and generating correct per-product mockups.
 *
 * Run: npx tsx scripts/seed-gelato-neko.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const TEMPLATE_ID    = '6005fae3-64a6-4f62-8328-93d2ce6bae58'
const DROPBOX_BASE   = '/Users/flamant-mini/Dropbox/_KUNST/Studio/Shop of Words'
const BLOB_BASE      = 'gelato/neko'

// Template variant IDs (from GET /v1/templates/{templateId})
const TEMPLATE_VARIANTS = [
  'b3d4dda4-ac21-4419-9616-46624fb8090c', // A4 21x29.7 cm
  '2d58a7c4-c307-4c5b-882a-acc019bf4a6a', // A3 29.7x42 cm
  '542aaaaf-3112-42f4-9661-736f460b89d7', // A2 42x59.4 cm
]

// Name of the artwork placeholder layer in the template
const ARTWORK_PLACEHOLDER = 'nekopaw_yellow_neon.png'

const ARTWORKS = [
  { file: 'nekopaw_yellow_outline.png',  title: 'Neko Paw Print — Yellow',        tags: ['neko', 'cat', 'yellow', 'art-print'] },
  { file: 'nekopaw_yellow_neon.png',     title: 'Neko Paw Print — Yellow Neon',   tags: ['neko', 'cat', 'yellow', 'neon', 'art-print'] },
  { file: 'nekopaw_yellow_blue.png',     title: 'Neko Paw Print — Yellow & Blue', tags: ['neko', 'cat', 'yellow', 'blue', 'art-print'] },
  { file: 'nekopaw_pink_outline.png',    title: 'Neko Paw Print — Pink',          tags: ['neko', 'cat', 'pink', 'art-print'] },
  { file: 'nekopaw_lilac_outline.png',   title: 'Neko Paw Print — Lilac',         tags: ['neko', 'cat', 'lilac', 'purple', 'art-print'] },
  { file: 'nekopaw_yellow_outline1.png', title: 'Neko Paw Print — Yellow II',     tags: ['neko', 'cat', 'yellow', 'art-print'] },
]

const DESCRIPTION = `<p>Fine art giclée print of Stine Weirsøe Flamant's Neko Paw. Printed on 200gsm FSC-certified enhanced uncoated paper using 12-colour fine art printing technology.</p>
<ul>
<li>Available in A4, A3 and A2</li>
<li>Matte finish, no glare</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`

async function uploadToBlob(filePath: string, blobPath: string): Promise<string> {
  const buffer = readFileSync(filePath)
  const blob = await put(blobPath, buffer, {
    access: 'public',
    contentType: 'image/png',
    allowOverwrite: true,
  })
  return blob.url
}

async function createGelatoProduct(title: string, description: string, tags: string[], imageUrl: string) {
  const variants = TEMPLATE_VARIANTS.map(templateVariantId => ({
    templateVariantId,
    imagePlaceholders: [{ name: ARTWORK_PLACEHOLDER, fileUrl: imageUrl }],
  }))

  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: TEMPLATE_ID, title, description, tags, variants }),
    }
  )
  const json = await res.json()
  if (!res.ok) throw new Error(`Gelato error ${res.status}: ${JSON.stringify(json)}`)
  return json as { id: string }
}

async function main() {
  console.log(`Creating ${ARTWORKS.length} Neko paw products\n`)

  for (const artwork of ARTWORKS) {
    const filePath = `${DROPBOX_BASE}/${artwork.file}`
    const blobPath = `${BLOB_BASE}/${artwork.file}`

    try {
      process.stdout.write(`  Uploading ${artwork.file}... `)
      const imageUrl = await uploadToBlob(filePath, blobPath)
      console.log(`✓`)

      process.stdout.write(`  Creating "${artwork.title}"... `)
      const product = await createGelatoProduct(artwork.title, DESCRIPTION, artwork.tags, imageUrl)
      console.log(`✓ ${product.id}`)

      await new Promise(r => setTimeout(r, 1000))
    } catch (err) {
      console.error(`\n  FAILED ${artwork.file}:`, err)
    }
  }

  console.log('\nDone. Products are in DRAFT — check Gelato dashboard for mockups, then publish in Shopify.')
}

main().catch(err => { console.error(err); process.exit(1) })
