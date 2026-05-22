/**
 * seed-gelato-square.ts
 *
 * Seeds square artworks using the square Fine Art Poster template.
 * Template: 323d6ff5-9795-40d6-8d11-d9a3a2710d87
 * Sizes: 30×30 / 40×40 / 70×70 cm
 *
 * Run: npx tsx scripts/seed-gelato-square.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, unlinkSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const TEMPLATE_ID    = '323d6ff5-9795-40d6-8d11-d9a3a2710d87'

const TEMPLATE_VARIANTS = [
  'c19e1e08-dfd4-4abe-9203-80cb64b08727', // 30×30 cm
  '9c96bb29-451f-451d-9abb-c9794f0be757', // 40×40 cm
  'd91a6aae-a737-4fb7-99a2-476cab17135d', // 70×70 cm
]

const ARTWORK_PLACEHOLDER  = 'Sheroshine_1swf2023-1.jpeg'
const WATERMARK_PLACEHOLDER = 'infinity watermark dayin.png'

const WATERMARK_FILE = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/Studio/Brand/Logo exploration/Dayin_dayin_boldinfinitysymbol.png'
const PATTERN_BASE   = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/Studio/Pattern repeats'
const PRINT_BASE     = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/Studio/print ready'
const PHOTO_BASE     = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/STINE FOTO'

const ARTWORKS = [
  {
    file:  `${PRINT_BASE}/Art photo/Sheroshine_1swf2023-1.jpeg`,
    blob:  'gelato/square/sheroshine.jpg',
    title: 'Sheroshine — I',
    tags:  ['sheroshine', 'photography', 'art-print', 'square'],
    description: artDescription('Sheroshine — I', 'A striking analogue-process photograph by Stine Weirsøe Flamant. Light-sensitive surface, dark wood, quiet intensity.'),
  },
  {
    file:  `${PATTERN_BASE}/Kaninskoven_Lille.png`,
    blob:  'gelato/square/kaninskoven.jpg',
    title: 'Kaninskoven',
    tags:  ['kaninskoven', 'pattern', 'art-print', 'square'],
    description: artDescription('Kaninskoven', 'Rabbit forest — a dense, graphic pattern by Stine Weirsøe Flamant. Printed as a square fine art poster.'),
  },
  {
    file:  `${PATTERN_BASE}/2021-10-30 10.59.01-1.png`,
    blob:  'gelato/square/monsters-pattern.jpg',
    title: 'Monsters — Pattern',
    tags:  ['monsters', 'pattern', 'art-print', 'square'],
    description: artDescription('Monsters', 'Bold monster pattern by Stine Weirsøe Flamant. Playful, graphic, original.'),
  },
  {
    file:  `${PHOTO_BASE}/moondancer.jpeg`,
    blob:  'gelato/square/moondancer.jpg',
    title: 'Moondancer',
    tags:  ['moondancer', 'photography', 'art-print', 'square'],
    description: artDescription('Moondancer', 'Square fine art photograph by Stine Weirsøe Flamant.'),
  },
]

function artDescription(title: string, body: string) {
  return `<p>${body}</p>
<ul>
<li>Fine art giclée print on 200gsm FSC-certified enhanced uncoated paper</li>
<li>Matte finish, no glare</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`
}

function toJpeg(src: string, dest: string) {
  execSync(`sips -s format jpeg -s formatOptions 95 "${src}" --out "${dest}"`, { stdio: 'pipe' })
}

async function uploadFile(localPath: string, blobKey: string): Promise<string> {
  if (!existsSync(localPath)) throw new Error(`File not found: ${localPath}`)

  const needsConvert = /\.(png|tiff?|tif)$/i.test(localPath)
  let uploadPath = localPath
  let tmpPath: string | null = null

  if (needsConvert) {
    tmpPath = resolve(tmpdir(), `did-sq-${Date.now()}.jpg`)
    process.stdout.write('converting → JPEG... ')
    toJpeg(localPath, tmpPath)
    uploadPath = tmpPath
  }

  const buffer = readFileSync(uploadPath)
  const mb = (buffer.length / 1024 / 1024).toFixed(1)
  process.stdout.write(`${mb}MB uploading... `)

  const blob = await put(blobKey, buffer, {
    access: 'public',
    contentType: 'image/jpeg',
    allowOverwrite: true,
  })

  if (tmpPath) unlinkSync(tmpPath)
  return blob.url
}

async function createProduct(artwork: typeof ARTWORKS[0], artworkUrl: string, watermarkUrl: string) {
  const variants = TEMPLATE_VARIANTS.map(templateVariantId => ({
    templateVariantId,
    imagePlaceholders: [
      { name: ARTWORK_PLACEHOLDER,  fileUrl: artworkUrl },
      { name: WATERMARK_PLACEHOLDER, fileUrl: watermarkUrl },
    ],
    textPlaceholders: [
      { name: 'Text 5', text: 'Stine Weirsøe Flamant' },
    ],
  }))

  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: TEMPLATE_ID,
        title: artwork.title,
        description: artwork.description,
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

  console.log('Seeding square artworks\n')

  process.stdout.write('Uploading watermark... ')
  const watermarkUrl = await uploadFile(WATERMARK_FILE, 'gelato/square/watermark-infinity.jpg')
  console.log('✓\n')

  for (const artwork of ARTWORKS) {
    console.log(`▸ ${artwork.title}`)
    try {
      process.stdout.write('  uploading artwork... ')
      const artworkUrl = await uploadFile(artwork.file, artwork.blob)
      console.log('✓')

      process.stdout.write('  creating Gelato product... ')
      const product = await createProduct(artwork, artworkUrl, watermarkUrl)
      console.log(`✓ ${product.id}`)

      await new Promise(r => setTimeout(r, 1200))
    } catch (err) {
      console.error(`\n  FAILED: ${err}`)
    }
    console.log()
  }

  console.log('Done. Products are DRAFT — check mockups in Gelato, then publish in Shopify.')
}

main().catch(err => { console.error(err); process.exit(1) })
