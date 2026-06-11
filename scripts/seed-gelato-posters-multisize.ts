/**
 * seed-gelato-posters-multisize.ts
 *
 * Replaces all single-variant Gelato poster products with proper multi-size versions.
 * Uses create-from-template API with GitHub raw URLs (no Vercel Blob needed).
 *
 * Vertical artworks  → template 6005fae3 → A4 / A3 / A2 portrait
 * Horizontal artworks → template 18600284 → A5 / A4 / A3 landscape
 * Square artworks     → vertical template  → A4 / A3 / A2 (bordered)
 *
 * Run: npx tsx scripts/seed-gelato-posters-multisize.ts
 * Dry run: DRY_RUN=1 npx tsx scripts/seed-gelato-posters-multisize.ts
 * Skip delete: SKIP_DELETE=1 npx tsx scripts/seed-gelato-posters-multisize.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const DRY_RUN = process.env.DRY_RUN === '1'
const SKIP_DELETE = process.env.SKIP_DELETE === '1'

const VERTICAL_TEMPLATE = {
  id: '6005fae3-64a6-4f62-8328-93d2ce6bae58',
  placeholder: 'nekopaw_yellow_neon.png',
  variants: [
    'b3d4dda4-ac21-4419-9616-46624fb8090c', // A4 21×29.7 cm
    '2d58a7c4-c307-4c5b-882a-acc019bf4a6a', // A3 29.7×42 cm
    '542aaaaf-3112-42f4-9661-736f460b89d7', // A2 42×59.4 cm
  ],
}

const HORIZONTAL_TEMPLATE = {
  id: '18600284-2b9d-433a-af02-d728dc81e83b',
  placeholder: 'Tourism_1.png',
  variants: [
    '64b85284-3389-4855-8ef5-a8b1c6109616', // 15×20 cm (A5)
    '4c6df0a8-18b9-49df-a44f-3d9979aa9acb', // 21×29.7 cm (A4)
    '12c93580-97d9-4815-8565-9febbe8cf35d', // 29.7×42 cm (A3)
  ],
}

const GH = 'https://raw.githubusercontent.com/flamant-studio/dayindayin/main/DayInDayIn%20Images'

function desc(series: string, extra = '') {
  return `<p>${extra ? extra + ' ' : ''}Fine art giclée print by Stine Weirsøe Flamant. Printed on 200gsm FSC-certified uncoated paper using 12-colour fine art technology.</p><ul><li>Matte finish, no glare</li><li>Printed and shipped on demand by Gelato</li><li>Ships to EU, UK, and Norway within 3–7 business days</li></ul>`
}

interface Artwork {
  title: string
  description: string
  tags: string[]
  imageUrl: string
  template: typeof VERTICAL_TEMPLATE
}

const VERTICAL_ARTWORKS: Omit<Artwork, 'template'>[] = [
  { title: 'Neko Paw — Yellow', description: desc('NEKO', 'Bold graphic cat paw in yellow — from the NEKO series.'), tags: ['neko', 'cat', 'art-print'], imageUrl: `${GH}/neko/Neko%20Paw%20%E2%80%94%20Yellow.png` },
  { title: 'Neko Paw — Yellow Neon', description: desc('NEKO', 'Electric neon yellow cat paw — from the NEKO series.'), tags: ['neko', 'cat', 'art-print'], imageUrl: `${GH}/neko/Neko%20Paw%20%E2%80%94%20Yellow%20Neon.png` },
  { title: 'Neko Paw — Yellow & Blue', description: desc('NEKO', 'Two-colour cat paw in yellow and blue — from the NEKO series.'), tags: ['neko', 'cat', 'art-print'], imageUrl: `${GH}/neko/Neko%20Paw%20%E2%80%94%20Yellow%20%26%20Blue.png` },
  { title: 'Neko Paw — Pink', description: desc('NEKO', 'Soft pink cat paw in bold graphic outline — from the NEKO series.'), tags: ['neko', 'cat', 'art-print'], imageUrl: `${GH}/neko/Neko%20Paw%20%E2%80%94%20Pink.png` },
  { title: 'Neko Paw — Lilac', description: desc('NEKO', 'Dreamy lilac cat paw — from the NEKO series.'), tags: ['neko', 'cat', 'art-print'], imageUrl: `${GH}/neko/Neko%20Paw%20%E2%80%94%20Lilac.png` },
  { title: 'Neko Paw — Yellow II', description: desc('NEKO', 'Second yellow variant of the NEKO paw series.'), tags: ['neko', 'cat', 'art-print'], imageUrl: `${GH}/neko/Neko%20Paw%20%E2%80%94%20Yellow%20II.png` },
  { title: 'Neko Paw — Red', description: desc('NEKO', 'Fierce red cat paw — a bolder, warmer take on the NEKO paw series.'), tags: ['neko', 'cat', 'art-print'], imageUrl: `${GH}/neko/neko_paw_red.png` },
  { title: 'Neko — Pink', description: desc('NEKO', 'A pink variant from the NEKO cat series.'), tags: ['neko', 'cat', 'art-print'], imageUrl: `${GH}/neko/neko_pink.png` },
  { title: 'Neko Human I', description: desc('NEKO', 'Where human and cat meet — from the NEKO Procreate series.'), tags: ['neko', 'cat', 'faces', 'art-print'], imageUrl: `${GH}/neko/Neko%20Human%20I.png` },
  { title: 'Neko Human II', description: desc('NEKO', 'Second piece in the Neko Human series — fluid digital line work.'), tags: ['neko', 'cat', 'faces', 'art-print'], imageUrl: `${GH}/neko/Neko%20Human%20II.png` },
  { title: 'Mask — I', description: desc('Masks', 'A hand-drawn mask in expressive line — ink on paper.'), tags: ['faces', 'mask', 'art-print'], imageUrl: `${GH}/masks/Mask%20%E2%80%94%20I%20cropped.png` },
  { title: 'Mask — II', description: desc('Masks', 'Second mask study — rich texture, bold presence.'), tags: ['faces', 'mask', 'art-print'], imageUrl: `${GH}/masks/Mask%20%E2%80%94%20II.png` },
  { title: 'Mask — III', description: desc('Masks', 'Third mask study — each mask carries its own emotional weight.'), tags: ['faces', 'mask', 'art-print'], imageUrl: `${GH}/masks/Mask%20%E2%80%94%20III.png` },
  { title: 'Mask — Blasé', description: desc('Masks', 'A Procreate digital mask portrait — detached, knowing, slightly bored.'), tags: ['faces', 'mask', 'art-print'], imageUrl: `${GH}/masks/Mask%20%E2%80%94%20Blas%C3%A9.png` },
  { title: 'Mask — Calling', description: desc('Masks', 'A mask that reaches out — gesture and identity through masked figures.'), tags: ['faces', 'mask', 'art-print'], imageUrl: `${GH}/masks/Mask%20%E2%80%94%20Calling.png` },
  { title: 'Mask — Dream', description: desc('Masks', 'Softly surreal — a masked figure between sleep and thought.'), tags: ['faces', 'mask', 'art-print'], imageUrl: `${GH}/masks/Mask%20%E2%80%94%20Dream.png` },
  { title: 'Moon Face', description: desc('Faces', 'A face caught in lunar light — soft and otherworldly.'), tags: ['faces', 'art-print'], imageUrl: `${GH}/masks/Moon%20Face.png` },
  { title: 'Solar Face', description: desc('Faces', 'A face turned toward the sun — radiating warmth and bold colour.'), tags: ['faces', 'art-print'], imageUrl: `${GH}/masks/Solar%20Face.png` },
  { title: 'Sea Monsters — Steel', description: desc('Sea Monsters', 'Playful sea creatures in a cool steel palette — from the Sea Monsters series.'), tags: ['sea-monsters', 'art-print'], imageUrl: `${GH}/patterns/Sea%20Monsters%20%E2%80%94%20Steel.png` },
  { title: 'Botanical — Noir', description: desc('Botanical', 'Dark botanical composition with a rich, moody palette.'), tags: ['botanical', 'art-print'], imageUrl: `${GH}/botanical/Botanical%20%E2%80%94%20Noir.png` },
  { title: 'Botanical — Blanc', description: desc('Botanical', 'A lighter, airy botanical composition — soft forms and summer colours.'), tags: ['botanical', 'art-print'], imageUrl: `${GH}/botanical/Botanical%20%E2%80%94%20Blanc.png` },
  { title: 'Garden — Cream', description: desc('Garden', 'A garden in cream tones — delicate flowers and loose botanical forms.'), tags: ['botanical', 'art-print'], imageUrl: `${GH}/botanical/Garden%20%E2%80%94%20Cream.png` },
  { title: 'Garden — Sky', description: desc('Garden', 'Garden compositions set against an open sky blue.'), tags: ['botanical', 'art-print'], imageUrl: `${GH}/botanical/Garden%20%E2%80%94%20Sky.png` },
  { title: 'Garden — Lavender', description: desc('Garden', 'Botanical forms in soft lavender — meditative mood.'), tags: ['botanical', 'art-print'], imageUrl: `${GH}/botanical/Garden%20%E2%80%94%20Lavender.png` },
  { title: 'Garden — Sage', description: desc('Garden', 'Garden in sage green — earthy, quiet, grounded.'), tags: ['botanical', 'art-print'], imageUrl: `${GH}/botanical/Garden%20%E2%80%94%20Sage.png` },
  { title: 'Zebra', description: desc('Animals', 'A zebra study in bold graphic lines — pattern meeting animal form.'), tags: ['animals', 'art-print'], imageUrl: `${GH}/animals/Zebra.jpg` },
  { title: 'Tourism — II', description: desc('Tourism', 'Second in the Tourism series — landscape photography on fine art paper.'), tags: ['tourism', 'photography', 'art-print'], imageUrl: `${GH}/tourism/Tourism%20%E2%80%94%20II.jpg` },
  { title: 'Sommerby', description: desc('Sommerby', 'Inspired by Sommerby — the atmosphere of a Danish summer place.'), tags: ['sommerby', 'art-print'], imageUrl: `${GH}/various/Sommerby.png` },
]

const HORIZONTAL_ARTWORKS: Omit<Artwork, 'template'>[] = [
  { title: 'SHERO — Purple', description: desc('SHERO', 'The SHERO print in deep purple — feminist pop-art icon.'), tags: ['shero', 'art-print'], imageUrl: `${GH}/shero/SHERO%20%E2%80%94%20Purple.png` },
  { title: 'SHERO — Indigo', description: desc('SHERO', 'SHERO in indigo — cool, dark feminist graphic.'), tags: ['shero', 'art-print'], imageUrl: `${GH}/shero/SHERO%20%E2%80%94%20Indigo.png` },
  { title: 'SHERO — III', description: desc('SHERO', 'Third print in the SHERO series — layered colour, strong graphic composition.'), tags: ['shero', 'art-print'], imageUrl: `${GH}/shero/SHERO%20%E2%80%94%20III.png` },
  { title: 'Mask Study', description: desc('Masks', 'A looser, more exploratory mask drawing — raw and immediate.'), tags: ['faces', 'mask', 'art-print'], imageUrl: `${GH}/masks/Mask%20Study.png` },
  { title: 'Sri Lanka Masks', description: desc('Masks', 'Inspired by Sri Lankan ceremonial masks — oil on board.'), tags: ['faces', 'mask', 'painting', 'art-print'], imageUrl: `${GH}/masks/Sri%20Lanka%20Masks.jpg` },
  { title: 'Sea Monsters — Blue', description: desc('Sea Monsters', 'Sea Monsters in deep ocean blue — quirky underwater world.'), tags: ['sea-monsters', 'art-print'], imageUrl: `${GH}/patterns/Sea%20Monsters%20%E2%80%94%20Blue.png` },
  { title: 'Colour Exploration I', description: desc('Botanical', 'First in a series of pure colour studies — botanical palette in Procreate.'), tags: ['botanical', 'art-print'], imageUrl: `${GH}/botanical/Colour_Exploration%201.png` },
  { title: 'Colour Exploration II', description: desc('Botanical', 'Second colour study — layered, lush, experimental.'), tags: ['botanical', 'art-print'], imageUrl: `${GH}/botanical/Colour_Exploration%202.png` },
  { title: 'Colour Exploration III', description: desc('Botanical', 'Third colour study from the botanical Procreate series.'), tags: ['botanical', 'art-print'], imageUrl: `${GH}/botanical/Colour_Exploration%203.png` },
  { title: 'Style Exploration', description: desc('Botanical', 'Loose mark-making and colour testing from the studio.'), tags: ['botanical', 'art-print'], imageUrl: `${GH}/botanical/Style_Exploration.png` },
  { title: 'Two Cats', description: desc('Animals', 'Two cats — one frame, twice the personality.'), tags: ['neko', 'cat', 'animals', 'art-print'], imageUrl: `${GH}/animals/Two%20Cats.png` },
  { title: 'Elephant — Green', description: desc('Elephants', 'Graphic elephant illustration in forest green — bold, warm, full of character.'), tags: ['illustration', 'animals', 'art-print'], imageUrl: `${GH}/elephants/Elephant%20%E2%80%94%20Green.png` },
  { title: 'Elephant — Yellow', description: desc('Elephants', 'Elephant in sunny yellow — cheerful illustration series.'), tags: ['illustration', 'animals', 'art-print'], imageUrl: `${GH}/elephants/Elephant%20%E2%80%94%20Yellow.png` },
  { title: 'Elephant — Lilac', description: desc('Elephants', 'A dreamy lilac elephant — graphic illustration series at its most gentle.'), tags: ['illustration', 'animals', 'art-print'], imageUrl: `${GH}/elephants/Elephant%20%E2%80%94%20Lilac.png` },
  { title: 'Elephant — Red', description: desc('Elephants', 'Bold red elephant — the warmest, most assertive piece in the elephant series.'), tags: ['illustration', 'animals', 'art-print'], imageUrl: `${GH}/elephants/Elephant%20%E2%80%94%20Red.png` },
  { title: 'Tourism — I', description: desc('Tourism', 'First in the Tourism series — landscape photography, travel reduced to its essential image.'), tags: ['tourism', 'photography', 'art-print'], imageUrl: `${GH}/tourism/Tourism%20%E2%80%94%20I.jpg` },
  { title: 'Tourism — III', description: desc('Tourism', 'Third Tourism photograph — quiet observation of place and light.'), tags: ['tourism', 'photography', 'art-print'], imageUrl: `${GH}/tourism/Tourism%20%E2%80%94%20III.jpg` },
  { title: 'Tourism — IV', description: desc('Tourism', 'Fourth and final piece in the Tourism series — landscape, light, stillness.'), tags: ['tourism', 'photography', 'art-print'], imageUrl: `${GH}/tourism/Tourism%20%E2%80%94%20IV.jpg` },
  { title: 'Blue Flower on Green Wood', description: desc('Flowers', 'A single blue flower against textured green wood — the ordinary made extraordinary.'), tags: ['floral', 'photography', 'art-print'], imageUrl: `${GH}/flowers/Blue%20Flower%20on%20Green%20Wood.png` },
  { title: 'Dead Flowers', description: desc('Flowers', 'Dried flowers, still beautiful — decay and persistence.'), tags: ['floral', 'photography', 'art-print'], imageUrl: `${GH}/flowers/Dead%20Flowers.png` },
  { title: 'Flowers on Linen', description: desc('Flowers', 'Flowers arranged on raw linen — soft, Nordic, considered.'), tags: ['floral', 'photography', 'art-print'], imageUrl: `${GH}/flowers/Flowers%20on%20Linen.png` },
  { title: 'No Ordinary Stone', description: desc('Flowers', 'A stone that refuses to be unremarkable — form and colour in the overlooked.'), tags: ['floral', 'photography', 'art-print'], imageUrl: `${GH}/flowers/No%20Ordinary%20Stone.png` },
  { title: 'On the Light Table', description: desc('Flowers', 'Objects on a light table — transparency, glow, quiet curiosity.'), tags: ['floral', 'photography', 'art-print'], imageUrl: `${GH}/flowers/On%20the%20Light%20Table.png` },
  { title: 'Purple Flower', description: desc('Flowers', 'A purple flower, close — at the edge of abstraction. Colour first, subject second.'), tags: ['floral', 'photography', 'art-print'], imageUrl: `${GH}/flowers/Purple%20Flower.png` },
  { title: 'Red and Green Moss', description: desc('Flowers', 'Moss in two colours — finding graphic composition in organic texture.'), tags: ['floral', 'photography', 'art-print'], imageUrl: `${GH}/flowers/Red%20and%20Green%20Moss.png` },
  { title: 'Vase on Stool', description: desc('Flowers', 'Still life with a vase on a stool — classic subject, contemporary eye.'), tags: ['floral', 'photography', 'art-print'], imageUrl: `${GH}/flowers/Vase%20on%20Stool.png` },
  { title: 'Taped Objects', description: desc('Various', 'A collection of everyday objects, taped and arranged — playful still life photography.'), tags: ['photography', 'art-print'], imageUrl: `${GH}/various/Taped%20Objects.png` },
  { title: 'Purple Sun', description: desc('Tufting', 'Hand-tufted sun in deep purple — photographed as a fine art print.'), tags: ['tufting', 'art-print'], imageUrl: `${GH}/tufting/Purple%20Sun.jpg` },
  { title: 'Candy I', description: desc('Tufting', 'Candy-coloured tufted textile work — joyful, handmade.'), tags: ['tufting', 'art-print'], imageUrl: `${GH}/tufting/Candy%20I.jpg` },
  { title: 'Orange Sun', description: desc('Tufting', 'A tufted sun in warm orange — handmade textile art.'), tags: ['tufting', 'art-print'], imageUrl: `${GH}/tufting/Orange%20Sun.jpg` },
  { title: 'Rainbow II', description: desc('Tufting', 'Second rainbow tufting — hand-tufted textile arch in full spectrum colour.'), tags: ['tufting', 'art-print'], imageUrl: `${GH}/tufting/Rainbow%20II.png` },
  { title: 'Round Earth', description: desc('Tufting', 'A tufted round earth — circular textile form as fine art photograph.'), tags: ['tufting', 'art-print'], imageUrl: `${GH}/tufting/Round%20Earth.jpg` },
  { title: 'Floral Thing', description: desc('Tufting', 'A tufted floral textile piece — small format, dense texture, handmade.'), tags: ['tufting', 'floral', 'art-print'], imageUrl: `${GH}/tufting/Floral%20Thing.jpg` },
  { title: 'Sitspot Large', description: desc('Tufting', 'Large tufted sitting spot — a functional textile object photographed as art.'), tags: ['tufting', 'art-print'], imageUrl: `${GH}/tufting/Sitspot%20Large.png` },
  { title: 'Elsk', description: desc('Tufting', '"Love" in Danish — tufted text work. One word, handmade, on the wall.'), tags: ['tufting', 'art-print'], imageUrl: `${GH}/tufting/Elsk.png` },
]

// Square artworks — use vertical template (artwork centred with borders)
const SQUARE_ARTWORKS: Omit<Artwork, 'template'>[] = [
  { title: 'Neko Paw — Blue', description: desc('NEKO', 'Cool blue cat paw in bold graphic outline — from the NEKO series.'), tags: ['neko', 'cat', 'art-print'], imageUrl: `${GH}/neko/neko_paw_blue.png` },
  { title: 'Neko Paw — Black & White', description: desc('NEKO', 'The NEKO paw stripped back to pure graphic form — black outline on white.'), tags: ['neko', 'cat', 'art-print'], imageUrl: `${GH}/neko/neko_paw_bw.png` },
  { title: 'Mask — Conformist', description: desc('Masks', 'A mask that wears its role well — a wry take on social performance and conformity.'), tags: ['faces', 'mask', 'art-print'], imageUrl: `${GH}/masks/Mask%20%E2%80%94%20Conformist.png` },
  { title: 'Sea Monsters — Gold', description: desc('Sea Monsters', 'Sea Monsters in warm gold — the same beloved creatures in a richer palette.'), tags: ['sea-monsters', 'art-print'], imageUrl: `${GH}/patterns/Sea%20Monsters%20%E2%80%94%20Gold.png` },
  { title: 'Sea Monsters — Cream', description: desc('Sea Monsters', 'A quieter, cream-toned take on the Sea Monsters series.'), tags: ['sea-monsters', 'art-print'], imageUrl: `${GH}/patterns/Sea%20Monsters%20%E2%80%94%20Cream.png` },
  { title: 'Monsters — Pattern', description: desc('Sea Monsters', 'The full monster pattern — a repeat print. Playful, dense, endlessly surprising.'), tags: ['sea-monsters', 'art-print'], imageUrl: `${GH}/patterns/Monsters%20%E2%80%94%20Pattern.png` },
  { title: 'Kaninskoven', description: desc('Patterns', 'Rabbit forest — a tile pattern of dense woodland populated by small animals.'), tags: ['animals', 'art-print'], imageUrl: `${GH}/patterns/Kaninskoven.png` },
  { title: 'Floating Poppies', description: desc('Botanical', 'Poppies drifting across a pale field — loose, graphic, free.'), tags: ['botanical', 'floral', 'art-print'], imageUrl: `${GH}/botanical/Floating%20Poppies.png` },
  { title: 'Night Poppies', description: desc('Botanical', 'Poppies after dark — deep tones, quiet drama.'), tags: ['botanical', 'floral', 'art-print'], imageUrl: `${GH}/botanical/Night%20Poppies.png` },
  { title: 'Poppy Field', description: desc('Botanical', 'A whole field of poppies — loose, expressive digital interpretation.'), tags: ['botanical', 'floral', 'art-print'], imageUrl: `${GH}/botanical/Poppy%20Field.png` },
  { title: 'Forget-Me-Not', description: desc('Botanical', 'The small blue flower in bold digital stroke — tender subject, graphic treatment.'), tags: ['botanical', 'floral', 'art-print'], imageUrl: `${GH}/botanical/Forget-Me-Not.png` },
  { title: 'Sleeping Cat', description: desc('Animals', 'A cat, entirely at rest — soft digital lines, warm palette.'), tags: ['neko', 'cat', 'animals', 'art-print'], imageUrl: `${GH}/animals/Sleeping%20Cat.png` },
  { title: 'Geometric Garden', description: desc('Botanical', 'Garden forms reduced to geometry — where botanical meets minimal.'), tags: ['botanical', 'art-print'], imageUrl: `${GH}/various/Geometric%20Garden.png` },
]

async function gelatoRequest(path: string, method = 'GET', body?: unknown) {
  const res = await fetch(`https://ecommerce.gelatoapis.com/v1/${path}`, {
    method,
    headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gelato ${method} ${path} → ${res.status}: ${text}`)
  }
  if (method === 'DELETE') return null
  return res.json()
}

async function deleteAllProducts() {
  console.log('Fetching current Gelato products…')
  const data = await gelatoRequest(`stores/${STORE_ID}/products?limit=100`)
  const products = data.products ?? data.data ?? []
  console.log(`  Found ${products.length} products to delete`)

  for (const p of products) {
    process.stdout.write(`  Deleting "${p.title}"… `)
    if (DRY_RUN) { console.log('[DRY RUN]'); continue }
    await gelatoRequest(`stores/${STORE_ID}/products/${p.id}`, 'DELETE')
    console.log('✓')
    await new Promise(r => setTimeout(r, 300))
  }
}

async function createProduct(artwork: Artwork) {
  const variants = artwork.template.variants.map(templateVariantId => ({
    templateVariantId,
    imagePlaceholders: [{ name: artwork.template.placeholder, fileUrl: artwork.imageUrl }],
  }))

  return gelatoRequest(`stores/${STORE_ID}/products:create-from-template`, 'POST', {
    templateId: artwork.template.id,
    title: artwork.title,
    description: artwork.description,
    tags: artwork.tags,
    variants,
  }) as Promise<{ id: string }>
}

async function main() {
  if (!GELATO_API_KEY) {
    console.error('GELATO_API_KEY not set in .env.local')
    process.exit(1)
  }

  const allArtworks: Artwork[] = [
    ...VERTICAL_ARTWORKS.map(a => ({ ...a, template: VERTICAL_TEMPLATE })),
    ...HORIZONTAL_ARTWORKS.map(a => ({ ...a, template: HORIZONTAL_TEMPLATE })),
    ...SQUARE_ARTWORKS.map(a => ({ ...a, template: VERTICAL_TEMPLATE })),
  ]

  console.log(`\n=== DayInDayIn — Multi-size poster seed ===`)
  console.log(`  ${VERTICAL_ARTWORKS.length} vertical (A4/A3/A2)`)
  console.log(`  ${HORIZONTAL_ARTWORKS.length} horizontal (A5/A4/A3)`)
  console.log(`  ${SQUARE_ARTWORKS.length} square → vertical template`)
  console.log(`  Total: ${allArtworks.length} products × 3 sizes = ${allArtworks.length * 3} variants`)
  if (DRY_RUN) console.log(`  MODE: DRY RUN (no changes)`)
  console.log()

  if (!SKIP_DELETE) {
    await deleteAllProducts()
    console.log()
  }

  console.log(`Creating ${allArtworks.length} multi-size products…\n`)

  let created = 0
  let failed = 0

  for (const artwork of allArtworks) {
    process.stdout.write(`▸ ${artwork.title} (${artwork.template === VERTICAL_TEMPLATE ? 'vertical' : 'horizontal'})… `)
    if (DRY_RUN) { console.log('[DRY RUN]'); created++; continue }

    try {
      const product = await createProduct(artwork)
      console.log(`✓ ${product.id}`)
      created++
      await new Promise(r => setTimeout(r, 1200))
    } catch (err) {
      console.error(`FAILED: ${err}`)
      failed++
    }
  }

  console.log(`\n=== Done ===`)
  console.log(`  Created: ${created}`)
  if (failed > 0) console.log(`  Failed: ${failed}`)
  console.log()
  console.log(`Next steps:`)
  console.log(`  1. Wait for Gelato to generate mockup images (minutes to hours)`)
  console.log(`  2. In Gelato dashboard: review products → Publish to Online Store`)
  console.log(`  3. Products will then show A4/A3/A2 size selector on the site`)
}

main().catch(err => { console.error(err); process.exit(1) })
