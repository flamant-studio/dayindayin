/**
 * fix-yellow-blue.ts — recreate Neko Paw Yellow & Blue poster (had publishing_error)
 * Run: npx tsx scripts/fix-yellow-blue.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

const TEMPLATE_ID = '6005fae3-64a6-4f62-8328-93d2ce6bae58'
const PLACEHOLDER = 'nekopaw_yellow_neon.png'
const VARIANT_IDS = [
  'b3d4dda4-ac21-4419-9616-46624fb8090c', // A4
  '2d58a7c4-c307-4c5b-882a-acc019bf4a6a', // A3
  '542aaaaf-3112-42f4-9661-736f460b89d7', // A2
]
const IMAGE_URL = 'https://raw.githubusercontent.com/flamant-studio/dayindayin/main/DayInDayIn%20Images/neko/Neko%20Paw%20%E2%80%94%20Yellow%20%26%20Blue.png'

async function gelato(path: string, method = 'GET', body?: unknown) {
  const res = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}${path}`, {
    method,
    headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`Gelato ${res.status}: ${JSON.stringify(json)}`)
  return json as Record<string, unknown>
}

async function waitForVariants(productId: string, expected = 3, maxWait = 90_000): Promise<Array<{ id: string }>> {
  const start = Date.now()
  while (Date.now() - start < maxWait) {
    const d = await gelato(`/products/${productId}`)
    const variants = (d.variants as Array<{ id: string }>) ?? []
    if (variants.length >= expected) return variants
    process.stdout.write('.')
    await new Promise(r => setTimeout(r, 5_000))
  }
  throw new Error('Timed out waiting for variants')
}

async function main() {
  console.log('Creating Neko Paw — Yellow & Blue (vertical, A4/A3/A2)...')

  const product = await gelato('/products:create-from-template', 'POST', {
    templateId: TEMPLATE_ID,
    title: 'Neko Paw — Yellow & Blue',
    description: '<p>Two-colour cat paw in yellow and blue — from the NEKO series. Fine art giclée print by Stine Weirsøe Flamant. Printed on 200gsm FSC-certified uncoated paper using 12-colour fine art technology.</p><ul><li>Matte finish, no glare</li><li>Printed and shipped on demand by Gelato</li><li>Ships to EU, UK, and Norway within 3–7 business days</li></ul>',
    tags: ['neko', 'cat', 'art-print'],
    variants: VARIANT_IDS.map(id => ({
      templateVariantId: id,
      imagePlaceholders: [{ name: PLACEHOLDER, fileUrl: IMAGE_URL }],
    })),
  })

  const productId = product.id as string
  console.log(`  Created: ${productId}`)

  process.stdout.write('  Waiting for variants')
  const variants = await waitForVariants(productId, 3)
  console.log(` ✓ (${variants.length} variants)`)

  process.stdout.write('  Patching print files on all variants... ')
  for (const v of variants) {
    await gelato(`/products/${productId}/variants/${v.id}`, 'PATCH', { fileUrl: IMAGE_URL })
    await new Promise(r => setTimeout(r, 300))
  }
  console.log('✓')

  console.log('\nDone. Gelato will sync to Shopify in ~1 minute.')
  console.log(`Product ID: ${productId}`)
  console.log('Then run: npx tsx scripts/publish-gelato-to-shopify.ts')
}

main().catch(err => { console.error(err); process.exit(1) })
