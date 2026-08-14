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
async function detail(id: string) {
  const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${id}`, { headers: { 'X-API-KEY': GELATO_KEY! } })
  return await r.json() as any
}

async function main() {
  const all = await fetchAllGelato()
  const mugs = all.filter(p => /mug/i.test(p.title))
  const byTitle = new Map<string, any[]>()
  for (const m of mugs) {
    if (!byTitle.has(m.title)) byTitle.set(m.title, [])
    byTitle.get(m.title)!.push(m)
  }
  for (const [title, group] of byTitle) {
    const results = []
    for (const g of group) {
      const d = await detail(g.id)
      const connected = d.variants.filter((v: any) => v.connectionStatus === 'connected').length
      results.push({ id: g.id, variants: d.variants.length, connected })
    }
    const hasWorking = results.some(r => r.connected >= 1 && r.variants === 1)
    const summary = results.map(r => `[${r.connected}/${r.variants}]`).join(' ')
    console.log(`${hasWorking ? '✅ HAS WORKING SIMPLE COPY' : '❌ NEEDS FIX'}\t${title}\t${summary}\t(${group.length} copies)`)
  }
}
main().catch(err => { console.error(err); process.exit(1) })
