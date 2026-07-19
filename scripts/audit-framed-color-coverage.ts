import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
const KEY = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

const SIZES = ['21x29.7', 'A3', 'A2', 'A1']
const COLORS = ['Black', 'White', 'Wood']

async function main() {
  let offset = 0, limit = 100
  const all: any[] = []
  while (true) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=${limit}&offset=${offset}`, { headers: { 'X-API-KEY': KEY } })
    const j = await r.json() as any
    const products = j.products ?? []
    all.push(...products)
    if (products.length < limit) break
    offset += limit
  }
  const framed = all.filter(p => p.title?.endsWith('Framed Print') && p.status === 'active')
  console.log('Framed Print products:', framed.length, '\n')

  for (const p of framed) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${p.id}`, { headers: { 'X-API-KEY': KEY } })
    const detail = await r.json() as any
    const titles: string[] = detail.variants?.map((v: any) => v.title) ?? []
    const grid: string[] = []
    for (const size of SIZES) {
      for (const color of COLORS) {
        const has = titles.some(t => t.includes(size) && t.toLowerCase().includes(color.toLowerCase()))
        if (!has) grid.push(`${size}/${color}`)
      }
    }
    console.log(`${p.title.padEnd(42)} | live variants: ${titles.length.toString().padEnd(2)} | missing (of 12): ${grid.length === 12 ? 'ALL (check exceptions list)' : JSON.stringify(grid)}`)
    await sleep(150)
  }
}
main().catch(err => { console.error(err); process.exit(1) })
