/**
 * seed-gelato-shero-card.ts
 *
 * Seeds SHERO greeting card — Pack of 10, A6 horizontal, vertical fold.
 * Template: e6ba01e0-1fec-4f4b-807a-f5f396aa93e9
 *
 * Card layout:
 *   Front: shero_patch_highrez.tiff (converted to JPEG) → bold patch graphic
 *   Inside: Scan_swf_sheropackage.jpeg → full artwork scan
 *   Text slot: artist name
 *
 * Run: npx tsx scripts/seed-gelato-shero-card.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const TEMPLATE_ID    = 'e6ba01e0-1fec-4f4b-807a-f5f396aa93e9'
const VARIANT_ID     = '5dd76d7a-6b2e-4c42-8d1e-93a6f5eed5bf' // A6 horizontal

const DESKTOP = '/Users/flamant-mini/Desktop'

const DESCRIPTION = `<p>Pack of 10 A6 greeting cards featuring original SHERO artwork by Stine Weirsøe Flamant. Printed on premium coated silk paper with a vertical fold.</p>
<ul>
<li>Pack of 10 identical cards</li>
<li>A6 (10.5 × 14.8 cm), horizontal format</li>
<li>Coated silk paper, square edges</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`

function toJpeg(src: string, dest: string) {
  execSync(`sips -s format jpeg -s formatOptions 95 "${src}" --out "${dest}"`, { stdio: 'pipe' })
}

async function uploadFile(localPath: string, blobKey: string, convertFromTiff = false): Promise<string> {
  let uploadPath = localPath
  let tmpPath: string | null = null

  if (convertFromTiff) {
    tmpPath = resolve(tmpdir(), `did-card-${Date.now()}.jpg`)
    process.stdout.write('converting TIFF → JPEG... ')
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

async function main() {
  if (!GELATO_API_KEY) { console.error('GELATO_API_KEY not set'); process.exit(1) }

  console.log('▸ SHERO Greeting Card — Pack of 10\n')

  process.stdout.write('  Front (patch): ')
  const frontUrl = await uploadFile(`${DESKTOP}/shero_patch_highrez.tiff`, 'gelato/cards/shero-patch-front.jpg', true)
  console.log('✓')

  process.stdout.write('  Inside (scan): ')
  const insideUrl = await uploadFile(`${DESKTOP}/Scan_swf_sheropackage.jpeg`, 'gelato/cards/shero-scan-inside.jpg', false)
  console.log('✓')

  process.stdout.write('  Creating Gelato product... ')

  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: TEMPLATE_ID,
        title: 'SHERO — Greeting Cards (Pack of 10)',
        description: DESCRIPTION,
        tags: ['shero', 'greeting-card', 'card', 'pack'],
        variants: [
          {
            templateVariantId: VARIANT_ID,
            imagePlaceholders: [
              { name: 'shero_patch_pink-blue_8500x5000.png', fileUrl: frontUrl },
              { name: 'Scan_swf_sheropackage.jpeg',          fileUrl: insideUrl },
            ],
            textPlaceholders: [
              { name: 'Text 7', text: 'Stine Weirsøe Flamant' },
            ],
          },
        ],
      }),
    }
  )

  const json = await res.json()
  if (!res.ok) throw new Error(`Gelato ${res.status}: ${JSON.stringify(json)}`)
  console.log(`✓ ${(json as { id: string }).id}`)
  console.log('\nDone. DRAFT in Gelato — check mockup, then publish in Shopify.')
}

main().catch(err => { console.error(err); process.exit(1) })
