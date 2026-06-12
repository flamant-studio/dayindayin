/**
 * retry-failed-products.ts
 *
 * Finds products in Gelato where artwork patching failed (product exists but
 * variants may still have placeholder artwork). Patches the correct artwork
 * based on matching the product title to the CSV artwork list.
 *
 * Usage:
 *   npx tsx scripts/retry-failed-products.ts mug
 *   npx tsx scripts/retry-failed-products.ts tote
 *   npx tsx scripts/retry-failed-products.ts tanktop
 *
 * The script:
 *   1. Loads all Gelato products matching the product type
 *   2. Matches each against the CSV artwork list by title
 *   3. Patches variants with the correct artwork URL
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

const PRODUCT_TYPE_CONFIG = {
  mug: {
    label: 'Mug',
    csvFile: 'DayInDayIn Images/gelato_mug_export.csv',
    titleSuffix: ' Mug',
  },
  tote: {
    label: 'Tote',
    csvFile: 'DayInDayIn Images/gelato_tote_export.csv',
    titleSuffix: ' Tote',
  },
  tanktop: {
    label: 'Tank Top',
    csvFile: 'DayInDayIn Images/gelato_tank_top_export.csv',
    titleSuffix: ' Tank Top',
  },
} as const

type ProductType = keyof typeof PRODUCT_TYPE_CONFIG

interface Artwork {
  title: string
  url: string
}

function parseCSV(filePath: string): Artwork[] {
  const csv = readFileSync(resolve(process.cwd(), filePath), 'utf8')
  const lines = csv.split('\n').slice(1).filter(l => l.trim())
  const artworks: Artwork[] = []
  for (const line of lines) {
    const fields: string[] = []
    let i = 0, f = '', inQ = false
    while (i < line.length) {
      const c = line[i]
      if (c === '"' && !inQ) { inQ = true; i++; continue }
      if (c === '"' && inQ && line[i + 1] === '"') { f += '"'; i += 2; continue }
      if (c === '"' && inQ) { fields.push(f); f = ''; inQ = false; i++; continue }
      if (c === ',' && !inQ) { i++; continue }
      f += c; i++
    }
    if (f) fields.push(f)
    const [title, , , url] = fields
    if (title && url && url.startsWith('http')) artworks.push({ title, url })
  }
  return artworks
}

async function gelato(path: string, method = 'GET', body?: unknown) {
  const res = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}${path}`, {
    method,
    headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json() as Record<string, unknown>
  if (!res.ok) throw new Error(`Gelato ${res.status} ${path}: ${JSON.stringify(json).slice(0, 300)}`)
  return json
}

async function getAllGelatoProducts(): Promise<Array<{ id: string; title: string; variants: Array<{ id: string }> }>> {
  const all = []
  let offset = 0
  while (true) {
    const d = await gelato(`/products?limit=100&offset=${offset}`)
    const page = (d.products as Array<{ id: string; title: string; variants: Array<{ id: string }> }>) ?? []
    all.push(...page)
    if (page.length < 100) break
    offset += 100
    await new Promise(r => setTimeout(r, 200))
  }
  return all
}

async function getProductVariants(productId: string): Promise<Array<{ id: string }>> {
  const d = await gelato(`/products/${productId}`)
  return (d.variants as Array<{ id: string }>) ?? []
}

async function main() {
  const typeArg = process.argv[2] as ProductType
  if (!PRODUCT_TYPE_CONFIG[typeArg]) {
    console.error('Usage: npx tsx scripts/retry-failed-products.ts [mug|tote|tanktop]')
    process.exit(1)
  }

  const config = PRODUCT_TYPE_CONFIG[typeArg]
  const artworks = parseCSV(config.csvFile)
  const artworkMap = new Map(artworks.map(a => [a.title + config.titleSuffix, a.url]))

  console.log(`\n=== Retry ${config.label} artwork patches ===`)
  console.log(`CSV artworks: ${artworks.length}`)

  const allProducts = await getAllGelatoProducts()
  const typeProducts = allProducts.filter(p => p.title.endsWith(config.titleSuffix))
  console.log(`${config.label} products in Gelato: ${typeProducts.length}\n`)

  let patched = 0, skipped = 0, failed = 0

  for (const p of typeProducts) {
    const artworkUrl = artworkMap.get(p.title)
    if (!artworkUrl) {
      console.log(`  SKIP (no matching artwork): ${p.title}`)
      skipped++
      continue
    }

    process.stdout.write(`  Patching ${p.title}... `)
    try {
      // Get fresh variant list for this product
      const variants = p.variants?.length > 0 ? p.variants : await getProductVariants(p.id)
      for (const v of variants) {
        await gelato(`/products/${p.id}/variants/${v.id}`, 'PATCH', { fileUrl: artworkUrl })
        await new Promise(r => setTimeout(r, 200))
      }
      console.log(`✓ (${variants.length} variants)`)
      patched++
    } catch (err) {
      console.error(`FAILED: ${err}`)
      failed++
    }
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\nDone. Patched: ${patched} | Skipped: ${skipped} | Failed: ${failed}`)
}

main().catch(err => { console.error(err); process.exit(1) })
