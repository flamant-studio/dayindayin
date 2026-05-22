/**
 * patch-gelato-print-files.ts
 *
 * Attaches the correct Neko paw artwork to each Gelato product variant.
 * Run after seed-gelato-neko.ts.
 *
 *   npx tsx scripts/patch-gelato-print-files.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const BLOB_BASE      = 'https://29kekabbrd49avje.public.blob.vercel-storage.com/gelato/neko'

const PRODUCTS = [
  { id: 'bac116b9-6b3e-469e-96ad-f60c4b8ad5c1', file: 'nekopaw_yellow_outline.png',  title: 'Yellow' },
  { id: '7491313b-e865-4796-a6de-a6e9f0c2f365', file: 'nekopaw_yellow_neon.png',     title: 'Yellow Neon' },
  { id: 'c72099af-e77b-48eb-91f7-dd45d332d40e', file: 'nekopaw_yellow_blue.png',     title: 'Yellow & Blue' },
  { id: 'd4af705e-d37a-4342-ae49-0c94e59d7c1e', file: 'nekopaw_pink_outline.png',    title: 'Pink' },
  { id: '0f669aa9-dccf-41f3-8528-f113331b4a0d', file: 'nekopaw_lilac_outline.png',   title: 'Lilac' },
  { id: 'd39ffcc7-5407-4efb-b99e-4cf2a3019ec8', file: 'nekopaw_yellow_outline1.png', title: 'Yellow II' },
]

async function getVariants(productId: string): Promise<Array<{ id: string; title: string }>> {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products/${productId}`,
    { headers: { 'X-API-KEY': GELATO_API_KEY } }
  )
  const data = await res.json() as { variants: Array<{ id: string; title: string }> }
  return data.variants
}

async function attachPrintFile(productId: string, variantId: string, fileUrl: string) {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products/${productId}/variants/${variantId}/print-files`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileUrl, type: 'default' }),
    }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`${res.status}: ${JSON.stringify(err)}`)
  }
  return res.json()
}

async function main() {
  console.log('Attaching print files to all Neko paw product variants\n')

  for (const product of PRODUCTS) {
    const fileUrl = `${BLOB_BASE}/${product.file}`
    console.log(`${product.title} (${product.id})`)

    const variants = await getVariants(product.id)

    for (const variant of variants) {
      process.stdout.write(`  ${variant.title}... `)
      try {
        await attachPrintFile(product.id, variant.id, fileUrl)
        console.log('✓')
      } catch (err) {
        // Already attached on this variant — skip
        const msg = String(err)
        if (msg.includes('already') || msg.includes('409')) {
          console.log('already set')
        } else {
          console.log(`FAILED: ${err}`)
        }
      }
      await new Promise(r => setTimeout(r, 400))
    }
  }

  console.log('\nDone. Gelato will regenerate product mockups — check dashboard in ~1 minute.')
}

main().catch(err => { console.error(err); process.exit(1) })
