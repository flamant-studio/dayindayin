/**
 * seed-gelato-works-batch.ts
 *
 * Seeds all 51 artworks from lib/data.ts as Gelato print products.
 * These are distinct from the previously seeded Neko/Tourism/Elephant/etc products.
 *
 * Images are already in Vercel Blob from the upload-works-images.ts / upload-works-batch2.ts runs.
 *
 * Strategy:
 *   - Tufting (19) + Embroidery (11) → Portrait template (A4/A3/A2)
 *   - Paintings (10) + Photography (11) → Landscape template (A3/A5/A4 landscape sizes)
 *
 * Run: npx tsx scripts/seed-gelato-works-batch.ts
 * To do a dry run: DRY_RUN=1 npx tsx scripts/seed-gelato-works-batch.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const DRY_RUN        = process.env.DRY_RUN === '1'
const BLOB_BASE      = 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works'

// Portrait template (A4/A3/A2 vertical)
const PORTRAIT_TEMPLATE   = '6005fae3-64a6-4f62-8328-93d2ce6bae58'
const PORTRAIT_VARIANTS   = [
  'b3d4dda4-ac21-4419-9616-46624fb8090c', // A4
  '2d58a7c4-c307-4c5b-882a-acc019bf4a6a', // A3
  '542aaaaf-3112-42f4-9661-736f460b89d7', // A2
]
const PORTRAIT_PLACEHOLDER = 'nekopaw_yellow_neon.png'

// Landscape template (A3 / A5 / A4 horizontal)
const LANDSCAPE_TEMPLATE   = '18600284-2b9d-433a-af02-d728dc81e83b'
const LANDSCAPE_VARIANTS   = [
  '12c93580-97d9-4815-8565-9febbe8cf35d', // A3 landscape
  '64b85284-3389-4855-8ef5-a8b1c6109616', // 15×20 cm
  '4c6df0a8-18b9-49df-a44f-3d9979aa9acb', // 21×29.7 cm landscape
]
const LANDSCAPE_PLACEHOLDER = 'Tourism_1.png'

const PRINT_DESCRIPTION = (medium: string) =>
  `<p>Fine art giclée print by Copenhagen artist Stine Weirsøe Flamant. ${medium}. Printed on 200gsm FSC-certified enhanced matte paper.</p>
<ul>
<li>Available in three sizes</li>
<li>Matte finish, no glare</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`

interface WorkDef {
  slug: string
  title: string
  category: 'tufting' | 'embroidery' | 'painting' | 'photography'
  year: string
  description: string
}

// All 51 works from lib/data.ts
const WORKS: WorkDef[] = [
  // Tufting (19) — portrait template
  { slug: 'purple-sun',        title: 'Purple Sun',              category: 'tufting',     year: '2019', description: 'Hand-tufted wool on canvas.' },
  { slug: 'candy-I',           title: 'Candy I',                 category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'orange-sun',        title: 'Orange Sun',              category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'rainbow-I',         title: 'Rainbow I',               category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'birds',             title: 'Birds',                   category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'du-und',            title: 'Du und',                  category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'hej',               title: 'Hej',                     category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'liebes-panopticon', title: 'Liebes Panopticon',       category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'floral-thing',      title: 'Floral Thing',            category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'round-earth',       title: 'Round Earth',             category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'fleur-de-lys',      title: 'Fleur de Lys',           category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'jellyfish',         title: 'Jellyfish',               category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'rainbow-II',        title: 'Rainbow II',              category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'tufted-mask',       title: 'Tufted Mask',             category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'sitspot-large',     title: 'Sitspot Large',           category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'universe-hole',     title: 'Universe with a Hole',    category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'green-flower',      title: 'Green Flower',            category: 'tufting',     year: '2021', description: 'Hand-tufted wool on canvas.' },
  { slug: 'pink-rug',          title: 'Pink Rug',                category: 'tufting',     year: '2020', description: 'Hand-tufted wool on canvas.' },
  { slug: 'bedroom-rug',       title: 'Bedroom Rug',             category: 'tufting',     year: '2020', description: 'Hand-tufted wool on canvas.' },
  // Embroidery (11) — portrait template
  { slug: 'fuck-alting',         title: 'Fuck Alting',               category: 'embroidery', year: '2020', description: 'Embroidery on fabric.' },
  { slug: 'gud-har-meldt-afbud', title: 'Gud Har Meldt Afbud',       category: 'embroidery', year: '2019', description: 'Embroidery on fabric.' },
  { slug: 'elsk',                title: 'Elsk',                       category: 'embroidery', year: '2021', description: 'Embroidery on fabric.' },
  { slug: 'be-a-dragon',         title: 'Be a Dragon',                category: 'embroidery', year: '2021', description: 'Embroidery on fabric.' },
  { slug: 'theres-nothing-here', title: "There's Nothing Here",       category: 'embroidery', year: '2020', description: 'Embroidery on fabric.' },
  { slug: 'mariann',             title: 'Mariann',                    category: 'embroidery', year: '2020', description: 'Embroidery on fabric.' },
  { slug: 'doodles',             title: 'Doodles',                    category: 'embroidery', year: '2021', description: 'Embroidery on fabric.' },
  { slug: 'collage-bw',          title: 'Collage (Black & White)',    category: 'embroidery', year: '2021', description: 'Embroidery on fabric.' },
  { slug: 'apple-scraps',        title: 'Apple Scraps',               category: 'embroidery', year: '2020', description: 'Embroidery on fabric.' },
  { slug: 'perfidt-perfekt',     title: 'Perfidt Perfekt',            category: 'embroidery', year: '2021', description: 'Embroidery on fabric.' },
  { slug: 'ingenting',           title: 'Ingenting',                  category: 'embroidery', year: '2020', description: 'Embroidery on fabric.' },
  // Paintings (10) — landscape template
  { slug: 'universe-1',          title: 'Universe I',                 category: 'painting',   year: '2021', description: 'Mixed media on canvas.' },
  { slug: 'universe-2',          title: 'Universe II',                category: 'painting',   year: '2021', description: 'Mixed media on canvas.' },
  { slug: 'universe-3',          title: 'Universe III',               category: 'painting',   year: '2021', description: 'Mixed media on canvas.' },
  { slug: 'blue-branch',         title: 'Blue Branch',                category: 'painting',   year: '2021', description: 'Mixed media on canvas.' },
  { slug: 'person-walking',      title: 'Person Walking',             category: 'painting',   year: '2021', description: 'Mixed media on canvas.' },
  { slug: 'green-on-blue',       title: 'Green on Blue',             category: 'painting',   year: '2021', description: 'Mixed media on canvas.' },
  { slug: 'colour-study',        title: 'Colour Study',               category: 'painting',   year: '2020', description: 'Mixed media on canvas.' },
  { slug: 'universe-collection', title: 'Universe Collection',        category: 'painting',   year: '2021', description: 'Mixed media on canvas.' },
  { slug: 'colour-study-blue',   title: 'Colour Study Blue',         category: 'painting',   year: '2021', description: 'Mixed media on canvas.' },
  { slug: 'sri-lanka-masks',     title: 'Sri Lanka Masks',            category: 'painting',   year: '2020', description: 'Mixed media on canvas.' },
  // Photography (11) — landscape template
  { slug: 'view-from-the-studio',      title: 'View from the Studio',      category: 'photography', year: '2021', description: 'Fine art photograph.' },
  { slug: 'blue-flower-on-green-wood', title: 'Blue Flower on Green Wood', category: 'photography', year: '2021', description: 'Fine art photograph.' },
  { slug: 'red-and-green-moss',        title: 'Red and Green Moss',        category: 'photography', year: '2021', description: 'Fine art photograph.' },
  { slug: 'no-ordinary-stone',         title: 'No Ordinary Stone',         category: 'photography', year: '2021', description: 'Fine art photograph.' },
  { slug: 'taped-objects',             title: 'Taped Objects',              category: 'photography', year: '2021', description: 'Fine art photograph.' },
  { slug: 'flowers-on-linen',          title: 'Flowers on Linen',          category: 'photography', year: '2021', description: 'Fine art photograph.' },
  { slug: 'polaroids',                 title: 'Polaroids',                  category: 'photography', year: '2021', description: 'Fine art photograph.' },
  { slug: 'on-the-light-table',        title: 'On the Light Table',        category: 'photography', year: '2021', description: 'Fine art photograph.' },
  { slug: 'dead-flowers',              title: 'Dead Flowers',               category: 'photography', year: '2021', description: 'Fine art photograph.' },
  { slug: 'vase-on-stool',             title: 'Vase on Stool',              category: 'photography', year: '2021', description: 'Fine art photograph.' },
  { slug: 'purple-flower',             title: 'Purple Flower',              category: 'photography', year: '2021', description: 'Fine art photograph.' },
]

function blobUrl(work: WorkDef): string {
  return `${BLOB_BASE}/${work.category}/${work.slug}.jpg`
}

function tags(work: WorkDef): string[] {
  return [work.category, 'art-print', `year-${work.year}`, 'stine-weirsoe-flamant']
}

function isPortrait(work: WorkDef): boolean {
  return work.category === 'tufting' || work.category === 'embroidery'
}

async function createProduct(work: WorkDef): Promise<string> {
  const portrait = isPortrait(work)
  const templateId   = portrait ? PORTRAIT_TEMPLATE   : LANDSCAPE_TEMPLATE
  const variants     = portrait ? PORTRAIT_VARIANTS   : LANDSCAPE_VARIANTS
  const placeholder  = portrait ? PORTRAIT_PLACEHOLDER : LANDSCAPE_PLACEHOLDER
  const imgUrl       = blobUrl(work)
  const mediumLabel  = work.category === 'tufting'     ? 'Hand-tufted textile'
                     : work.category === 'embroidery'  ? 'Embroidery on fabric'
                     : work.category === 'painting'    ? 'Mixed media on canvas'
                     :                                   'Fine art photograph'
  const title = `${work.title} — Print`

  const body = {
    templateId,
    title,
    description: PRINT_DESCRIPTION(mediumLabel),
    tags: tags(work),
    variants: variants.map(templateVariantId => ({
      templateVariantId,
      imagePlaceholders: [{ name: placeholder, fileUrl: imgUrl }],
    })),
  }

  if (DRY_RUN) {
    console.log(`  [DRY RUN] would create: ${title}`)
    console.log(`            template: ${templateId.slice(0, 8)}`)
    console.log(`            image: ${imgUrl}`)
    return 'dry-run'
  }

  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
  const json = await res.json() as { id?: string; errors?: unknown }
  if (!res.ok) throw new Error(`Gelato ${res.status}: ${JSON.stringify(json)}`)
  return json.id!
}

async function main() {
  if (!GELATO_API_KEY) { console.error('GELATO_API_KEY not set'); process.exit(1) }

  if (DRY_RUN) console.log('DRY RUN MODE — no products will be created\n')

  const portraits  = WORKS.filter(w => isPortrait(w))
  const landscapes = WORKS.filter(w => !isPortrait(w))

  console.log(`Total: ${WORKS.length} works (${portraits.length} portrait, ${landscapes.length} landscape)\n`)

  let created = 0
  let failed  = 0

  for (const work of WORKS) {
    process.stdout.write(`▸ [${work.category}] ${work.title} ... `)
    try {
      const id = await createProduct(work)
      console.log(`✓ ${id.slice(0, 8)}`)
      created++
      if (!DRY_RUN) await new Promise(r => setTimeout(r, 1500))
    } catch (err) {
      console.log(`FAILED: ${err}`)
      failed++
    }
  }

  console.log(`\nDone. Created: ${created}, Failed: ${failed}`)
  if (!DRY_RUN) console.log('All products are DRAFT — publish in Gelato/Shopify to activate.')
}

main().catch(err => { console.error(err); process.exit(1) })
