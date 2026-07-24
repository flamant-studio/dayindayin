import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
const KEY = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

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
  const targets = ['Mask — II — Framed Print', 'SHERO — Purple — Fine Art Print', 'Elsk — Framed Print']
  for (const title of targets) {
    const p = all.find(x => x.title === title)
    if (!p) { console.log(title, '-> NOT FOUND'); continue }
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${p.id}`, { headers: { 'X-API-KEY': KEY } })
    const detail = await r.json() as any
    const sizes = detail.variants?.map((v: any) => v.title) ?? []
    console.log(`${title} -> ${sizes.length} variant(s): ${JSON.stringify(sizes)}`)
  }
}
main().catch(err => { console.error(err); process.exit(1) })
