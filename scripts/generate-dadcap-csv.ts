/**
 * generate-dadcap-csv.ts
 *
 * Generates gelato_dadcap_export.csv for dad cap bulk import.
 * Only includes embroidery-safe artworks: simple shapes, bold outlines,
 * max ~6 colors, no gradients, no photography, no complex textures.
 *
 * Run: npx tsx scripts/generate-dadcap-csv.ts
 */

import { writeFileSync } from 'fs'
import { resolve } from 'path'

const BASE_URL = 'https://raw.githubusercontent.com/flamant-studio/dayindayin/main/DayInDayIn%20Images'

function url(subfolder: string, filename: string) {
  return `${BASE_URL}/${encodeURIComponent(subfolder)}/${encodeURIComponent(filename)}`
}

function slug(title: string) {
  return title
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/[éèê]/g, 'e')
    .replace(/[&]/g, 'and')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

interface Product {
  title: string
  description: string
  file: [string, string]
}

const PRODUCTS: Product[] = [
  // ── NEKO PAW — bold outline, single colour, perfect for embroidery ────────
  {
    title: 'Neko Paw Cap — Yellow',
    description: 'The iconic NEKO paw embroidered on a classic dad cap. Stine Weirsøe Flamant\'s cat paw print in bold yellow — wear your love for cats.',
    file: ['neko', 'Neko Paw — Yellow.png'],
  },
  {
    title: 'Neko Paw Cap — Yellow Neon',
    description: 'Neon yellow NEKO paw embroidered on a dad cap. Bold, graphic, unmistakable — Stine Weirsøe Flamant\'s NEKO series on your head.',
    file: ['neko', 'Neko Paw — Yellow Neon.png'],
  },
  {
    title: 'Neko Paw Cap — Pink',
    description: 'Pink NEKO paw embroidered on a classic dad cap. Stine Weirsøe Flamant\'s cat paw series — soft colour, strong graphic.',
    file: ['neko', 'Neko Paw — Pink.png'],
  },
  {
    title: 'Neko Paw Cap — Lilac',
    description: 'Lilac NEKO paw on a dad cap — the quietest, most elegant piece in Stine Weirsøe Flamant\'s cat series.',
    file: ['neko', 'Neko Paw — Lilac.png'],
  },
  {
    title: 'Neko Paw Cap — Blue',
    description: 'Cool blue NEKO paw embroidered on a classic dad cap. Stine Weirsøe Flamant\'s graphic cat series in its most laid-back colourway.',
    file: ['neko', 'neko_paw_blue.png'],
  },
  {
    title: 'Neko Paw Cap — Red',
    description: 'Bold red NEKO paw on a dad cap. Stine Weirsøe Flamant\'s iconic cat graphic in its most assertive colour.',
    file: ['neko', 'neko_paw_red.png'],
  },
  {
    title: 'Neko Paw Cap — Black & White',
    description: 'The NEKO paw in pure black and white — embroidered on a classic dad cap. Stine Weirsøe Flamant\'s cat graphic at its most graphic.',
    file: ['neko', 'neko_paw_bw.png'],
  },

  // ── SHERO — bold text/graphic, works as embroidery ────────────────────────
  {
    title: 'SHERO Cap — Purple',
    description: 'SHERO in deep purple — Stine Weirsøe Flamant\'s feminist pop-art icon embroidered on a classic dad cap.',
    file: ['shero', 'SHERO — Purple.png'],
  },
  {
    title: 'SHERO Cap — Indigo',
    description: 'SHERO in indigo on a dad cap — Stine Weirsøe Flamant\'s bold feminist graphic in a cool, dark colourway.',
    file: ['shero', 'SHERO — Indigo.png'],
  },

  // ── ELEPHANTS — simple outline illustration, good for embroidery ──────────
  {
    title: 'Elephant Cap — Green',
    description: 'Stine Weirsøe Flamant\'s elephant illustration in forest green — embroidered on a classic dad cap. Bold, warm, characterful.',
    file: ['elephants', 'Elephant — Green.png'],
  },
  {
    title: 'Elephant Cap — Yellow',
    description: 'Sunny yellow elephant on a dad cap — Stine Weirsøe Flamant\'s graphic illustration series, cheerful and bold.',
    file: ['elephants', 'Elephant — Yellow.png'],
  },
  {
    title: 'Elephant Cap — Lilac',
    description: 'Dreamy lilac elephant embroidered on a classic dad cap. Stine Weirsøe Flamant\'s illustration series at its gentlest.',
    file: ['elephants', 'Elephant — Lilac.png'],
  },
  {
    title: 'Elephant Cap — Red',
    description: 'Bold red elephant on a dad cap — the warmest, most assertive piece in Stine Weirsøe Flamant\'s elephant series.',
    file: ['elephants', 'Elephant — Red.png'],
  },

  // ── ZEBRA — bold graphic stripes, clean enough for embroidery ─────────────
  {
    title: 'Zebra Cap',
    description: 'Stine Weirsøe Flamant\'s zebra graphic embroidered on a classic dad cap. Bold pattern, clean lines — a statement piece.',
    file: ['animals', 'Zebra.jpg'],
  },
]

function escapeCSV(s: string) {
  return `"${s.replace(/"/g, '""')}"`
}

const rows = [
  ['Product Title', 'Product Description', 'Product UID', 'Print File URL', 'Should Publish Images?'].map(escapeCSV).join(','),
  ...PRODUCTS.map(p =>
    [
      p.title,
      p.description,
      slug(p.title),
      url(p.file[0], p.file[1]),
      'Yes',
    ].map(escapeCSV).join(',')
  ),
]

const csvPath = resolve(process.cwd(), 'DayInDayIn Images/gelato_dadcap_export.csv')
writeFileSync(csvPath, rows.join('\n') + '\n', 'utf8')
console.log(`Written ${PRODUCTS.length} products to ${csvPath}`)
