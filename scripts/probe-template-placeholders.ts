/**
 * probe-template-placeholders.ts
 *
 * Creates one test product per new template trying different imagePlaceholder names.
 * Reads the API error to discover what placeholder names each template expects.
 * Deletes test products after each probe.
 *
 * Run: npx tsx scripts/probe-template-placeholders.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

const TEST_IMAGE = 'https://29kekabbrd49avje.public.blob.vercel-storage.com/gelato/neko/nekopaw_yellow_outline.png'

const TEMPLATES = [
  { id: '392687cd-4959-4186-bc3a-fb135d1e0c1d', label: 'framed-vertical' },
  { id: '992be2b6-4005-4abb-884c-9d4fa2f4affb', label: 'framed-horizontal' },
  { id: '0e9a0a04-1016-4216-9a40-4f42a00b8dca', label: 'mug' },
  { id: 'c608faae-710c-4312-bb61-85b9c4a1f4f5', label: 'postcard' },
  { id: '2edd0df8-f9b1-4037-a7a2-456cd768739d', label: 'tank-top' },
  { id: '461771cb-a59e-4d1b-b767-18bab73d6f6c', label: 'tshirt-embroidered' },
]

// Candidate placeholder names to try (in order)
const PROBE_NAMES = [
  'ImagePlaceholder1',
  'Artwork',
  'artwork',
  'image',
  'Image',
  'nekopaw_yellow_neon.png',
  'Tourism_1.png',
]

async function deleteProduct(productId: string) {
  await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${productId}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': KEY },
  })
}

async function tryCreate(templateId: string, placeholderName: string): Promise<{ ok: boolean; id?: string; error?: any }> {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId,
        title: `__PROBE_DELETE_ME__`,
        imagePlaceholders: [{ name: placeholderName, fileUrl: TEST_IMAGE }],
      }),
    }
  )
  const json = await res.json() as any
  if (res.ok) return { ok: true, id: json.id }
  return { ok: false, error: json }
}

async function main() {
  for (const tmpl of TEMPLATES) {
    console.log(`\n── ${tmpl.label} (${tmpl.id}) ──`)

    for (const name of PROBE_NAMES) {
      process.stdout.write(`  trying "${name}"... `)
      const result = await tryCreate(tmpl.id, name)
      if (result.ok) {
        console.log(`✓ WORKS — product: ${result.id}`)
        await deleteProduct(result.id!)
        console.log(`  → deleted test product`)
        break
      } else {
        const msg = result.error?.message ?? result.error?.details ?? JSON.stringify(result.error).slice(0, 120)
        console.log(`✗  ${msg}`)
      }
    }
  }

  console.log('\nDone probing.')
}

main().catch(err => { console.error(err); process.exit(1) })
