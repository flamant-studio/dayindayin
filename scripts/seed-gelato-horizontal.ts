/**
 * seed-gelato-horizontal.ts
 *
 * Seeds 8 landscape/square artworks using a HORIZONTAL Gelato template.
 * Template must be set up in Gelato dashboard first — paste the ID below.
 *
 * Artworks:
 *   Tourism series (4) — Studio/print ready/Tourism_1-4.tiff
 *   Elephant series (4) — _STINE/Design/Elefant_*.png
 *
 * Run: npx tsx scripts/seed-gelato-horizontal.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

// ─── FILL THIS IN when you have a horizontal template ID ─────────────────────
const TEMPLATE_ID         = 'PASTE_HORIZONTAL_TEMPLATE_ID_HERE'
const ARTWORK_PLACEHOLDER = 'PASTE_PLACEHOLDER_NAME_HERE'   // from GET /v1/templates/{id}
// ─────────────────────────────────────────────────────────────────────────────

// Run: curl -s "https://ecommerce.gelatoapis.com/v1/templates/${TEMPLATE_ID}" \
//       -H "X-API-KEY: $GELATO_API_KEY" | jq '.variants[0].templateVariantId, .imagePlaceholders[].name'
const TEMPLATE_VARIANTS: string[] = [
  // Paste variant IDs here after fetching from Gelato
  // e.g. 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // A4 landscape
]

const PRINT_BASE   = '/Users/flamant-mini/Dropbox/_KUNST/Studio/print ready'
const STINE_DESIGN = '/Users/flamant-mini/Dropbox/_STINE/Design'

const ARTWORKS = [
  // Tourism series
  {
    file:  `${PRINT_BASE}/Tourism_1.tiff`,
    blob:  'gelato/tourism/tourism-1.jpg',
    title: 'Tourism — I',
    tags:  ['tourism', 'photography', 'art-print', 'landscape'],
    description: tourismDescription('I'),
  },
  {
    file:  `${PRINT_BASE}/Tourism_2.tiff`,
    blob:  'gelato/tourism/tourism-2.jpg',
    title: 'Tourism — II',
    tags:  ['tourism', 'photography', 'art-print', 'landscape'],
    description: tourismDescription('II'),
  },
  {
    file:  `${PRINT_BASE}/Tourism_3.tiff`,
    blob:  'gelato/tourism/tourism-3.jpg',
    title: 'Tourism — III',
    tags:  ['tourism', 'photography', 'art-print', 'landscape'],
    description: tourismDescription('III'),
  },
  {
    file:  `${PRINT_BASE}/Tourism_4.tiff`,
    blob:  'gelato/tourism/tourism-4.jpg',
    title: 'Tourism — IV',
    tags:  ['tourism', 'photography', 'art-print', 'landscape'],
    description: tourismDescription('IV'),
  },
  // Elephant series
  {
    file:  `${STINE_DESIGN}/Elefant_groen.png`,
    blob:  'gelato/elephants/elephant-green.jpg',
    title: 'Elephant — Green',
    tags:  ['elephant', 'illustration', 'art-print', 'kids'],
    description: elephantDescription('Green'),
  },
  {
    file:  `${STINE_DESIGN}/Elefant_gul.png`,
    blob:  'gelato/elephants/elephant-yellow.jpg',
    title: 'Elephant — Yellow',
    tags:  ['elephant', 'illustration', 'art-print', 'kids'],
    description: elephantDescription('Yellow'),
  },
  {
    file:  `${STINE_DESIGN}/Elefant_lilla.png`,
    blob:  'gelato/elephants/elephant-lilac.jpg',
    title: 'Elephant — Lilac',
    tags:  ['elephant', 'illustration', 'art-print', 'kids'],
    description: elephantDescription('Lilac'),
  },
  {
    file:  `${STINE_DESIGN}/Elefant_roed.png`,
    blob:  'gelato/elephants/elephant-red.jpg',
    title: 'Elephant — Red',
    tags:  ['elephant', 'illustration', 'art-print', 'kids'],
    description: elephantDescription('Red'),
  },
]

function tourismDescription(num: string) {
  return `<p>Fine art giclée print from Stine Weirsøe Flamant's Tourism series. Printed on 200gsm FSC-certified enhanced uncoated paper using 12-colour fine art printing technology.</p>
<ul>
<li>Matte finish, no glare</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`
}

function elephantDescription(colour: string) {
  return `<p>Fine art giclée print of Stine Weirsøe Flamant's Elephant illustration in ${colour}. Printed on 200gsm FSC-certified enhanced uncoated paper using 12-colour fine art printing technology.</p>
<ul>
<li>Matte finish, no glare</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`
}

function toJpeg(srcPath: string, destPath: string): void {
  execSync(`sips -s format jpeg -s formatOptions 95 "${srcPath}" --out "${destPath}"`, { stdio: 'pipe' })
}

async function uploadArtwork(artwork: typeof ARTWORKS[0]): Promise<string> {
  if (!existsSync(artwork.file)) throw new Error(`File not found: ${artwork.file}`)

  const needsConvert = /\.(png|tiff?|tif)$/i.test(artwork.file)
  let uploadPath = artwork.file
  let tmpPath: string | null = null

  if (needsConvert) {
    tmpPath = resolve(tmpdir(), `did-h-seed-${Date.now()}.jpg`)
    process.stdout.write(`converting → JPEG... `)
    toJpeg(artwork.file, tmpPath)
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

  if (TEMPLATE_ID === 'PASTE_HORIZONTAL_TEMPLATE_ID_HERE') {
    console.error('Fill in TEMPLATE_ID, ARTWORK_PLACEHOLDER, and TEMPLATE_VARIANTS first.')
    console.error('Fetch them with:')
    console.error(`  curl -s "https://ecommerce.gelatoapis.com/v1/templates/YOUR_ID" -H "X-API-KEY: ${GELATO_API_KEY.slice(0,8)}..." | jq .`)
    process.exit(1)
  }

  console.log(`Seeding ${ARTWORKS.length} artworks (horizontal template)\n`)

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

  console.log('Done. Products are DRAFT — check mockups in Gelato, then publish in Shopify.')
}

main().catch(err => { console.error(err); process.exit(1) })
