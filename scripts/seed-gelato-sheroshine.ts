/**
 * seed-gelato-sheroshine.ts
 *
 * Seeds Sheroshine art photo as a fine art print using the vertical template.
 * 3517×3517px square — will be centred with white margins in the portrait print area.
 *
 * Run: npx tsx scripts/seed-gelato-sheroshine.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY      = process.env.GELATO_API_KEY!
const STORE_ID            = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const TEMPLATE_ID         = '6005fae3-64a6-4f62-8328-93d2ce6bae58'
const ARTWORK_PLACEHOLDER = 'nekopaw_yellow_neon.png'

const TEMPLATE_VARIANTS = [
  'b3d4dda4-ac21-4419-9616-46624fb8090c', // A4 21×29.7 cm
  '2d58a7c4-c307-4c5b-882a-acc019bf4a6a', // A3 29.7×42 cm
  '542aaaaf-3112-42f4-9661-736f460b89d7', // A2 42×59.4 cm
]

const FILE     = '/Users/flamant-mini/Dropbox/_KUNST/Studio/print ready/Art photo/Sheroshine_1swf2023-1.jpeg'
const BLOB_KEY = 'gelato/artphoto/sheroshine-1.jpg'

const DESCRIPTION = `<p>Fine art giclée print from Stine Weirsøe Flamant's Sheroshine series. Original analogue-digital process art photography, 2023. Printed on 200gsm FSC-certified enhanced uncoated paper using 12-colour fine art printing technology.</p>
<ul>
<li>Available in A4, A3 and A2</li>
<li>Matte finish, no glare</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`

async function main() {
  if (!GELATO_API_KEY) { console.error('GELATO_API_KEY not set'); process.exit(1) }

  console.log('▸ Sheroshine — I')

  process.stdout.write('  uploading... ')
  const buffer = readFileSync(FILE)
  const blob = await put(BLOB_KEY, buffer, { access: 'public', contentType: 'image/jpeg', allowOverwrite: true })
  console.log(`✓ ${(buffer.length / 1024 / 1024).toFixed(1)}MB`)

  process.stdout.write('  creating Gelato product... ')
  const variants = TEMPLATE_VARIANTS.map(templateVariantId => ({
    templateVariantId,
    imagePlaceholders: [{ name: ARTWORK_PLACEHOLDER, fileUrl: blob.url }],
  }))

  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: TEMPLATE_ID,
        title: 'Sheroshine — I',
        description: DESCRIPTION,
        tags: ['shero', 'art-photography', 'analogue', 'art-print'],
        variants,
      }),
    }
  )
  const json = await res.json()
  if (!res.ok) throw new Error(`Gelato ${res.status}: ${JSON.stringify(json)}`)
  console.log(`✓ ${(json as { id: string }).id}`)
  console.log('\nDone. DRAFT in Gelato — check mockup, then publish in Shopify.')
}

main().catch(err => { console.error(err); process.exit(1) })
