import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

const TARGET_SUFFIXES = ['Fine Art Print', 'Art Print', 'Poster', 'Framed Print']

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  let offset = 0
  const limit = 100
  const all: any[] = []
  while (true) {
    const r = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=${limit}&offset=${offset}`,
      { headers: { 'X-API-KEY': KEY } }
    )
    const j = await r.json() as any
    const products = j.products ?? []
    all.push(...products)
    if (products.length < limit) break
    offset += limit
  }

  const matches = all.filter(p =>
    TARGET_SUFFIXES.some(s => p.title?.endsWith(s)) && p.status === 'active'
  )
  console.log('Matched products:', matches.length, 'of', all.length, 'total\n')

  const results: any[] = []
  for (const p of matches) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${p.id}`, {
      headers: { 'X-API-KEY': KEY }
    })
    const detail = await r.json() as any
    const templateSizes = detail.productVariantOptions?.find((o: any) =>
      /size|format/i.test(o.name)
    )?.values ?? []
    const liveSizes = detail.variants?.map((v: any) => v.title) ?? []
    results.push({
      title: p.title,
      id: p.id,
      templateSizes,
      liveSizes,
      variantCount: detail.variants?.length ?? 0
    })
    await sleep(150)
  }

  for (const r of results) {
    const missing = r.templateSizes.length > r.liveSizes.length ? ' <-- MISSING SIZES' : ''
    console.log(`${r.title.padEnd(45)} | live(${r.variantCount}): ${JSON.stringify(r.liveSizes)} | template offers(${r.templateSizes.length}): ${JSON.stringify(r.templateSizes)}${missing}`)
  }

  const needsWork = results.filter(r => r.templateSizes.length > r.liveSizes.length)
  console.log(`\n\n${needsWork.length} of ${results.length} products are missing at least one size the template supports.`)

  console.log('\n\n=== CHECKLIST FOR CHROME PROMPT ===\n')
  for (const r of needsWork) {
    const liveBase = r.liveSizes.map((s: string) => s.split(' - ')[0])
    const missing = r.templateSizes.filter((s: string) => !liveBase.includes(s))
    console.log(`- ${r.title} : currently has [${liveBase.join(', ')}] — ADD [${missing.join(', ')}]`)
  }

  const zeroTemplate = results.filter(r => r.templateSizes.length === 0)
  console.log('\n\n=== EXCEPTIONS (no template size data returned — inspect manually first) ===\n')
  for (const r of zeroTemplate) console.log(`- ${r.title}`)
}
main().catch(err => { console.error(err); process.exit(1) })
