/**
 * Debug script: check variant structure in Gelato and Shopify
 * Run: npx tsx scripts/debug-variants.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_KEY = process.env.GELATO_API_KEY!
const STORE_ID = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

async function getGelatoPage(offset: number) {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products?limit=100&offset=${offset}`,
    { headers: { 'X-API-KEY': GELATO_KEY } }
  )
  const d = await res.json() as { products?: any[] }
  return d.products ?? []
}

async function main() {
  let offset = 0
  let totalSynced = 0
  let totalMulti = 0
  let typeCount: Record<string, number> = {}
  const examples: { title: string; variants: string[]; externalId: string | null }[] = []

  while (true) {
    const page = await getGelatoPage(offset)
    if (!page.length) break

    for (const p of page) {
      const variants: string[] = (p.variants ?? []).map((v: any) => v.title)
      const type = variants.length > 1 ? `multi-${variants.length}` : 'single'
      typeCount[type] = (typeCount[type] ?? 0) + 1

      if (p.externalId) totalSynced++
      if (variants.length > 1) {
        totalMulti++
        examples.push({ title: p.title, variants, externalId: p.externalId })
      }

      // Show first mug or tank we find
      if (p.title.toLowerCase().includes('mug') || p.title.toLowerCase().includes('tank')) {
        if (examples.length < 20) {
          examples.push({ title: `[${type}] ${p.title}`, variants, externalId: p.externalId })
        }
      }
    }

    offset += 100
    if (page.length < 100) break
  }

  console.log('\n=== Gelato variant distribution ===')
  console.log(typeCount)
  console.log(`\nTotal synced: ${totalSynced}, multi-variant: ${totalMulti}`)
  console.log('\nSample multi-variant / mug+tank products:')
  for (const e of examples.slice(0, 15)) {
    console.log(`  "${e.title}" externalId=${e.externalId}`)
    console.log(`    variants: ${JSON.stringify(e.variants.slice(0, 4))}`)
  }
}

main().catch(console.error)
