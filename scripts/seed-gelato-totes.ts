/**
 * seed-gelato-totes.ts
 *
 * Seeds 5 Shop of Words tote bags — one per design, artwork on both sides.
 * Template: a28d9355-d78d-4d13-afec-8f120d989280 (Premium Tote Bag, Natural DTG)
 *
 * Run: npx tsx scripts/seed-gelato-totes.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const TEMPLATE_ID    = 'a28d9355-d78d-4d13-afec-8f120d989280'
const VARIANT_ID     = '6fa6d672-f198-40a6-b849-24a4e7be044d' // Natural - DTG

const PNG_DIR = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/Studio/Shop of Words/udsagn - printklar/shopofwords_collection_byob/byob ai originaler/png-exports'

// Placeholder names as configured in the Gelato template
const PLACEHOLDER_FRONT = 'shopofwords_beauty_print_600dpi.png'
const PLACEHOLDER_BACK  = 'shopofwords_obligatorybeauty_print_600dpi.png'

const DESCRIPTION = `<p>Premium tote bag featuring original Shop of Words artwork by Stine Weirsøe Flamant. Printed using direct-to-garment (DTG) on a natural cotton tote.</p>
<ul>
<li>Natural cotton, heavy duty</li>
<li>DTG print — vivid, wash-resistant</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`

const TOTES = [
  {
    file:  `${PNG_DIR}/shopofwords_beauty_print_600dpi.png`,
    blob:  'gelato/totes/sow-beauty.jpg',
    title: 'Shop of Words — Beauty (Tote)',
    tags:  ['shop-of-words', 'tote', 'beauty', 'text-art'],
  },
  {
    file:  `${PNG_DIR}/shopofwords_byob_print_600dpi.png`,
    blob:  'gelato/totes/sow-byob.jpg',
    title: 'Shop of Words — BYOB (Tote)',
    tags:  ['shop-of-words', 'tote', 'byob', 'text-art'],
  },
  {
    file:  `${PNG_DIR}/shopofwords_mysake_print_600dpi.png`,
    blob:  'gelato/totes/sow-mysake.jpg',
    title: 'Shop of Words — My Sake (Tote)',
    tags:  ['shop-of-words', 'tote', 'my-sake', 'text-art'],
  },
  {
    file:  `${PNG_DIR}/shopofwords_obligatorybeauty_print_600dpi.png`,
    blob:  'gelato/totes/sow-obligatorybeauty.jpg',
    title: 'Shop of Words — Obligatory Beauty (Tote)',
    tags:  ['shop-of-words', 'tote', 'obligatory-beauty', 'text-art'],
  },
  {
    file:  `${PNG_DIR}/shopofwords_realeyes_print_600dpi.png`,
    blob:  'gelato/totes/sow-realeyes.jpg',
    title: 'Shop of Words — Real Eyes (Tote)',
    tags:  ['shop-of-words', 'tote', 'real-eyes', 'text-art'],
  },
]

async function uploadFile(localPath: string, blobKey: string): Promise<string> {
  const buffer = readFileSync(localPath)
  const mb = (buffer.length / 1024 / 1024).toFixed(1)
  process.stdout.write(`${mb}MB uploading... `)
  const blob = await put(blobKey, buffer, {
    access: 'public',
    contentType: 'image/png',
    allowOverwrite: true,
  })
  return blob.url
}

async function createTote(tote: typeof TOTES[0], imageUrl: string) {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: TEMPLATE_ID,
        title: tote.title,
        description: DESCRIPTION,
        tags: tote.tags,
        variants: [
          {
            templateVariantId: VARIANT_ID,
            imagePlaceholders: [
              { name: PLACEHOLDER_FRONT, fileUrl: imageUrl },
              { name: PLACEHOLDER_BACK,  fileUrl: imageUrl },
            ],
          },
        ],
      }),
    }
  )
  const json = await res.json()
  if (!res.ok) throw new Error(`Gelato ${res.status}: ${JSON.stringify(json)}`)
  return json as { id: string }
}

async function main() {
  if (!GELATO_API_KEY) { console.error('GELATO_API_KEY not set'); process.exit(1) }

  console.log(`Seeding ${TOTES.length} Shop of Words tote bags\n`)

  for (const tote of TOTES) {
    console.log(`▸ ${tote.title}`)
    try {
      process.stdout.write('  uploading... ')
      const imageUrl = await uploadFile(tote.file, tote.blob)
      console.log('✓')

      process.stdout.write('  creating Gelato product... ')
      const product = await createTote(tote, imageUrl)
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
