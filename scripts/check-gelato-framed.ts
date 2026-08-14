/**
 * Check Gelato's framed print products — how many variants do they have?
 * Run: npx tsx scripts/check-gelato-framed.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

async function getPage(offset: number) {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=100&offset=${offset}`,
    { headers: { 'X-API-KEY': KEY } }
  )
  const d = await res.json() as { products?: any[] }
  return d.products ?? []
}

async function main() {
  let offset = 0
  const framedProducts: any[] = []

  while (true) {
    const page = await getPage(offset)
    if (!page.length) break
    for (const p of page) {
      if (p.title?.toLowerCase().includes('framed')) {
        framedProducts.push(p)
      }
    }
    offset += 100
    if (page.length < 100) break
  }

  console.log(`Found ${framedProducts.length} framed products in Gelato\n`)

  for (const p of framedProducts.slice(0, 5)) {
    const variants: any[] = p.variants ?? []
    console.log(`"${p.title}"`)
    console.log(`  id: ${p.id}`)
    console.log(`  externalId (Shopify): ${p.externalId ?? 'none'}`)
    console.log(`  variants (${variants.length}):`)
    for (const v of variants.slice(0, 3)) {
      console.log(`    - "${v.title}" uid: ${v.productUid?.slice(0, 60)}...`)
    }
    if (variants.length > 3) console.log(`    ... and ${variants.length - 3} more`)
    console.log()
  }

  // Summary
  const byVariantCount: Record<number, number> = {}
  for (const p of framedProducts) {
    const n = (p.variants ?? []).length
    byVariantCount[n] = (byVariantCount[n] ?? 0) + 1
  }
  console.log('Variant count distribution:', byVariantCount)
}

main().catch(console.error)
