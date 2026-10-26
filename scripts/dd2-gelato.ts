import * as dotenv from 'dotenv'
dotenv.config({ path: '/Users/flamant-mini/Projects/FLAMANT/dayindayin-site/.env.local' })
const KEY = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
async function main() {
  let offset = 0; const all: any[] = []
  while (true) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=100&offset=${offset}`, { headers: { 'X-API-KEY': KEY } })
    const j: any = await r.json(); const p = j.products ?? []; all.push(...p)
    if (p.length < 100) break; offset += 100
  }
  require('fs').writeFileSync(process.argv[2], JSON.stringify(all.map(p => ({ id: p.id, title: p.title, status: p.status, externalId: p.externalId, previewUrl: p.previewUrl, templateId: p.templateId })), null, 1))
  console.log(all.length)
}
main()
