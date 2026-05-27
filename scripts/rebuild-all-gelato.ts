/**
 * rebuild-all-gelato.ts
 *
 * Full rebuild of all Gelato products.
 * All templates use 'background' (primary) / 'background2' (secondary) placeholder names.
 * Postcards SKIPPED — template layer name unknown.
 *
 * Strategy: variant-level imagePlaceholders for ALL products.
 * Probe each template → get variant IDs → create with variants[].imagePlaceholders.
 *
 * Run: npx tsx scripts/rebuild-all-gelato.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const BLOB  = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

// ─── Templates ────────────────────────────────────────────────────────────────
const T = {
  portrait:         '6005fae3-64a6-4f62-8328-93d2ce6bae58',
  landscape:        '18600284-2b9d-433a-af02-d728dc81e83b',
  square:           '323d6ff5-9795-40d6-8d11-d9a3a2710d87',
  framedPortrait:   '392687cd-4959-4186-bc3a-fb135d1e0c1d',
  framedLandscape:  '992be2b6-4005-4abb-884c-9d4fa2f4affb',
  poster:           '1339c7ec-201f-4188-a50b-c535cb414957',
  mug:              '0e9a0a04-1016-4216-9a40-4f42a00b8dca',
  tote:             'a28d9355-d78d-4d13-afec-8f120d989280',
  tankTop:          '2edd0df8-f9b1-4037-a7a2-456cd768739d',
  tshirt:           '461771cb-a59e-4d1b-b767-18bab73d6f6c',
  sheroCard:        'e6ba01e0-1fec-4f4b-807a-f5f396aa93e9',
}

// All products use variant-level imagePlaceholders — no PATCH needed

// ─── Descriptions ─────────────────────────────────────────────────────────────
function printDesc(title: string, medium: string): string {
  return `<p>Fine art print — <em>${title}</em>. ${medium} by Stine Weirsøe Flamant.</p>
<ul>
<li>200gsm FSC-certified enhanced uncoated paper</li>
<li>12-colour giclée process, matte finish</li>
<li>Available in A4, A3, and A2</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`
}

function squareDesc(title: string, body: string): string {
  return `<p>${body}</p>
<ul>
<li>Fine art giclée print on 200gsm FSC-certified enhanced uncoated paper</li>
<li>Matte finish, no glare</li>
<li>Square format</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`
}

function framedPortraitDesc(bare: string): string {
  return `<p>Fine art giclée print of Stine Weirsøe Flamant's <em>${bare}</em>, mounted in a premium wooden frame with museum-quality matte archival paper.</p>
<ul>
<li>Available in A4, A3, and A2</li>
<li>Frame options: white, natural wood, black</li>
<li>250gsm archival matte paper</li>
<li>Plexiglass front — ready to hang</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 5–10 business days</li>
</ul>`
}

function framedLandscapeDesc(series: string): string {
  return `<p>Fine art giclée print from Stine Weirsøe Flamant's <em>${series}</em> series, mounted in a premium wooden frame with museum-quality matte archival paper.</p>
<ul>
<li>Available in A5, A4, and A3 landscape</li>
<li>Frame options: white, natural wood, black</li>
<li>250gsm archival matte paper</li>
<li>Plexiglass front — ready to hang</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 5–10 business days</li>
</ul>`
}

function posterDesc(title: string): string {
  return `<p>Premium semi-glossy paper poster — <em>${title}</em> by Stine Weirsøe Flamant.</p>
<ul>
<li>200gsm semi-glossy FSC-certified paper</li>
<li>Available in A3, A2, and A1</li>
<li>Vivid color reproduction, fade-resistant</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`
}

const MUG_DESC = `<p>White porcelain mug featuring original Neko Paw artwork by Stine Weirsøe Flamant.</p>
<ul>
<li>330ml capacity</li>
<li>Ceramic White or Ceramic Black</li>
<li>Dishwasher safe</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 5–10 business days</li>
</ul>`

const TOTE_DESC = `<p>Premium tote bag featuring original Shop of Words artwork by Stine Weirsøe Flamant. Printed using DTG (direct-to-garment) on a natural cotton tote.</p>
<ul>
<li>Natural cotton, heavy duty</li>
<li>DTG print — vivid, wash-resistant</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`

const SHERO_CARD_DESC = `<p>Pack of 10 A6 greeting cards featuring original SHERO artwork by Stine Weirsøe Flamant. Printed on premium coated silk paper with a vertical fold.</p>
<ul>
<li>Pack of 10 identical cards</li>
<li>A6 (10.5 × 14.8 cm), horizontal format</li>
<li>Coated silk paper, square edges</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`

// ─── Product Definitions ───────────────────────────────────────────────────────

interface Product {
  templateId: string
  title: string
  description: string
  tags: string[]
  bg: string
  bg2?: string
}

const PRODUCTS: Product[] = [

  // ── Portrait prints (non-framed) ──────────────────────────────────────────
  { templateId: T.portrait, title: 'Neko Paw Print — Yellow',
    description: printDesc('Neko Paw', 'Digital illustration'),
    tags: ['neko', 'cat', 'yellow', 'art-print'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_outline.png` },
  { templateId: T.portrait, title: 'Neko Paw Print — Yellow Neon',
    description: printDesc('Neko Paw', 'Digital illustration'),
    tags: ['neko', 'cat', 'yellow', 'neon', 'art-print'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_neon.png` },
  { templateId: T.portrait, title: 'Neko Paw Print — Yellow & Blue',
    description: printDesc('Neko Paw', 'Digital illustration'),
    tags: ['neko', 'cat', 'yellow', 'blue', 'art-print'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_blue.png` },
  { templateId: T.portrait, title: 'Neko Paw Print — Pink',
    description: printDesc('Neko Paw', 'Digital illustration'),
    tags: ['neko', 'cat', 'pink', 'art-print'],
    bg: `${BLOB}/gelato/neko/nekopaw_pink_outline.png` },
  { templateId: T.portrait, title: 'Neko Paw Print — Lilac',
    description: printDesc('Neko Paw', 'Digital illustration'),
    tags: ['neko', 'cat', 'lilac', 'purple', 'art-print'],
    bg: `${BLOB}/gelato/neko/nekopaw_lilac_outline.png` },
  { templateId: T.portrait, title: 'Neko Paw Print — Yellow II',
    description: printDesc('Neko Paw', 'Digital illustration'),
    tags: ['neko', 'cat', 'yellow', 'art-print'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_outline1.png` },

  { templateId: T.portrait, title: 'Sheroshine — I',
    description: printDesc('Sheroshine', 'Analogue-process photograph'),
    tags: ['shero', 'art-photography', 'analogue', 'art-print'],
    bg: `${BLOB}/gelato/artphoto/sheroshine-1.jpg` },

  { templateId: T.portrait, title: 'Mask — I',
    description: printDesc('Mask', 'Mixed media, original scan'),
    tags: ['mask', 'original', 'scan', 'art-print'],
    bg: `${BLOB}/gelato/masks/mask-1.jpg` },
  { templateId: T.portrait, title: 'Mask — II',
    description: printDesc('Mask', 'Mixed media, original scan'),
    tags: ['mask', 'original', 'scan', 'art-print'],
    bg: `${BLOB}/gelato/masks/mask-2.jpg` },
  { templateId: T.portrait, title: 'Mask — III',
    description: printDesc('Mask', 'Mixed media, original'),
    tags: ['mask', 'original', 'art-print'],
    bg: `${BLOB}/gelato/masks/mask-3.jpg` },
  { templateId: T.portrait, title: 'Zebra',
    description: printDesc('Zebra', 'Drawing and illustration'),
    tags: ['zebra', 'drawing', 'illustration', 'art-print'],
    bg: `${BLOB}/gelato/masks/ulrikke-zebra.jpg` },

  // Procreate — portrait
  { templateId: T.portrait, title: 'Solar Face',
    description: printDesc('Solar Face', 'Procreate digital painting'),
    tags: ['art-print', 'procreate', 'painting', 'faces'],
    bg: `${BLOB}/gelato/procreate/solar-face.jpg` },
  { templateId: T.portrait, title: 'The Fist',
    description: printDesc('The Fist', 'Procreate digital illustration'),
    tags: ['art-print', 'procreate', 'painting', 'shero'],
    bg: `${BLOB}/gelato/procreate/the-fist.jpg` },
  { templateId: T.portrait, title: 'Sea Monsters — Steel',
    description: printDesc('Sea Monsters — Steel', 'Procreate digital pattern'),
    tags: ['art-print', 'procreate', 'painting', 'sea-monsters'],
    bg: `${BLOB}/gelato/procreate/sea-monsters-steel.jpg` },
  { templateId: T.portrait, title: 'Sommerby Elements',
    description: printDesc('Sommerby Elements', 'Procreate digital painting'),
    tags: ['art-print', 'procreate', 'painting', 'sommerby'],
    bg: `${BLOB}/gelato/procreate/sommerby-elements.jpg` },
  { templateId: T.portrait, title: 'Mask — Blasé',
    description: printDesc('Mask — Blasé', 'Procreate digital illustration'),
    tags: ['art-print', 'procreate', 'painting', 'faces'],
    bg: `${BLOB}/gelato/procreate/mask-blase.jpg` },
  { templateId: T.portrait, title: 'Neko Human I',
    description: printDesc('Neko Human I', 'Procreate digital painting'),
    tags: ['art-print', 'procreate', 'painting', 'neko'],
    bg: `${BLOB}/gelato/procreate/neko-human-i.jpg` },
  { templateId: T.portrait, title: 'Neko Human II',
    description: printDesc('Neko Human II', 'Procreate digital painting'),
    tags: ['art-print', 'procreate', 'painting', 'neko'],
    bg: `${BLOB}/gelato/procreate/neko-human-ii.jpg` },
  { templateId: T.portrait, title: 'Botanical — Noir',
    description: printDesc('Botanical — Noir', 'Procreate digital illustration'),
    tags: ['art-print', 'procreate', 'painting', 'botanical'],
    bg: `${BLOB}/gelato/procreate/botanical-noir.jpg` },
  { templateId: T.portrait, title: 'Botanical — Blanc',
    description: printDesc('Botanical — Blanc', 'Procreate digital illustration'),
    tags: ['art-print', 'procreate', 'painting', 'botanical'],
    bg: `${BLOB}/gelato/procreate/botanical-blanc.jpg` },
  { templateId: T.portrait, title: 'Mask — Calling',
    description: printDesc('Mask — Calling', 'Procreate digital illustration'),
    tags: ['art-print', 'procreate', 'painting', 'faces'],
    bg: `${BLOB}/gelato/procreate/mask-calling.jpg` },
  { templateId: T.portrait, title: 'Moon Face',
    description: printDesc('Moon Face', 'Procreate digital painting'),
    tags: ['art-print', 'procreate', 'painting', 'faces'],
    bg: `${BLOB}/gelato/procreate/moon-face.jpg` },
  { templateId: T.portrait, title: 'Mask — Dream',
    description: printDesc('Mask — Dream', 'Procreate digital illustration'),
    tags: ['art-print', 'procreate', 'painting', 'faces'],
    bg: `${BLOB}/gelato/procreate/mask-dream.jpg` },
  { templateId: T.portrait, title: 'Garden — Cream',
    description: printDesc('Garden — Cream', 'Procreate digital illustration'),
    tags: ['art-print', 'procreate', 'painting', 'botanical'],
    bg: `${BLOB}/gelato/procreate/garden-cream.jpg` },
  { templateId: T.portrait, title: 'Garden — Sky',
    description: printDesc('Garden — Sky', 'Procreate digital illustration'),
    tags: ['art-print', 'procreate', 'painting', 'botanical'],
    bg: `${BLOB}/gelato/procreate/garden-sky.jpg` },
  { templateId: T.portrait, title: 'Garden — Lavender',
    description: printDesc('Garden — Lavender', 'Procreate digital illustration'),
    tags: ['art-print', 'procreate', 'painting', 'botanical'],
    bg: `${BLOB}/gelato/procreate/garden-lavender.jpg` },
  { templateId: T.portrait, title: 'Garden — Sage',
    description: printDesc('Garden — Sage', 'Procreate digital illustration'),
    tags: ['art-print', 'procreate', 'painting', 'botanical'],
    bg: `${BLOB}/gelato/procreate/garden-sage.jpg` },

  // Works — tufting (portrait)
  ...([
    { slug: 'purple-sun',        title: 'Purple Sun' },
    { slug: 'candy-I',           title: 'Candy I' },
    { slug: 'orange-sun',        title: 'Orange Sun' },
    { slug: 'rainbow-I',         title: 'Rainbow I' },
    { slug: 'birds',             title: 'Birds' },
    { slug: 'du-und',            title: 'Du und' },
    { slug: 'hej',               title: 'Hej' },
    { slug: 'liebes-panopticon', title: 'Liebes Panopticon' },
    { slug: 'floral-thing',      title: 'Floral Thing' },
    { slug: 'round-earth',       title: 'Round Earth' },
    { slug: 'fleur-de-lys',      title: 'Fleur de Lys' },
    { slug: 'jellyfish',         title: 'Jellyfish' },
    { slug: 'rainbow-II',        title: 'Rainbow II' },
    { slug: 'tufted-mask',       title: 'Tufted Mask' },
    { slug: 'sitspot-large',     title: 'Sitspot Large' },
    { slug: 'universe-hole',     title: 'Universe with a Hole' },
    { slug: 'green-flower',      title: 'Green Flower' },
    { slug: 'pink-rug',          title: 'Pink Rug' },
    { slug: 'bedroom-rug',       title: 'Bedroom Rug' },
  ] as const).map(({ slug, title }) => ({
    templateId: T.portrait,
    title,
    description: printDesc(title, 'Hand-tufted wool on canvas'),
    tags: ['art-print', 'tufting', 'stine-weirsoe-flamant'],
    bg: `${BLOB}/works/tufting/${slug}.jpg`,
  })),

  // Works — embroidery (portrait)
  ...([
    { slug: 'fuck-alting',         title: 'Fuck Alting' },
    { slug: 'gud-har-meldt-afbud', title: 'Gud Har Meldt Afbud' },
    { slug: 'elsk',                title: 'Elsk' },
    { slug: 'be-a-dragon',         title: 'Be a Dragon' },
    { slug: 'theres-nothing-here', title: "There's Nothing Here" },
    { slug: 'mariann',             title: 'Mariann' },
    { slug: 'doodles',             title: 'Doodles' },
    { slug: 'collage-bw',          title: 'Collage (Black & White)' },
    { slug: 'apple-scraps',        title: 'Apple Scraps' },
    { slug: 'perfidt-perfekt',     title: 'Perfidt Perfekt' },
    { slug: 'ingenting',           title: 'Ingenting' },
  ] as const).map(({ slug, title }) => ({
    templateId: T.portrait,
    title,
    description: printDesc(title, 'Embroidery on fabric'),
    tags: ['art-print', 'embroidery', 'stine-weirsoe-flamant'],
    bg: `${BLOB}/works/embroidery/${slug}.jpg`,
  })),

  // ── Landscape prints (non-framed) ─────────────────────────────────────────
  { templateId: T.landscape, title: 'Tourism — I',
    description: printDesc('Tourism — I', 'Fine art photography'),
    tags: ['tourism', 'photography', 'landscape', 'art-print'],
    bg: `${BLOB}/gelato/tourism/tourism-1.jpg` },
  { templateId: T.landscape, title: 'Tourism — II',
    description: printDesc('Tourism — II', 'Fine art photography'),
    tags: ['tourism', 'photography', 'landscape', 'art-print'],
    bg: `${BLOB}/gelato/tourism/tourism-2.jpg` },
  { templateId: T.landscape, title: 'Tourism — III',
    description: printDesc('Tourism — III', 'Fine art photography'),
    tags: ['tourism', 'photography', 'landscape', 'art-print'],
    bg: `${BLOB}/gelato/tourism/tourism-3.jpg` },
  { templateId: T.landscape, title: 'Tourism — IV',
    description: printDesc('Tourism — IV', 'Fine art photography'),
    tags: ['tourism', 'photography', 'landscape', 'art-print'],
    bg: `${BLOB}/gelato/tourism/tourism-4.jpg` },
  { templateId: T.landscape, title: 'Elephant — Green',
    description: printDesc('Elephant — Green', 'Digital illustration'),
    tags: ['elephant', 'illustration', 'landscape', 'art-print'],
    bg: `${BLOB}/gelato/elephants/elephant-green.jpg` },
  { templateId: T.landscape, title: 'Elephant — Yellow',
    description: printDesc('Elephant — Yellow', 'Digital illustration'),
    tags: ['elephant', 'illustration', 'landscape', 'art-print'],
    bg: `${BLOB}/gelato/elephants/elephant-yellow.jpg` },
  { templateId: T.landscape, title: 'Elephant — Lilac',
    description: printDesc('Elephant — Lilac', 'Digital illustration'),
    tags: ['elephant', 'illustration', 'landscape', 'art-print'],
    bg: `${BLOB}/gelato/elephants/elephant-lilac.jpg` },
  { templateId: T.landscape, title: 'Elephant — Red',
    description: printDesc('Elephant — Red', 'Digital illustration'),
    tags: ['elephant', 'illustration', 'landscape', 'art-print'],
    bg: `${BLOB}/gelato/elephants/elephant-red.jpg` },

  // Procreate — landscape
  { templateId: T.landscape, title: 'Mask Study',
    description: printDesc('Mask Study', 'Procreate digital illustration'),
    tags: ['art-print', 'procreate', 'painting', 'faces'],
    bg: `${BLOB}/gelato/procreate/mask-study.jpg` },
  { templateId: T.landscape, title: 'SHERO — Purple',
    description: printDesc('SHERO — Purple', 'Procreate digital painting'),
    tags: ['art-print', 'procreate', 'painting', 'shero'],
    bg: `${BLOB}/gelato/procreate/shero-purple.jpg` },
  { templateId: T.landscape, title: 'SHERO — Indigo',
    description: printDesc('SHERO — Indigo', 'Procreate digital painting'),
    tags: ['art-print', 'procreate', 'painting', 'shero'],
    bg: `${BLOB}/gelato/procreate/shero-indigo.jpg` },
  { templateId: T.landscape, title: 'SHERO — III',
    description: printDesc('SHERO — III', 'Procreate digital painting'),
    tags: ['art-print', 'procreate', 'painting', 'shero'],
    bg: `${BLOB}/gelato/procreate/shero-3.jpg` },
  { templateId: T.landscape, title: 'Two Cats',
    description: printDesc('Two Cats', 'Procreate digital painting'),
    tags: ['art-print', 'procreate', 'painting', 'neko'],
    bg: `${BLOB}/gelato/procreate/two-cats.jpg` },
  { templateId: T.landscape, title: 'Sea Monsters — Blue',
    description: printDesc('Sea Monsters — Blue', 'Procreate digital pattern'),
    tags: ['art-print', 'procreate', 'painting', 'sea-monsters'],
    bg: `${BLOB}/gelato/procreate/sea-monsters-blue.jpg` },

  // Works — paintings (landscape)
  ...([
    { slug: 'universe-1',          title: 'Universe I' },
    { slug: 'universe-2',          title: 'Universe II' },
    { slug: 'universe-3',          title: 'Universe III' },
    { slug: 'blue-branch',         title: 'Blue Branch' },
    { slug: 'person-walking',      title: 'Person Walking' },
    { slug: 'green-on-blue',       title: 'Green on Blue' },
    { slug: 'colour-study',        title: 'Colour Study' },
    { slug: 'universe-collection', title: 'Universe Collection' },
    { slug: 'colour-study-blue',   title: 'Colour Study Blue' },
    { slug: 'sri-lanka-masks',     title: 'Sri Lanka Masks' },
  ] as const).map(({ slug, title }) => ({
    templateId: T.landscape,
    title,
    description: printDesc(title, 'Mixed media on canvas'),
    tags: ['art-print', 'painting', 'stine-weirsoe-flamant'],
    bg: `${BLOB}/works/painting/${slug}.jpg`,
  })),

  // Works — photography (landscape)
  ...([
    { slug: 'view-from-the-studio',      title: 'View from the Studio' },
    { slug: 'blue-flower-on-green-wood', title: 'Blue Flower on Green Wood' },
    { slug: 'red-and-green-moss',        title: 'Red and Green Moss' },
    { slug: 'no-ordinary-stone',         title: 'No Ordinary Stone' },
    { slug: 'taped-objects',             title: 'Taped Objects' },
    { slug: 'flowers-on-linen',          title: 'Flowers on Linen' },
    { slug: 'polaroids',                 title: 'Polaroids' },
    { slug: 'on-the-light-table',        title: 'On the Light Table' },
    { slug: 'dead-flowers',              title: 'Dead Flowers' },
    { slug: 'vase-on-stool',             title: 'Vase on Stool' },
    { slug: 'purple-flower',             title: 'Purple Flower' },
  ] as const).map(({ slug, title }) => ({
    templateId: T.landscape,
    title,
    description: printDesc(title, 'Fine art photograph'),
    tags: ['art-print', 'photography', 'stine-weirsoe-flamant'],
    bg: `${BLOB}/works/photography/${slug}.jpg`,
  })),

  // ── Square prints (bg=artwork, bg2=watermark) ──────────────────────────────
  { templateId: T.square, title: 'Sheroshine — I',
    description: squareDesc('Sheroshine — I', 'A striking analogue-process photograph by Stine Weirsøe Flamant.'),
    tags: ['sheroshine', 'photography', 'art-print', 'square'],
    bg:  `${BLOB}/gelato/square/sheroshine.jpg`,
    bg2: `${BLOB}/gelato/square/watermark-infinity.jpg` },
  { templateId: T.square, title: 'Kaninskoven',
    description: squareDesc('Kaninskoven', 'Rabbit forest — a dense, graphic pattern by Stine Weirsøe Flamant.'),
    tags: ['kaninskoven', 'pattern', 'art-print', 'square'],
    bg:  `${BLOB}/gelato/square/kaninskoven.jpg`,
    bg2: `${BLOB}/gelato/square/watermark-infinity.jpg` },
  { templateId: T.square, title: 'Monsters — Pattern',
    description: squareDesc('Monsters — Pattern', 'Bold monster pattern by Stine Weirsøe Flamant.'),
    tags: ['monsters', 'pattern', 'art-print', 'square'],
    bg:  `${BLOB}/gelato/square/monsters-pattern.jpg`,
    bg2: `${BLOB}/gelato/square/watermark-infinity.jpg` },
  { templateId: T.square, title: 'Moondancer',
    description: squareDesc('Moondancer', 'Square fine art photograph by Stine Weirsøe Flamant.'),
    tags: ['moondancer', 'photography', 'art-print', 'square'],
    bg:  `${BLOB}/gelato/square/moondancer.jpg`,
    bg2: `${BLOB}/gelato/square/watermark-infinity.jpg` },

  // Procreate — square (also use watermark)
  ...([
    { slug: 'sleeping-cat',      title: 'Sleeping Cat',        tags: ['neko'] },
    { slug: 'floating-poppies',  title: 'Floating Poppies',    tags: ['floral'] },
    { slug: 'night-poppies',     title: 'Night Poppies',       tags: ['floral'] },
    { slug: 'poppy-field',       title: 'Poppy Field',         tags: ['floral'] },
    { slug: 'forget-me-not',     title: 'Forget-Me-Not',       tags: [] },
    { slug: 'sea-monsters-gold', title: 'Sea Monsters — Gold', tags: ['sea-monsters'] },
    { slug: 'sea-monsters-cream',title: 'Sea Monsters — Cream',tags: ['sea-monsters'] },
    { slug: 'geometric-garden',  title: 'Geometric Garden',    tags: [] },
    { slug: 'mask-conformist',   title: 'Mask — Conformist',   tags: ['faces'] },
    { slug: 'fist-blue',         title: 'The Fist — Blue',     tags: ['shero'] },
    { slug: 'fist-ink',          title: 'The Fist — Ink',      tags: ['shero'] },
  ] as const).map(({ slug, title, tags }) => ({
    templateId: T.square,
    title,
    description: printDesc(title, 'Procreate digital painting'),
    tags: ['art-print', 'procreate', 'painting', 'square', ...tags],
    bg:  `${BLOB}/gelato/procreate/${slug}.jpg`,
    bg2: `${BLOB}/gelato/square/watermark-infinity.jpg`,
  })),

  // ── Framed vertical prints ─────────────────────────────────────────────────
  { templateId: T.framedPortrait, title: 'Neko Paw — Yellow (Framed)',
    description: framedPortraitDesc('Neko Paw — Yellow'),
    tags: ['neko', 'cat', 'yellow', 'art-print', 'framed'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_outline.png` },
  { templateId: T.framedPortrait, title: 'Neko Paw — Yellow Neon (Framed)',
    description: framedPortraitDesc('Neko Paw — Yellow Neon'),
    tags: ['neko', 'cat', 'yellow', 'neon', 'art-print', 'framed'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_neon.png` },
  { templateId: T.framedPortrait, title: 'Neko Paw — Yellow & Blue (Framed)',
    description: framedPortraitDesc('Neko Paw — Yellow & Blue'),
    tags: ['neko', 'cat', 'yellow', 'blue', 'art-print', 'framed'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_blue.png` },
  { templateId: T.framedPortrait, title: 'Neko Paw — Pink (Framed)',
    description: framedPortraitDesc('Neko Paw — Pink'),
    tags: ['neko', 'cat', 'pink', 'art-print', 'framed'],
    bg: `${BLOB}/gelato/neko/nekopaw_pink_outline.png` },
  { templateId: T.framedPortrait, title: 'Neko Paw — Lilac (Framed)',
    description: framedPortraitDesc('Neko Paw — Lilac'),
    tags: ['neko', 'cat', 'lilac', 'purple', 'art-print', 'framed'],
    bg: `${BLOB}/gelato/neko/nekopaw_lilac_outline.png` },
  { templateId: T.framedPortrait, title: 'Sheroshine (Framed)',
    description: framedPortraitDesc('Sheroshine'),
    tags: ['shero', 'feminist', 'art-print', 'framed'],
    bg: `${BLOB}/gelato/framed-vertical/sheroshine.jpg` },
  { templateId: T.framedPortrait, title: 'Strong Floral (Framed)',
    description: framedPortraitDesc('Strong Floral'),
    tags: ['floral', 'botanical', 'art-print', 'framed'],
    bg: `${BLOB}/gelato/framed-vertical/strong-floral.jpg` },

  // ── Framed horizontal prints ───────────────────────────────────────────────
  { templateId: T.framedLandscape, title: 'Tourism I — Framed',
    description: framedLandscapeDesc('Tourism'),
    tags: ['tourism', 'photography', 'art-print', 'framed', 'landscape'],
    bg: `${BLOB}/gelato/tourism/tourism-1.jpg` },
  { templateId: T.framedLandscape, title: 'Tourism II — Framed',
    description: framedLandscapeDesc('Tourism'),
    tags: ['tourism', 'photography', 'art-print', 'framed', 'landscape'],
    bg: `${BLOB}/gelato/tourism/tourism-2.jpg` },
  { templateId: T.framedLandscape, title: 'Tourism III — Framed',
    description: framedLandscapeDesc('Tourism'),
    tags: ['tourism', 'photography', 'art-print', 'framed', 'landscape'],
    bg: `${BLOB}/gelato/tourism/tourism-3.jpg` },
  { templateId: T.framedLandscape, title: 'Tourism IV — Framed',
    description: framedLandscapeDesc('Tourism'),
    tags: ['tourism', 'photography', 'art-print', 'framed', 'landscape'],
    bg: `${BLOB}/gelato/tourism/tourism-4.jpg` },
  { templateId: T.framedLandscape, title: 'Elephant Green — Framed',
    description: framedLandscapeDesc('Elephant'),
    tags: ['elephant', 'illustration', 'art-print', 'framed', 'kids'],
    bg: `${BLOB}/gelato/elephants/elephant-green.jpg` },
  { templateId: T.framedLandscape, title: 'Elephant Yellow — Framed',
    description: framedLandscapeDesc('Elephant'),
    tags: ['elephant', 'illustration', 'art-print', 'framed', 'kids'],
    bg: `${BLOB}/gelato/elephants/elephant-yellow.jpg` },
  { templateId: T.framedLandscape, title: 'Elephant Lilac — Framed',
    description: framedLandscapeDesc('Elephant'),
    tags: ['elephant', 'illustration', 'art-print', 'framed', 'kids'],
    bg: `${BLOB}/gelato/elephants/elephant-lilac.jpg` },
  { templateId: T.framedLandscape, title: 'Elephant Red — Framed',
    description: framedLandscapeDesc('Elephant'),
    tags: ['elephant', 'illustration', 'art-print', 'framed', 'kids'],
    bg: `${BLOB}/gelato/elephants/elephant-red.jpg` },

  // ── Posters ────────────────────────────────────────────────────────────────
  { templateId: T.poster, title: 'Neko Paw — Yellow (Poster)',
    description: posterDesc('Neko Paw — Yellow'),
    tags: ['neko', 'cat', 'yellow', 'poster'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_outline.png` },
  { templateId: T.poster, title: 'Neko Paw — Yellow Neon (Poster)',
    description: posterDesc('Neko Paw — Yellow Neon'),
    tags: ['neko', 'cat', 'yellow', 'neon', 'poster'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_neon.png` },
  { templateId: T.poster, title: 'Neko Paw — Yellow & Blue (Poster)',
    description: posterDesc('Neko Paw — Yellow & Blue'),
    tags: ['neko', 'cat', 'yellow', 'blue', 'poster'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_blue.png` },
  { templateId: T.poster, title: 'Neko Paw — Pink (Poster)',
    description: posterDesc('Neko Paw — Pink'),
    tags: ['neko', 'cat', 'pink', 'poster'],
    bg: `${BLOB}/gelato/neko/nekopaw_pink_outline.png` },
  { templateId: T.poster, title: 'Neko Paw — Lilac (Poster)',
    description: posterDesc('Neko Paw — Lilac'),
    tags: ['neko', 'cat', 'lilac', 'purple', 'poster'],
    bg: `${BLOB}/gelato/neko/nekopaw_lilac_outline.png` },
  { templateId: T.poster, title: 'Sheroshine (Poster)',
    description: posterDesc('Sheroshine'),
    tags: ['shero', 'feminist', 'poster'],
    bg: `${BLOB}/gelato/framed-vertical/sheroshine.jpg` },
  { templateId: T.poster, title: 'Strong Floral (Poster)',
    description: posterDesc('Strong Floral'),
    tags: ['floral', 'botanical', 'poster'],
    bg: `${BLOB}/gelato/framed-vertical/strong-floral.jpg` },

  // ── Mugs ──────────────────────────────────────────────────────────────────
  { templateId: T.mug, title: 'Neko Paw Mug — Yellow',
    description: MUG_DESC, tags: ['neko', 'cat', 'mug', 'yellow'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_outline.png` },
  { templateId: T.mug, title: 'Neko Paw Mug — Pink',
    description: MUG_DESC, tags: ['neko', 'cat', 'mug', 'pink'],
    bg: `${BLOB}/gelato/neko/nekopaw_pink_outline.png` },
  { templateId: T.mug, title: 'Neko Paw Mug — Lilac',
    description: MUG_DESC, tags: ['neko', 'cat', 'mug', 'lilac'],
    bg: `${BLOB}/gelato/neko/nekopaw_lilac_outline.png` },
  { templateId: T.mug, title: 'Neko Paw Mug — Yellow & Blue',
    description: MUG_DESC, tags: ['neko', 'cat', 'mug', 'yellow', 'blue'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_blue.png` },

  // ── Tote bags (bg=front, bg2=back — same image both sides) ────────────────
  { templateId: T.tote, title: 'Shop of Words — Beauty (Tote)',
    description: TOTE_DESC, tags: ['shop-of-words', 'tote', 'beauty', 'text-art'],
    bg:  `${BLOB}/gelato/totes/sow-beauty.jpg`,
    bg2: `${BLOB}/gelato/totes/sow-beauty.jpg` },
  { templateId: T.tote, title: 'Shop of Words — BYOB (Tote)',
    description: TOTE_DESC, tags: ['shop-of-words', 'tote', 'byob', 'text-art'],
    bg:  `${BLOB}/gelato/totes/sow-byob.jpg`,
    bg2: `${BLOB}/gelato/totes/sow-byob.jpg` },
  { templateId: T.tote, title: 'Shop of Words — My Sake (Tote)',
    description: TOTE_DESC, tags: ['shop-of-words', 'tote', 'my-sake', 'text-art'],
    bg:  `${BLOB}/gelato/totes/sow-mysake.jpg`,
    bg2: `${BLOB}/gelato/totes/sow-mysake.jpg` },
  { templateId: T.tote, title: 'Shop of Words — Obligatory Beauty (Tote)',
    description: TOTE_DESC, tags: ['shop-of-words', 'tote', 'obligatory-beauty', 'text-art'],
    bg:  `${BLOB}/gelato/totes/sow-obligatorybeauty.jpg`,
    bg2: `${BLOB}/gelato/totes/sow-obligatorybeauty.jpg` },
  { templateId: T.tote, title: 'Shop of Words — Real Eyes (Tote)',
    description: TOTE_DESC, tags: ['shop-of-words', 'tote', 'real-eyes', 'text-art'],
    bg:  `${BLOB}/gelato/totes/sow-realeyes.jpg`,
    bg2: `${BLOB}/gelato/totes/sow-realeyes.jpg` },

  // ── Apparel ────────────────────────────────────────────────────────────────
  { templateId: T.tankTop, title: 'Neko Paw — Tank Top',
    description: `<p>Men's white tank top featuring the Neko Paw icon by Stine Weirsøe Flamant, printed using DTG.</p><ul><li>100% jersey cotton, XS–2XL</li><li>Printed and shipped on demand by Gelato</li></ul>`,
    tags: ['neko', 'cat', 'apparel', 'tank-top', 'yellow'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_outline.png` },
  { templateId: T.tshirt, title: 'Neko Paw — Embroidered T-Shirt',
    description: `<p>Men's white t-shirt with the Neko Paw icon embroidered on the left chest by Stine Weirsøe Flamant.</p><ul><li>100% jersey cotton, S–3XL</li><li>Printed and shipped on demand by Gelato</li></ul>`,
    tags: ['neko', 'cat', 'apparel', 'tshirt', 'embroidery', 'yellow'],
    bg: `${BLOB}/gelato/neko/nekopaw_yellow_outline.png` },

  // ── Shero greeting card (bg=front, bg2=inside) ────────────────────────────
  { templateId: T.sheroCard, title: 'SHERO — Greeting Cards (Pack of 10)',
    description: SHERO_CARD_DESC,
    tags: ['shero', 'greeting-card', 'card', 'pack'],
    bg:  `${BLOB}/gelato/cards/shero-patch-front.jpg`,
    bg2: `${BLOB}/gelato/cards/shero-scan-inside.jpg` },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function delay(ms: number) { return new Promise(r => setTimeout(r, ms)) }

// ─── Template probing ─────────────────────────────────────────────────────────

async function probeAllTemplates(): Promise<Map<string, string[]>> {
  const allTemplateIds = [...new Set(PRODUCTS.map(p => p.templateId))]
  const map = new Map<string, string[]>()

  for (const id of allTemplateIds) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/templates/${id}`, {
      headers: { 'X-API-KEY': KEY }
    })
    const j = await r.json() as any
    const variants: string[] = (j.variants ?? []).map((v: any) => v.id as string)
    map.set(id, variants)
    process.stdout.write('.')
    await delay(200)
  }
  console.log()
  return map
}

// ─── Step 1: List and delete ──────────────────────────────────────────────────

async function listAllProducts(): Promise<{ id: string; title: string }[]> {
  const all: { id: string; title: string }[] = []
  let offset = 0
  while (true) {
    const r = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=100&offset=${offset}`,
      { headers: { 'X-API-KEY': KEY } }
    )
    const j = await r.json() as any
    const products: any[] = j.products ?? []
    if (!products.length) break
    all.push(...products.map((p: any) => ({ id: p.id, title: p.title })))
    offset += 100
    if (offset > 5000) break
  }
  return all
}

async function deleteProduct(id: string): Promise<boolean> {
  const r = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${id}`,
    { method: 'DELETE', headers: { 'X-API-KEY': KEY } }
  )
  return r.ok || r.status === 404
}

// ─── Step 2: Create with variant-level imagePlaceholders (all products) ──────

async function createProductWithImages(p: Product, templateVariantIds: string[]): Promise<string> {
  const variants = templateVariantIds.map(templateVariantId => {
    const imagePlaceholders: { name: string; fileUrl: string }[] = [
      { name: 'background', fileUrl: p.bg },
    ]
    if (p.bg2) imagePlaceholders.push({ name: 'background2', fileUrl: p.bg2 })
    return { templateVariantId, imagePlaceholders }
  })

  const r = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: p.templateId,
        title: p.title,
        description: p.description,
        tags: p.tags,
        variants,
      }),
    }
  )
  const json = await r.json() as any
  if (!r.ok) throw new Error(`${r.status}: ${JSON.stringify(json).slice(0, 300)}`)
  return json.id as string
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════')
  console.log(' Rebuild all Gelato products — PATCH + variant API ')
  console.log('═══════════════════════════════════════════════════\n')

  // Step 0: Probe all templates for variant IDs
  console.log('Step 0 — Probing all templates for variant IDs...')
  const templateVariants = await probeAllTemplates()
  console.log(`  ${templateVariants.size} templates probed\n`)
  for (const [id, vids] of templateVariants) {
    const label = Object.entries(T).find(([, v]) => v === id)?.[0] ?? id.slice(0, 8)
    console.log(`  ${label}: ${vids.length} variants`)
  }
  console.log()

  // Step 1: List and delete
  console.log('Step 1 — Listing all current Gelato products...')
  const existing = await listAllProducts()
  const toDelete = existing.filter(p => !/postcard/i.test(p.title))
  const postcards = existing.filter(p => /postcard/i.test(p.title))
  console.log(`  Found ${existing.length} total (${toDelete.length} to delete, ${postcards.length} postcards kept)\n`)

  console.log('Step 2 — Deleting non-postcard products...')
  let deleted = 0, deleteFailed = 0
  for (const p of toDelete) {
    process.stdout.write(`  DELETE "${p.title.slice(0, 40)}"... `)
    const ok = await deleteProduct(p.id)
    if (ok) { deleted++; process.stdout.write('✓\n') }
    else    { deleteFailed++; process.stdout.write('✗\n') }
    await delay(250)
  }
  console.log(`  ${deleted} deleted, ${deleteFailed} failed\n`)

  // Step 3: Recreate — variant-level imagePlaceholders for all
  console.log(`Step 3 — Creating ${PRODUCTS.length} products...\n`)
  let created = 0, errored = 0
  const errors: string[] = []

  for (const p of PRODUCTS) {
    process.stdout.write(`  ▸ ${p.title.slice(0, 50)}... `)
    try {
      const variantIds = templateVariants.get(p.templateId)
      if (!variantIds?.length) throw new Error(`No variant IDs for template ${p.templateId}`)
      const id = await createProductWithImages(p, variantIds)
      console.log(`✓ ${id}`)
      created++
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.log(`✗ ${msg.slice(0, 100)}`)
      errors.push(`${p.title}: ${msg}`)
      errored++
    }
    await delay(300)
  }

  console.log('\n═══════════════════════════════════════════════════')
  console.log(`  Done. Created: ${created}  Errors: ${errored}`)
  if (errors.length) {
    console.log('\nErrors:')
    errors.forEach(e => console.log('  •', e))
  }
  console.log('\nNext: run publish-to-online-store.ts to republish to Shopify.')
  console.log('Gelato generates mockup images asynchronously (allow 30 min–2 hrs).')
  console.log('This time artwork is set at create time — no PATCH needed.')
  console.log('═══════════════════════════════════════════════════')
}

main().catch(err => { console.error(err); process.exit(1) })
