import { readFileSync } from 'fs'
const envContent = readFileSync('/Users/flamant-mini/Documents/FLAMANT/dayindayin-site/.env.local', 'utf8')
const GELATO_KEY = envContent.match(/GELATO_API_KEY=(.+)/)?.[1]?.trim()
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

async function fetchAllGelato() {
  let offset = 0, limit = 100
  const all: any[] = []
  while (true) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=${limit}&offset=${offset}`, { headers: { 'X-API-KEY': GELATO_KEY! } })
    const j = await r.json() as any
    const products = j.products ?? []
    all.push(...products)
    if (products.length < limit) break
    offset += limit
  }
  return all
}

async function main() {
  const all = await fetchAllGelato()
  const stuck = all.filter(p => p.status === 'publishing_error')
  console.log(`Total products: ${all.length}, stuck: ${stuck.length}\n`)
  for (const p of stuck.sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))) {
    console.log(`${p.id}\t${p.createdAt}\t${p.title}`)
  }
}
main().catch(err => { console.error(err); process.exit(1) })
