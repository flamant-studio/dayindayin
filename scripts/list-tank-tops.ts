/**
 * List all tank top products in Gelato with their Shopify IDs
 * Run: npx tsx scripts/list-tank-tops.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_KEY = process.env.GELATO_API_KEY!
const STORE_ID = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

async function main() {
  const tanks: { id: string; title: string; externalId: string | null; imageUrl: string | null }[] = []
  let offset = 0

  while (true) {
    const res = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products?limit=100&offset=${offset}`,
      { headers: { 'X-API-KEY': GELATO_KEY } }
    )
    const d = await res.json() as { products?: any[] }
    const page = d.products ?? []
    if (!page.length) break

    for (const p of page) {
      if (p.title.toLowerCase().includes('tank top')) {
        tanks.push({
          id: p.id,
          title: p.title,
          externalId: p.externalId,
          imageUrl: p.previewUrl ?? null,
        })
      }
    }

    offset += 100
    if (page.length < 100) break
  }

  const synced = tanks.filter(t => t.externalId)
  console.log(`\nTotal tank tops: ${tanks.length}`)
  console.log(`Synced to Shopify: ${synced.length}`)
  console.log(`Not synced: ${tanks.length - synced.length}`)
  console.log('\n--- All tank tops ---')
  for (const t of tanks) {
    console.log(`  ${t.externalId ? '✓' : '○'} "${t.title}" gelato=${t.id.slice(0,8)} shopify=${t.externalId ?? 'none'}`)
  }
}

main().catch(console.error)
