/**
 * seed-gelato-masks.ts
 *
 * Seeds 4 artworks as fine art print products in Gelato:
 *   — Mask I, Mask II, Mask III (scans from masker/)
 *   — Zebra (ulrikkezebra.jpg)
 *
 * Large PNGs are converted to JPEG via sips before upload to avoid
 * blob size issues. Conversion is lossless-quality (95%).
 *
 * Run: npx tsx scripts/seed-gelato-masks.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, unlinkSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY   = process.env.GELATO_API_KEY!
const STORE_ID         = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const TEMPLATE_ID      = '6005fae3-64a6-4f62-8328-93d2ce6bae58'
const ARTWORK_PLACEHOLDER = 'nekopaw_yellow_neon.png'

const TEMPLATE_VARIANTS = [
  'b3d4dda4-ac21-4419-9616-46624fb8090c', // A4 21×29.7 cm
  '2d58a7c4-c307-4c5b-882a-acc019bf4a6a', // A3 29.7×42 cm
  '542aaaaf-3112-42f4-9661-736f460b89d7', // A2 42×59.4 cm
]

const BASE = '/Users/flamant-mini/Dropbox/_KUNST/Studio/dayindayin artstudio'

const ARTWORKS = [
  {
    file:  `${BASE}/masker/Scan_swf_mask1.png`,
    blob:  'gelato/masks/mask-1.jpg',
    title: 'Mask — I',
    tags:  ['mask', 'original', 'scan', 'art-print'],
  },
  {
    file:  `${BASE}/masker/Scan_swf_mask2.png`,
    blob:  'gelato/masks/mask-2.jpg',
    title: 'Mask — II',
    tags:  ['mask', 'original', 'scan', 'art-print'],
  },
  {
    file:  `${BASE}/masker/IMG_0643.png`,
    blob:  'gelato/masks/mask-3.jpg',
    title: 'Mask — III',
    tags:  ['mask', 'original', 'art-print'],
  },
  {
    file:  `${BASE}/Dayindayin.dk/ulrikkezebra.jpg`,
    blob:  'gelato/masks/ulrikke-zebra.jpg',
    title: 'Zebra',
    tags:  ['zebra', 'drawing', 'illustration', 'art-print'],
  },
]

const DESCRIPTION = `<p>Fine art giclée print of an original work by Stine Weirsøe Flamant. Printed on 200gsm FSC-certified enhanced uncoated paper using 12-colour fine art printing technology.</p>
<ul>
<li>Available in A4, A3 and A2</li>
<li>Matte finish, no glare</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`

function toJpeg(srcPath: string, destPath: string): void {
  execSync(`sips -s format jpeg -s formatOptions 95 "${srcPath}" --out "${destPath}"`, { stdio: 'pipe' })
}

async function uploadArtwork(artwork: typeof ARTWORKS[0]): Promise<string> {
  const srcPath = artwork.file
  if (!existsSync(srcPath)) throw new Error(`File not found: ${srcPath}`)

  const isLargePng = srcPath.toLowerCase().endsWith('.png')
  let uploadPath = srcPath
  let tmpPath: string | null = null

  if (isLargePng) {
    tmpPath = resolve(tmpdir(), `did-seed-${Date.now()}.jpg`)
    process.stdout.write(`    converting PNG → JPEG... `)
    toJpeg(srcPath, tmpPath)
    const sizeMb = (readFileSync(tmpPath).length / 1024 / 1024).toFixed(1)
    process.stdout.write(`${sizeMb}MB  `)
    uploadPath = tmpPath
  }

  const buffer = readFileSync(uploadPath)
  const blob = await put(artwork.blob, buffer, {
    access: 'public',
    contentType: 'image/jpeg',
    allowOverwrite: true,
  })

  if (tmpPath) unlinkSync(tmpPath)
  return blob.url
}

async function createGelatoProduct(artwork: typeof ARTWORKS[0], imageUrl: string) {
  const variants = TEMPLATE_VARIANTS.map(templateVariantId => ({
    templateVariantId,
    imagePlaceholders: [{ name: ARTWORK_PLACEHOLDER, fileUrl: imageUrl }],
  }))

  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: TEMPLATE_ID,
        title: artwork.title,
        description: DESCRIPTION,
        tags: artwork.tags,
        variants,
      }),
    }
  )
  const json = await res.json()
  if (!res.ok) throw new Error(`Gelato ${res.status}: ${JSON.stringify(json)}`)
  return json as { id: string }
}

async function main() {
  if (!GELATO_API_KEY) { console.error('GELATO_API_KEY not set'); process.exit(1) }

  console.log(`Seeding ${ARTWORKS.length} artworks\n`)

  for (const artwork of ARTWORKS) {
    console.log(`▸ ${artwork.title}`)
    try {
      process.stdout.write(`  uploading... `)
      const imageUrl = await uploadArtwork(artwork)
      console.log(`✓ blob ready`)

      process.stdout.write(`  creating Gelato product... `)
      const product = await createGelatoProduct(artwork, imageUrl)
      console.log(`✓ ${product.id}`)

      await new Promise(r => setTimeout(r, 1200))
    } catch (err) {
      console.error(`\n  FAILED: ${err}`)
    }
    console.log()
  }

  console.log('Done. All products are DRAFT in Gelato — check mockups, then publish in Shopify.')
}

main().catch(err => { console.error(err); process.exit(1) })
