/**
 * canary-test.ts
 *
 * Creates ONE mug product, patches artwork via POST /print-files (not PATCH /variants),
 * and reports the Gelato product ID + previewUrl for visual QA.
 *
 * Delete this product from Gelato dashboard after verifying.
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const MUG_TEMPLATE   = '0e9a0a04-1016-4216-9a40-4f42a00b8dca'
const ARTWORK_URL    = 'https://raw.githubusercontent.com/flamant-studio/dayindayin/main/DayInDayIn%20Images/neko/Neko%20Paw%20%E2%80%94%20Yellow.png'

async function createProduct(): Promise<string> {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: MUG_TEMPLATE,
        title: 'CANARY TEST — Neko Paw Yellow Mug',
        description: '<p>Canary test — delete after QA.</p>',
        tags: ['canary', 'test'],
      }),
    }
  )
  const json = await res.json() as any
  if (!res.ok) throw new Error(`Create failed: ${JSON.stringify(json)}`)
  return json.id as string
}

async function waitForVariants(productId: string, expected = 4): Promise<any[]> {
  console.log('  waiting for variants', )
  const start = Date.now()
  while (Date.now() - start < 120_000) {
    const res = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products/${productId}`,
      { headers: { 'X-API-KEY': GELATO_API_KEY } }
    )
    const json = await res.json() as any
    const variants = json.variants ?? []
    if (variants.length >= expected) return variants
    await new Promise(r => setTimeout(r, 4000))
    process.stdout.write('.')
  }
  throw new Error('Timed out waiting for variants')
}

async function attachPrintFile(productId: string, variantId: string): Promise<void> {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products/${productId}/variants/${variantId}/print-files`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileUrl: ARTWORK_URL, type: 'default' }),
    }
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`print-files POST failed (${res.status}): ${text}`)
  console.log(`    response (${res.status}): ${text.slice(0, 200)}`)
}

async function getPreviewUrl(productId: string): Promise<string> {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products/${productId}`,
    { headers: { 'X-API-KEY': GELATO_API_KEY } }
  )
  const json = await res.json() as any
  return json.previewUrl ?? '(none yet)'
}

async function main() {
  console.log('CANARY TEST — mug, POST /print-files endpoint\n')
  console.log(`Artwork: ${ARTWORK_URL}\n`)

  console.log('1. Creating product from template...')
  const productId = await createProduct()
  console.log(`   Product ID: ${productId}`)

  console.log('2. Waiting for variants...')
  const variants = await waitForVariants(productId)
  console.log(`\n   ${variants.length} variants:`)
  for (const v of variants) console.log(`     ${v.id}  "${v.title}"`)

  console.log('\n3. Attaching print file to each variant via POST /print-files...')
  for (const v of variants) {
    process.stdout.write(`   ${v.title}... `)
    await attachPrintFile(productId, v.id)
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n4. Fetching preview URL...')
  const previewUrl = await getPreviewUrl(productId)
  console.log(`   Preview: ${previewUrl}`)

  console.log('\n--- CANARY RESULT ---')
  console.log(`Product ID : ${productId}`)
  console.log(`Preview URL: ${previewUrl}`)
  console.log('\nGelato is generating mockups. Check the preview URL in ~1-2 minutes.')
  console.log('Delete from Gelato dashboard after QA.')
}

main().catch(err => { console.error('FATAL:', err); process.exit(1) })
