// DD7: read-only Gelato side of the 4 new prints. Run: npx tsx scripts/dd7-gelato-read.ts <out.json>
import * as dotenv from 'dotenv'
import { writeFileSync } from 'fs'
dotenv.config({ path: '/Users/flamant-mini/Projects/FLAMANT/dayindayin-site/.env.local' })
const KEY = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const W = ['Blue Flower on Green Wood', 'Dead Flowers', 'Red and Green Moss', 'Taped Objects']
async function main() {
  let offset = 0; const all: any[] = []
  while (true) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=100&offset=${offset}`, { headers: { 'X-API-KEY': KEY } })
    const j: any = await r.json(); const p = j.products ?? []; all.push(...p)
    if (p.length < 100) break; offset += 100
  }
  const mine = all.filter(p => W.some(w => p.title === `${w} — Fine Art Print`))
  const out: any[] = []
  for (const p of mine) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${p.id}`, { headers: { 'X-API-KEY': KEY } })
    const d: any = await r.json()
    out.push({ id: d.id, title: d.title, status: d.status, externalId: d.externalId, templateId: d.templateId, connectionStatus: d.connectionStatus, publishedAt: d.publishedAt,
      variants: (d.variants ?? []).map((v: any) => ({ id: v.id, title: v.title, externalId: v.externalId, connectionStatus: v.connectionStatus, productUid: v.productUid })) })
  }
  writeFileSync(process.argv[2], JSON.stringify(out, null, 1)); console.log('gelato products matched:', out.length, 'of', all.length)
}
main()
