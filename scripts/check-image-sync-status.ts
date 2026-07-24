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
  const matches = all.filter(p => p.title === 'Neko Paw — Black & White')
  console.log('Gelato products titled exactly "Neko Paw — Black & White":', matches.length)
  for (const p of matches) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${p.id}`, { headers: { 'X-API-KEY': KEY } })
    const detail = await r.json() as any
    console.log('---')
    console.log('gelato id:', detail.id, 'updatedAt:', detail.updatedAt)
    console.log('variant productUids:', detail.variants?.map((v:any)=>v.productUid))
    console.log('variant externalIds:', detail.variants?.map((v:any)=>v.externalId))
    console.log('productImages:', JSON.stringify(detail.productImages?.map((i:any)=>({id:i.id, status:i.status, updatedAt:i.updatedAt, isPrimary:i.isPrimary})), null, 2))
  }
}
main().catch(err => { console.error(err); process.exit(1) })
