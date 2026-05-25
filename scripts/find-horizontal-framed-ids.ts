import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

const TARGETS = [
  'Tourism I — Framed', 'Tourism II — Framed', 'Tourism III — Framed', 'Tourism IV — Framed',
  'Elephant Green — Framed', 'Elephant Yellow — Framed', 'Elephant Lilac — Framed', 'Elephant Red — Framed',
]

async function main() {
  let offset = 0
  const limit = 100
  const found: { id: string; title: string }[] = []

  while (true) {
    const r = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=${limit}&offset=${offset}`,
      { headers: { 'X-API-KEY': KEY } }
    )
    const j = await r.json() as any
    const products = j.products ?? []
    if (products.length === 0) break

    for (const p of products) {
      if (TARGETS.includes(p.title)) {
        found.push({ id: p.id, title: p.title })
        console.log(`FOUND: ${p.title} → ${p.id}`)
      }
    }

    if (found.length === TARGETS.length) break
    offset += limit
    if (offset > 800) break  // safety
  }

  console.log(`\nFound ${found.length} of ${TARGETS.length}`)
  if (found.length > 0) {
    console.log('\nAdd these to DELETE_IDS in rebuild script:')
    found.forEach(p => console.log(`  '${p.id}', // ${p.title}`))
  }
}

main().catch(err => { console.error(err); process.exit(1) })
