/**
 * fix-totes-v3.ts
 *
 * Re-seeds tote bag products with correctly centered, transparency-preserving PNG crops.
 * Previous version converted to JPEG which destroyed the alpha channel → white box.
 *
 * Fix: crop to square (centered), keep RGBA PNG, upload as image/png.
 *
 * Run: npx tsx scripts/fix-totes-v3.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, unlinkSync, copyFileSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const TEMPLATE_ID    = 'a28d9355-d78d-4d13-afec-8f120d989280'
const VARIANT_ID     = '6fa6d672-f198-40a6-b849-24a4e7be044d'
const PLACEHOLDER_FRONT = 'shopofwords_beauty_print_600dpi.png'
const PLACEHOLDER_BACK  = 'shopofwords_obligatorybeauty_print_600dpi.png'

const PNG_DIR = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/Studio/Shop of Words/udsagn - printklar/shopofwords_collection_byob/byob ai originaler/png-exports'

// Products from the last run (fix-totes-square.ts) — these used JPEG and have white boxes
const OLD_IDS = [
  '01454f3a-36c4-49d3-bd1c-2debd4b3c9a9',
  '7d4ce25e-a0e0-4e6f-abf3-ece3738d713b',
  '4412cc61-9287-45d4-aae7-dccc072b8be2',
  'ee5fe4c0-faa6-486d-bba3-47712edd5a38',
  'a0ee952f-8e74-4847-97c3-4a61d769aa82',
]

const DESCRIPTION = `<p>Premium tote bag featuring original Shop of Words artwork by Stine Weirsøe Flamant. Printed using direct-to-garment (DTG) on a natural cotton tote.</p>
<ul>
<li>Natural cotton, heavy duty</li>
<li>DTG print — vivid, wash-resistant</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`

const TOTES = [
  { file: `${PNG_DIR}/shopofwords_beauty_print_600dpi.png`,            blob: 'gelato/totes/sow-beauty-sq.png',             title: 'Shop of Words — Beauty (Tote)',             tags: ['shop-of-words','tote','beauty','text-art'] },
  { file: `${PNG_DIR}/shopofwords_byob_print_600dpi.png`,              blob: 'gelato/totes/sow-byob-sq.png',               title: 'Shop of Words — BYOB (Tote)',               tags: ['shop-of-words','tote','byob','text-art'] },
  { file: `${PNG_DIR}/shopofwords_mysake_print_600dpi.png`,            blob: 'gelato/totes/sow-mysake-sq.png',             title: 'Shop of Words — My Sake (Tote)',            tags: ['shop-of-words','tote','my-sake','text-art'] },
  { file: `${PNG_DIR}/shopofwords_obligatorybeauty_print_600dpi.png`,  blob: 'gelato/totes/sow-obligatorybeauty-sq.png',   title: 'Shop of Words — Obligatory Beauty (Tote)', tags: ['shop-of-words','tote','obligatory-beauty','text-art'] },
  { file: `${PNG_DIR}/shopofwords_realeyes_print_600dpi.png`,          blob: 'gelato/totes/sow-realeyes-sq.png',           title: 'Shop of Words — Real Eyes (Tote)',          tags: ['shop-of-words','tote','real-eyes','text-art'] },
]

function cropToSquarePng(src: string, dest: string) {
  const out = execSync(`sips -g pixelWidth -g pixelHeight "${src}"`, { encoding: 'utf8' })
  const w = parseInt(out.match(/pixelWidth: (\d+)/)![1])
  const h = parseInt(out.match(/pixelHeight: (\d+)/)![1])
  const side = Math.min(w, h)
  const topOffset = Math.floor((h - side) / 2)
  const leftOffset = Math.floor((w - side) / 2)
  // Center crop — keep as PNG to preserve RGBA transparency
  execSync(
    `sips --cropToHeightWidth ${side} ${side} --cropOffset ${topOffset} ${leftOffset} "${src}" --out "${dest}"`,
    { stdio: 'pipe' }
  )
}

async function uploadCropped(tote: typeof TOTES[0]): Promise<string> {
  const tmpPath = resolve(tmpdir(), `did-tote-v3-${Date.now()}.png`)
  process.stdout.write('cropping to square (PNG)... ')
  cropToSquarePng(tote.file, tmpPath)
  const buffer = readFileSync(tmpPath)
  const mb = (buffer.length / 1024 / 1024).toFixed(1)
  process.stdout.write(`${mb}MB uploading... `)
  const blob = await put(tote.blob, buffer, { access: 'public', contentType: 'image/png', allowOverwrite: true })
  unlinkSync(tmpPath)
  return blob.url
}

async function deleteProduct(id: string) {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products/${id}`,
    { method: 'DELETE', headers: { 'X-API-KEY': GELATO_API_KEY } }
  )
  return res.ok || res.status === 404
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
        variants: [{ templateVariantId: VARIANT_ID, imagePlaceholders: [
          { name: PLACEHOLDER_FRONT, fileUrl: imageUrl },
          { name: PLACEHOLDER_BACK,  fileUrl: imageUrl },
        ]}],
      }),
    }
  )
  const json = await res.json()
  if (!res.ok) throw new Error(`Gelato ${res.status}: ${JSON.stringify(json)}`)
  return (json as { id: string }).id
}

async function main() {
  if (!GELATO_API_KEY) { console.error('GELATO_API_KEY not set'); process.exit(1) }

  console.log('Step 1: Deleting old tote products (JPEG/white-box versions)\n')
  for (const id of OLD_IDS) {
    process.stdout.write(`  DELETE ${id.slice(0,8)}... `)
    const ok = await deleteProduct(id)
    console.log(ok ? '✓' : '✗ (may need manual delete in Gelato)')
  }

  console.log('\nStep 2: Re-seeding with transparent PNG images\n')
  for (const tote of TOTES) {
    console.log(`▸ ${tote.title}`)
    try {
      process.stdout.write('  ')
      const url = await uploadCropped(tote)
      process.stdout.write('creating product... ')
      const id = await createTote(tote, url)
      console.log(`✓ ${id}`)
      await new Promise(r => setTimeout(r, 1200))
    } catch (err) {
      console.error(`\n  FAILED: ${err}`)
    }
    console.log()
  }

  console.log('Done. Publish the new products in Gelato/Shopify to activate them.')
}

main().catch(err => { console.error(err); process.exit(1) })
