import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

async function main() {
  let offset = 0
  const postcards: { id: string; title: string }[] = []
  while (true) {
    const r = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=100&offset=${offset}`,
      { headers: { 'X-API-KEY': KEY } }
    )
    const j = await r.json() as any
    const products: any[] = j.products ?? []
    if (!products.length) break
    postcards.push(...products.filter((p: any) => /postcard/i.test(p.title)).map((p: any) => ({ id: p.id, title: p.title })))
    offset += 100
    if (offset > 5000) break
  }

  if (!postcards.length) { console.log('No postcards found.'); return }
  console.log(`Found ${postcards.length} postcards — deleting...`)

  for (const p of postcards) {
    process.stdout.write(`  DELETE "${p.title}" ... `)
    const r = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${p.id}`,
      { method: 'DELETE', headers: { 'X-API-KEY': KEY } }
    )
    console.log(r.ok || r.status === 404 ? '✓' : `✗ ${r.status}`)
  }
  console.log('Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
