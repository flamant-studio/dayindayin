/**
 * Get all 12 variants from the framed vertical template to get pricing
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY = process.env.GELATO_API_KEY!
const TEMPLATE_ID = '392687cd-4959-4186-bc3a-fb135d1e0c1d' // Framed Print — Vertical

async function main() {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/templates/${TEMPLATE_ID}`,
    { headers: { 'X-API-KEY': KEY } }
  )
  const t = await res.json() as any
  console.log('Template:', t.title ?? TEMPLATE_ID)
  console.log('Variants:')
  for (const v of (t.variants ?? [])) {
    console.log(`  "${v.title}" → uid: ${v.productUid}`)
  }
  console.log()
  console.log('Total variants:', t.variants?.length ?? 0)

  // Also check horizontal template
  const HORIZ_TEMPLATE = '992be2b6-4005-4abb-884c-9d4fa2f4affb'
  const r2 = await fetch(
    `https://ecommerce.gelatoapis.com/v1/templates/${HORIZ_TEMPLATE}`,
    { headers: { 'X-API-KEY': KEY } }
  )
  const t2 = await r2.json() as any
  console.log('\nHorizontal template:', t2.title ?? HORIZ_TEMPLATE)
  console.log('Variants:')
  for (const v of (t2.variants ?? [])) {
    console.log(`  "${v.title}" → uid: ${v.productUid}`)
  }
  console.log('Total horizontal variants:', t2.variants?.length ?? 0)
}

main().catch(console.error)
