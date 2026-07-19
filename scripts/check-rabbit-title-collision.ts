import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

const TARGET_TITLES = ['Rabbit — Tote Bag', 'Rabbit Line Art — Water Bottle']

async function main() {
  let offset = 0
  const limit = 100
  let total = Infinity
  const matches: any[] = []
  const allTitles: string[] = []

  while (offset < total) {
    const r = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=${limit}&offset=${offset}`,
      { headers: { 'X-API-KEY': KEY } }
    )
    if (!r.ok) {
      console.error('HTTP', r.status, await r.text())
      process.exit(1)
    }
    const j = await r.json() as any
    total = j.pagination?.total ?? j.products?.length ?? 0
    const products = j.products ?? []
    for (const p of products) {
      allTitles.push(p.title)
      if (TARGET_TITLES.some(t => p.title?.toLowerCase().includes('rabbit'))) {
        matches.push({ id: p.id, title: p.title, status: p.status })
      }
    }
    offset += limit
    if (products.length === 0) break
  }

  console.log('Total products in store:', total)
  console.log('Titles containing "rabbit":', matches.length)
  console.log(JSON.stringify(matches, null, 2))
}

main().catch(err => { console.error(err); process.exit(1) })
