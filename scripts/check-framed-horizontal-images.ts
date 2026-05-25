import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

const TITLES = [
  'Elephant Green — Framed', 'Elephant Yellow — Framed',
  'Elephant Lilac — Framed', 'Elephant Red — Framed',
  'Tourism I — Framed', 'Tourism II — Framed',
  'Tourism III — Framed', 'Tourism IV — Framed',
]

async function main() {
  let offset = 0
  const found: any[] = []

  while (true) {
    const r = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=100&offset=${offset}`,
      { headers: { 'X-API-KEY': KEY } }
    )
    const j = await r.json() as any
    const products = j.products ?? []
    if (!products.length) break

    for (const p of products) {
      if (TITLES.some(t => p.title === t)) {
        found.push(p)
      }
    }
    if (found.length === TITLES.length) break
    offset += 100
    if (offset > 1000) break
  }

  for (const p of found) {
    const detail = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${p.id}`,
      { headers: { 'X-API-KEY': KEY } }
    ).then(r => r.json()) as any

    console.log(`\n▸ ${p.title}`)
    console.log(`  ID: ${p.id}`)
    console.log(`  status: ${detail.status}`)
    console.log(`  images: ${detail.productImages?.length ?? 0}`)
    console.log(`  variants w/ imagePlaceholders:`)
    for (const v of (detail.variants ?? [])) {
      const ph = v.imagePlaceholders ?? []
      const hasFn = ph.some((p: any) => p.fileUrl)
      console.log(`    ${v.title}: ${ph.length} placeholder(s), fileUrl=${hasFn}`)
    }
  }

  if (!found.length) console.log('No horizontal framed products found in Gelato')
}

main().catch(console.error)
