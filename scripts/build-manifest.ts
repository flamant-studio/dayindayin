/**
 * build-manifest.ts
 *
 * Builds MANIFEST.csv from the two authoritative sources:
 *   1. The seed script arrays  (posters — 76 products × 3 size variants)
 *   2. The Gelato export CSVs  (mugs/totes/tank tops — 76 each × fixed variants)
 *
 * Run: npx tsx scripts/build-manifest.ts
 * Output: MANIFEST.csv
 *
 * Columns:
 *   product_title, type, artwork_title, artwork_url, artwork_filename,
 *   template_id, expected_variant_count, shopify_handle
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

// ── Template IDs (canonical — from Gelato UI, verified) ────────────────────

const TEMPLATES = {
  posterVertical:  '6005fae3-64a6-4f62-8328-93d2ce6bae58',  // A4/A3/A2 portrait
  posterHorizontal:'18600284-2b9d-433a-af02-d728dc81e83b',  // A5/A4/A3 landscape
  mug:             '0e9a0a04',   // 4 variants: White/Black × Design A/B
  tote:            'a28d9355',   // 1 variant
  tankTop:         '2edd0df8',   // 6 variants: XS/S/M/L/XL/2XL
}

const GH = 'https://raw.githubusercontent.com/flamant-studio/dayindayin/main/DayInDayIn%20Images'

// ── Poster artworks (from seed-gelato-posters-multisize.ts) ───────────────

interface PosterArtwork {
  title: string
  imageUrl: string
  orientation: 'vertical' | 'horizontal' | 'square'
}

const VERTICAL_ARTWORKS: PosterArtwork[] = [
  { title: 'Neko Paw — Yellow',          imageUrl: `${GH}/neko/Neko%20Paw%20%E2%80%94%20Yellow.png`,            orientation: 'vertical' },
  { title: 'Neko Paw — Yellow Neon',     imageUrl: `${GH}/neko/Neko%20Paw%20%E2%80%94%20Yellow%20Neon.png`,     orientation: 'vertical' },
  { title: 'Neko Paw — Yellow & Blue',   imageUrl: `${GH}/neko/Neko%20Paw%20%E2%80%94%20Yellow%20%26%20Blue.png`, orientation: 'vertical' },
  { title: 'Neko Paw — Pink',            imageUrl: `${GH}/neko/Neko%20Paw%20%E2%80%94%20Pink.png`,              orientation: 'vertical' },
  { title: 'Neko Paw — Lilac',           imageUrl: `${GH}/neko/Neko%20Paw%20%E2%80%94%20Lilac.png`,             orientation: 'vertical' },
  { title: 'Neko Paw — Yellow II',       imageUrl: `${GH}/neko/Neko%20Paw%20%E2%80%94%20Yellow%20II.png`,       orientation: 'vertical' },
  { title: 'Neko Paw — Red',             imageUrl: `${GH}/neko/neko_paw_red.png`,                                orientation: 'vertical' },
  { title: 'Neko — Pink',                imageUrl: `${GH}/neko/neko_pink.png`,                                   orientation: 'vertical' },
  { title: 'Neko Human I',               imageUrl: `${GH}/neko/Neko%20Human%20I.png`,                            orientation: 'vertical' },
  { title: 'Neko Human II',              imageUrl: `${GH}/neko/Neko%20Human%20II.png`,                           orientation: 'vertical' },
  { title: 'Mask — I',                   imageUrl: `${GH}/masks/Mask%20%E2%80%94%20I%20cropped.png`,             orientation: 'vertical' },
  { title: 'Mask — II',                  imageUrl: `${GH}/masks/Mask%20%E2%80%94%20II.png`,                      orientation: 'vertical' },
  { title: 'Mask — III',                 imageUrl: `${GH}/masks/Mask%20%E2%80%94%20III.png`,                     orientation: 'vertical' },
  { title: 'Mask — Blasé',               imageUrl: `${GH}/masks/Mask%20%E2%80%94%20Blas%C3%A9.png`,              orientation: 'vertical' },
  { title: 'Mask — Calling',             imageUrl: `${GH}/masks/Mask%20%E2%80%94%20Calling.png`,                 orientation: 'vertical' },
  { title: 'Mask — Dream',               imageUrl: `${GH}/masks/Mask%20%E2%80%94%20Dream.png`,                   orientation: 'vertical' },
  { title: 'Moon Face',                  imageUrl: `${GH}/masks/Moon%20Face.png`,                                 orientation: 'vertical' },
  { title: 'Solar Face',                 imageUrl: `${GH}/masks/Solar%20Face.png`,                                orientation: 'vertical' },
  { title: 'Sea Monsters — Steel',       imageUrl: `${GH}/patterns/Sea%20Monsters%20%E2%80%94%20Steel.png`,      orientation: 'vertical' },
  { title: 'Botanical — Noir',           imageUrl: `${GH}/botanical/Botanical%20%E2%80%94%20Noir.png`,           orientation: 'vertical' },
  { title: 'Botanical — Blanc',          imageUrl: `${GH}/botanical/Botanical%20%E2%80%94%20Blanc.png`,          orientation: 'vertical' },
  { title: 'Garden — Cream',             imageUrl: `${GH}/botanical/Garden%20%E2%80%94%20Cream.png`,             orientation: 'vertical' },
  { title: 'Garden — Sky',               imageUrl: `${GH}/botanical/Garden%20%E2%80%94%20Sky.png`,               orientation: 'vertical' },
  { title: 'Garden — Lavender',          imageUrl: `${GH}/botanical/Garden%20%E2%80%94%20Lavender.png`,          orientation: 'vertical' },
  { title: 'Garden — Sage',              imageUrl: `${GH}/botanical/Garden%20%E2%80%94%20Sage.png`,              orientation: 'vertical' },
  { title: 'Zebra',                      imageUrl: `${GH}/animals/Zebra.jpg`,                                     orientation: 'vertical' },
  { title: 'Tourism — II',               imageUrl: `${GH}/tourism/Tourism%20%E2%80%94%20II.jpg`,                 orientation: 'vertical' },
  { title: 'Sommerby',                   imageUrl: `${GH}/various/Sommerby.png`,                                  orientation: 'vertical' },
]

const HORIZONTAL_ARTWORKS: PosterArtwork[] = [
  { title: 'SHERO — Purple',             imageUrl: `${GH}/shero/SHERO%20%E2%80%94%20Purple.png`,                 orientation: 'horizontal' },
  { title: 'SHERO — Indigo',             imageUrl: `${GH}/shero/SHERO%20%E2%80%94%20Indigo.png`,                 orientation: 'horizontal' },
  { title: 'SHERO — III',                imageUrl: `${GH}/shero/SHERO%20%E2%80%94%20III.png`,                    orientation: 'horizontal' },
  { title: 'Mask Study',                 imageUrl: `${GH}/masks/Mask%20Study.png`,                                orientation: 'horizontal' },
  { title: 'Sri Lanka Masks',            imageUrl: `${GH}/masks/Sri%20Lanka%20Masks.jpg`,                         orientation: 'horizontal' },
  { title: 'Sea Monsters — Blue',        imageUrl: `${GH}/patterns/Sea%20Monsters%20%E2%80%94%20Blue.png`,       orientation: 'horizontal' },
  { title: 'Colour Exploration I',       imageUrl: `${GH}/botanical/Colour_Exploration%201.png`,                  orientation: 'horizontal' },
  { title: 'Colour Exploration II',      imageUrl: `${GH}/botanical/Colour_Exploration%202.png`,                  orientation: 'horizontal' },
  { title: 'Colour Exploration III',     imageUrl: `${GH}/botanical/Colour_Exploration%203.png`,                  orientation: 'horizontal' },
  { title: 'Style Exploration',          imageUrl: `${GH}/botanical/Style_Exploration.png`,                       orientation: 'horizontal' },
  { title: 'Two Cats',                   imageUrl: `${GH}/animals/Two%20Cats.png`,                                orientation: 'horizontal' },
  { title: 'Elephant — Green',           imageUrl: `${GH}/elephants/Elephant%20%E2%80%94%20Green.png`,           orientation: 'horizontal' },
  { title: 'Elephant — Yellow',          imageUrl: `${GH}/elephants/Elephant%20%E2%80%94%20Yellow.png`,          orientation: 'horizontal' },
  { title: 'Elephant — Lilac',           imageUrl: `${GH}/elephants/Elephant%20%E2%80%94%20Lilac.png`,           orientation: 'horizontal' },
  { title: 'Elephant — Red',             imageUrl: `${GH}/elephants/Elephant%20%E2%80%94%20Red.png`,             orientation: 'horizontal' },
  { title: 'Tourism — I',                imageUrl: `${GH}/tourism/Tourism%20%E2%80%94%20I.jpg`,                  orientation: 'horizontal' },
  { title: 'Tourism — III',              imageUrl: `${GH}/tourism/Tourism%20%E2%80%94%20III.jpg`,                orientation: 'horizontal' },
  { title: 'Tourism — IV',               imageUrl: `${GH}/tourism/Tourism%20%E2%80%94%20IV.jpg`,                 orientation: 'horizontal' },
  { title: 'Blue Flower on Green Wood',  imageUrl: `${GH}/flowers/Blue%20Flower%20on%20Green%20Wood.png`,        orientation: 'horizontal' },
  { title: 'Dead Flowers',               imageUrl: `${GH}/flowers/Dead%20Flowers.png`,                           orientation: 'horizontal' },
  { title: 'Flowers on Linen',           imageUrl: `${GH}/flowers/Flowers%20on%20Linen.png`,                     orientation: 'horizontal' },
  { title: 'No Ordinary Stone',          imageUrl: `${GH}/flowers/No%20Ordinary%20Stone.png`,                    orientation: 'horizontal' },
  { title: 'On the Light Table',         imageUrl: `${GH}/flowers/On%20the%20Light%20Table.png`,                 orientation: 'horizontal' },
  { title: 'Purple Flower',              imageUrl: `${GH}/flowers/Purple%20Flower.png`,                           orientation: 'horizontal' },
  { title: 'Red and Green Moss',         imageUrl: `${GH}/flowers/Red%20and%20Green%20Moss.png`,                 orientation: 'horizontal' },
  { title: 'Vase on Stool',              imageUrl: `${GH}/flowers/Vase%20on%20Stool.png`,                        orientation: 'horizontal' },
  { title: 'Taped Objects',              imageUrl: `${GH}/various/Taped%20Objects.png`,                           orientation: 'horizontal' },
  { title: 'Purple Sun',                 imageUrl: `${GH}/tufting/Purple%20Sun.jpg`,                              orientation: 'horizontal' },
  { title: 'Candy I',                    imageUrl: `${GH}/tufting/Candy%20I.jpg`,                                 orientation: 'horizontal' },
  { title: 'Orange Sun',                 imageUrl: `${GH}/tufting/Orange%20Sun.jpg`,                              orientation: 'horizontal' },
  { title: 'Rainbow II',                 imageUrl: `${GH}/tufting/Rainbow%20II.png`,                              orientation: 'horizontal' },
  { title: 'Round Earth',                imageUrl: `${GH}/tufting/Round%20Earth.jpg`,                             orientation: 'horizontal' },
  { title: 'Floral Thing',               imageUrl: `${GH}/tufting/Floral%20Thing.jpg`,                           orientation: 'horizontal' },
  { title: 'Sitspot Large',              imageUrl: `${GH}/tufting/Sitspot%20Large.png`,                           orientation: 'horizontal' },
  { title: 'Elsk',                       imageUrl: `${GH}/tufting/Elsk.png`,                                      orientation: 'horizontal' },
]

const SQUARE_ARTWORKS: PosterArtwork[] = [
  { title: 'Neko Paw — Blue',            imageUrl: `${GH}/neko/neko_paw_blue.png`,                               orientation: 'square' },
  { title: 'Neko Paw — Black & White',   imageUrl: `${GH}/neko/neko_paw_bw.png`,                                 orientation: 'square' },
  { title: 'Mask — Conformist',          imageUrl: `${GH}/masks/Mask%20%E2%80%94%20Conformist.png`,              orientation: 'square' },
  { title: 'Sea Monsters — Gold',        imageUrl: `${GH}/patterns/Sea%20Monsters%20%E2%80%94%20Gold.png`,       orientation: 'square' },
  { title: 'Sea Monsters — Cream',       imageUrl: `${GH}/patterns/Sea%20Monsters%20%E2%80%94%20Cream.png`,      orientation: 'square' },
  { title: 'Monsters — Pattern',         imageUrl: `${GH}/patterns/Monsters%20%E2%80%94%20Pattern.png`,          orientation: 'square' },
  { title: 'Kaninskoven',                imageUrl: `${GH}/patterns/Kaninskoven.png`,                              orientation: 'square' },
  { title: 'Floating Poppies',           imageUrl: `${GH}/botanical/Floating%20Poppies.png`,                     orientation: 'square' },
  { title: 'Night Poppies',              imageUrl: `${GH}/botanical/Night%20Poppies.png`,                        orientation: 'square' },
  { title: 'Poppy Field',                imageUrl: `${GH}/botanical/Poppy%20Field.png`,                          orientation: 'square' },
  { title: 'Forget-Me-Not',              imageUrl: `${GH}/botanical/Forget-Me-Not.png`,                          orientation: 'square' },
  { title: 'Sleeping Cat',               imageUrl: `${GH}/animals/Sleeping%20Cat.png`,                           orientation: 'square' },
  { title: 'Geometric Garden',           imageUrl: `${GH}/various/Geometric%20Garden.png`,                       orientation: 'square' },
]

// ── CSV parser ────────────────────────────────────────────────────────────────

interface CsvArtwork { title: string; url: string }

function parseCSV(filePath: string): CsvArtwork[] {
  // All fields are quoted — push at closing quote, skip commas between fields
  const csv = readFileSync(resolve(process.cwd(), filePath), 'utf8')
  const lines = csv.split('\n').slice(1).filter(l => l.trim())
  const artworks: CsvArtwork[] = []
  for (const line of lines) {
    const fields: string[] = []
    let i = 0, f = '', inQ = false
    while (i < line.length) {
      const c = line[i]
      if (c === '"' && !inQ) { inQ = true; i++; continue }
      if (c === '"' && inQ && line[i + 1] === '"') { f += '"'; i += 2; continue }
      if (c === '"' && inQ) { fields.push(f); f = ''; inQ = false; i++; continue }
      if (c === ',' && !inQ) { i++; continue }  // skip comma between quoted fields
      f += c; i++
    }
    if (f) fields.push(f)
    // fields: [title, description, productUID, printFileUrl, shouldPublish]
    const [title, , , url] = fields
    if (title && url && url.startsWith('http')) artworks.push({ title, url })
  }
  return artworks
}

function filename(url: string): string {
  try { return decodeURIComponent(new URL(url).pathname.split('/').pop() ?? '') }
  catch { return url.split('/').pop() ?? '' }
}

function toHandle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Build manifest rows ───────────────────────────────────────────────────────

interface ManifestRow {
  product_title: string
  type: string
  artwork_title: string
  artwork_url: string
  artwork_filename: string
  template_id: string
  expected_variant_count: number
  shopify_handle: string
  orientation: string
}

const rows: ManifestRow[] = []

// Posters
for (const a of VERTICAL_ARTWORKS) {
  rows.push({
    product_title: a.title,
    type: 'Poster',
    artwork_title: a.title,
    artwork_url: a.imageUrl,
    artwork_filename: filename(a.imageUrl),
    template_id: TEMPLATES.posterVertical,
    expected_variant_count: 3,
    shopify_handle: toHandle(a.title),
    orientation: 'vertical',
  })
}
for (const a of HORIZONTAL_ARTWORKS) {
  rows.push({
    product_title: a.title,
    type: 'Poster',
    artwork_title: a.title,
    artwork_url: a.imageUrl,
    artwork_filename: filename(a.imageUrl),
    template_id: TEMPLATES.posterHorizontal,
    expected_variant_count: 3,
    shopify_handle: toHandle(a.title),
    orientation: 'horizontal',
  })
}
for (const a of SQUARE_ARTWORKS) {
  rows.push({
    product_title: a.title,
    type: 'Poster',
    artwork_title: a.title,
    artwork_url: a.imageUrl,
    artwork_filename: filename(a.imageUrl),
    template_id: TEMPLATES.posterVertical,
    expected_variant_count: 3,
    shopify_handle: toHandle(a.title),
    orientation: 'square',
  })
}

// Mugs
for (const a of parseCSV('DayInDayIn Images/gelato_mug_export.csv')) {
  const title = `${a.title} Mug`
  rows.push({
    product_title: title,
    type: 'Mug',
    artwork_title: a.title,
    artwork_url: a.url,
    artwork_filename: filename(a.url),
    template_id: TEMPLATES.mug,
    expected_variant_count: 4,
    shopify_handle: toHandle(title),
    orientation: '',
  })
}

// Totes
for (const a of parseCSV('DayInDayIn Images/gelato_tote_export.csv')) {
  const title = `${a.title} Tote`
  rows.push({
    product_title: title,
    type: 'Tote',
    artwork_title: a.title,
    artwork_url: a.url,
    artwork_filename: filename(a.url),
    template_id: TEMPLATES.tote,
    expected_variant_count: 1,
    shopify_handle: toHandle(title),
    orientation: '',
  })
}

// Tank Tops
for (const a of parseCSV('DayInDayIn Images/gelato_tank_top_export.csv')) {
  const title = `${a.title} Tank Top`
  rows.push({
    product_title: title,
    type: 'Tank Top',
    artwork_title: a.title,
    artwork_url: a.url,
    artwork_filename: filename(a.url),
    template_id: TEMPLATES.tankTop,
    expected_variant_count: 6,
    shopify_handle: toHandle(title),
    orientation: '',
  })
}

// ── Write CSV ─────────────────────────────────────────────────────────────────

const header = 'product_title,type,artwork_title,artwork_filename,artwork_url,template_id,expected_variant_count,shopify_handle,orientation'

function csvEscape(s: string | number): string {
  const str = String(s)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

const csvLines = [
  header,
  ...rows.map(r => [
    r.product_title,
    r.type,
    r.artwork_title,
    r.artwork_filename,
    r.artwork_url,
    r.template_id,
    r.expected_variant_count,
    r.shopify_handle,
    r.orientation,
  ].map(csvEscape).join(',')),
]

writeFileSync(resolve(process.cwd(), 'MANIFEST.csv'), csvLines.join('\n'), 'utf8')

// Summary
const byType = rows.reduce((acc, r) => { acc[r.type] = (acc[r.type] ?? 0) + 1; return acc }, {} as Record<string, number>)
console.log(`\nMANIFEST.csv written — ${rows.length} products`)
console.log(`  Poster:    ${byType.Poster ?? 0} (${VERTICAL_ARTWORKS.length}V + ${HORIZONTAL_ARTWORKS.length}H + ${SQUARE_ARTWORKS.length}Sq)`)
console.log(`  Mug:       ${byType.Mug ?? 0}`)
console.log(`  Tote:      ${byType.Tote ?? 0}`)
console.log(`  Tank Top:  ${byType['Tank Top'] ?? 0}`)

// Sanity: check for duplicate titles
const seen = new Set<string>()
const dupes = rows.filter(r => { if (seen.has(r.product_title)) return true; seen.add(r.product_title); return false })
if (dupes.length > 0) {
  console.warn(`\n⚠️  Duplicate titles in manifest:`)
  dupes.forEach(d => console.warn(`  ${d.product_title}`))
} else {
  console.log(`  No duplicate titles.`)
}
