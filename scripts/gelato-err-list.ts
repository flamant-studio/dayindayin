import { readFileSync } from 'fs'
const envContent = readFileSync('/Users/flamant-mini/Documents/FLAMANT/dayindayin-site/.env.local', 'utf8')
const GELATO_KEY = envContent.match(/GELATO_API_KEY=(.+)/)?.[1]?.trim()
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
async function main() {
  let offset = 0; const all: any[] = []
  while (true) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=100&offset=${offset}`, { headers: { 'X-API-KEY': GELATO_KEY! } })
    const j = await r.json() as any; const p = j.products ?? []; all.push(...p)
    if (p.length < 100) break; offset += 100
  }
  const errs = all.filter(p => p.status === 'publishing_error').map(p=>p.title).sort()
  console.log(errs.join('\n'))
}
main().catch(e => { console.error(e); process.exit(1) })
