/**
 * seed-gelato-product-batch.ts
 *
 * Batch-creates Gelato products (mugs, totes, tank tops) for all 76 artworks.
 * Reads artwork list from CSV, creates one product per artwork via the template API,
 * waits for variants, patches artwork onto all variants.
 *
 * Usage:
 *   npx tsx scripts/seed-gelato-product-batch.ts mug
 *   npx tsx scripts/seed-gelato-product-batch.ts tote
 *   npx tsx scripts/seed-gelato-product-batch.ts tanktop
 *   npx tsx scripts/seed-gelato-product-batch.ts mug --limit 1      # canary
 *   npx tsx scripts/seed-gelato-product-batch.ts mug --skip 5       # resume from offset
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

const PRODUCT_TYPES = {
  mug: {
    templateId: '0e9a0a04-1016-4216-9a40-4f42a00b8dca',
    label: 'Mug',
    expectedVariants: 4,
    csvFile: 'DayInDayIn Images/gelato_mug_export.csv',
    descSuffix: '<ul><li>330ml ceramic mug</li><li>Dishwasher safe</li><li>Printed and shipped on demand by Gelato</li><li>Ships to EU, UK, and Norway within 5–10 business days</li></ul>',
    tags: ['mug', 'drinkware'],
  },
  tote: {
    templateId: 'a28d9355-d78d-4d13-afec-8f120d989280',
    label: 'Tote',
    expectedVariants: 1,
    csvFile: 'DayInDayIn Images/gelato_tote_export.csv',
    descSuffix: '<ul><li>Natural cotton tote bag</li><li>DTG print, wash-resistant</li><li>Printed and shipped on demand by Gelato</li><li>Ships to EU, UK, and Norway within 5–10 business days</li></ul>',
    tags: ['tote', 'bag', 'accessories'],
  },
  tanktop: {
    templateId: '2edd0df8-f9b1-4037-a7a2-456cd768739d',
    label: 'Tank Top',
    expectedVariants: 6,
    csvFile: 'DayInDayIn Images/gelato_tank_top_export.csv',
    descSuffix: '<ul><li>Unisex organic cotton tank top, white</li><li>Sizes XS–2XL</li><li>DTG print, soft feel</li><li>Printed and shipped on demand by Gelato</li><li>Ships to EU, UK, and Norway within 5–10 business days</li></ul>',
    tags: ['apparel', 'tank-top'],
  },
} as const

type ProductType = keyof typeof PRODUCT_TYPES

interface Artwork {
  title: string
  desc: string
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
    const [title, desc, , url] = fields
    if (title && url && url.startsWith('http')) artworks.push({ title, desc, url })
  }
  return artworks
}

function inferTags(title: string, baseTags: string[]): string[] {
  const t = title.toLowerCase()
  const series: string[] = [...baseTags]
  if (t.includes('neko') || t.includes('neko paw')) series.push('neko', 'cat')
  if (t.includes('shero')) series.push('shero')
  if (t.includes('mask') || t.includes('face')) series.push('faces', 'mask')
  if (t.includes('sea monster')) series.push('sea-monsters')
  if (t.includes('botanical') || t.includes('garden') || t.includes('floral') || t.includes('flower')) series.push('botanical')
  if (t.includes('tourism') || t.includes('sommerby')) series.push('photography')
  if (t.includes('elephant') || t.includes('zebra') || t.includes('cat') || t.includes('sleeping cat')) series.push('animals')
  if (t.includes('colour exploration') || t.includes('color exploration')) series.push('botanical')
  if (t.includes('kaninskoven')) series.push('animals')
  return [...new Set(series)]
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

async function waitForVariants(productId: string, expected: number, maxWait = 120_000): Promise<Array<{ id: string }>> {
  const start = Date.now()
  while (Date.now() - start < maxWait) {
    const d = await gelato(`/products/${productId}`)
    const variants = (d.variants as Array<{ id: string }>) ?? []
    if (variants.length >= expected) return variants
    process.stdout.write('.')
    await new Promise(r => setTimeout(r, 6_000))
  }
  throw new Error(`Timed out waiting for ${expected} variants on ${productId}`)
}

async function main() {
  const typeArg = process.argv[2] as ProductType
  const limitArg = process.argv.includes('--limit') ? parseInt(process.argv[process.argv.indexOf('--limit') + 1]) : Infinity
  const skipArg = process.argv.includes('--skip') ? parseInt(process.argv[process.argv.indexOf('--skip') + 1]) : 0

  if (!PRODUCT_TYPES[typeArg]) {
    console.error(`Usage: npx tsx scripts/seed-gelato-product-batch.ts [mug|tote|tanktop] [--limit N] [--skip N]`)
    process.exit(1)
  }

  const config = PRODUCT_TYPES[typeArg]
  const artworks = parseCSV(config.csvFile).slice(skipArg, skipArg + limitArg)

  console.log(`\n=== ${config.label} batch ===`)
  console.log(`Template: ${config.templateId}`)
  console.log(`Artworks: ${artworks.length} (skip: ${skipArg}, limit: ${isFinite(limitArg) ? limitArg : 'all'})`)
  console.log(`Expected variants per product: ${config.expectedVariants}\n`)

  let created = 0, failed = 0

  for (const [i, artwork] of artworks.entries()) {
    const idx = skipArg + i + 1
    console.log(`[${idx}/${skipArg + artworks.length}] ${artwork.title}`)
    try {
      process.stdout.write('  creating... ')
      const product = await gelato('/products:create-from-template', 'POST', {
        templateId: config.templateId,
        title: `${artwork.title} ${config.label}`,
        description: `<p>${artwork.desc}</p>${config.descSuffix}`,
        tags: inferTags(artwork.title, config.tags),
      })
      const productId = product.id as string
      console.log(`✓ ${productId}`)

      process.stdout.write('  variants')
      const variants = await waitForVariants(productId, config.expectedVariants)
      console.log(` ✓ (${variants.length})`)

      process.stdout.write('  patching artwork... ')
      for (const v of variants) {
        await gelato(`/products/${productId}/variants/${v.id}`, 'PATCH', { fileUrl: artwork.url })
        await new Promise(r => setTimeout(r, 300))
      }
      console.log('✓')

      created++
      await new Promise(r => setTimeout(r, 500))
    } catch (err) {
      console.error(`\n  FAILED: ${err}`)
      failed++
    }
    console.log()
  }

  console.log(`\n=== Done ===`)
  console.log(`Created: ${created} | Failed: ${failed}`)
  console.log(`Next: npx tsx scripts/publish-gelato-to-shopify.ts`)
}

main().catch(err => { console.error(err); process.exit(1) })
