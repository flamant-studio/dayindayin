import { readFileSync } from 'fs'
const envContent = readFileSync('/Users/flamant-mini/Documents/FLAMANT/dayindayin-site/.env.local', 'utf8')
const GELATO_KEY = envContent.match(/GELATO_API_KEY=(.+)/)?.[1]?.trim()
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
async function main() {
  let offset = 0; const all: any[] = []
  while (true) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=100&offset=${offset}`, { headers: { 'X-API-KEY': GELATO_KEY! } })
    const j = await r.json() as any
    const p = j.products ?? []; all.push(...p)
    if (p.length < 100) break; offset += 100
  }
  const tally: Record<string, number> = {}
  for (const p of all) tally[p.status] = (tally[p.status] ?? 0) + 1
  console.log('Gelato product-level status across', all.length, 'products:')
  console.log(JSON.stringify(tally, null, 2))
  // list a few publishing_error titles + their updatedAt vs publishedAt
  const errs = all.filter(p => p.status === 'publishing_error')
  console.log(`\npublishing_error sample (title | updatedAt):`)
  for (const p of errs.slice(0, 12)) console.log(`  ${p.title}  | upd=${p.updatedAt}`)
}
main().catch(e => { console.error(e); process.exit(1) })
