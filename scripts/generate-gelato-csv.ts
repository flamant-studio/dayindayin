/**
 * generate-gelato-csv.ts
 *
 * Generates gelato_product_export.csv for bulk product import.
 * Images are served from GitHub raw after the DayInDayIn Images folder is committed.
 *
 * Run: npx tsx scripts/generate-gelato-csv.ts
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
  file: [string, string] // [subfolder, filename]
}

const PRODUCTS: Product[] = [
  // ── NEKO ──────────────────────────────────────────────────────────────────
  {
    title: 'Neko Paw — Yellow',
    description: 'Bold graphic print of a cat\'s paw in graphic outline style. Part of Stine Weirsøe Flamant\'s NEKO series — a love letter to cats in pop-art form. Yellow on white.',
    file: ['neko', 'Neko Paw — Yellow.png'],
  },
  {
    title: 'Neko Paw — Yellow Neon',
    description: 'Electric neon yellow cat paw. Part of the NEKO series by Stine Weirsøe Flamant — bold, graphic, instantly recognisable.',
    file: ['neko', 'Neko Paw — Yellow Neon.png'],
  },
  {
    title: 'Neko Paw — Yellow & Blue',
    description: 'Two-colour cat paw print in yellow and blue. NEKO series by Stine Weirsøe Flamant — graphic, playful, contemporary Danish art.',
    file: ['neko', 'Neko Paw — Yellow & Blue.png'],
  },
  {
    title: 'Neko Paw — Pink',
    description: 'Soft pink cat paw in bold graphic outline. NEKO series by Stine Weirsøe Flamant — the same iconic form in a warmer tone.',
    file: ['neko', 'Neko Paw — Pink.png'],
  },
  {
    title: 'Neko Paw — Lilac',
    description: 'Dreamy lilac cat paw — a quieter voice in the NEKO series by Stine Weirsøe Flamant. Bold shape, soft colour.',
    file: ['neko', 'Neko Paw — Lilac.png'],
  },
  {
    title: 'Neko Paw — Yellow II',
    description: 'Second yellow variant of the NEKO paw series. Stine Weirsøe Flamant\'s iconic cat paw in a slightly different composition.',
    file: ['neko', 'Neko Paw — Yellow II.png'],
  },
  {
    title: 'Neko Paw — Blue',
    description: 'Cool blue cat paw print in bold graphic outline. Part of the NEKO series by Stine Weirsøe Flamant.',
    file: ['neko', 'neko_paw_blue.png'],
  },
  {
    title: 'Neko Paw — Red',
    description: 'Fierce red cat paw — a bolder, warmer take on Stine Weirsøe Flamant\'s NEKO paw series.',
    file: ['neko', 'neko_paw_red.png'],
  },
  {
    title: 'Neko Paw — Black & White',
    description: 'The NEKO paw stripped back to pure graphic form — black outline on white. Stine Weirsøe Flamant.',
    file: ['neko', 'neko_paw_bw.png'],
  },
  {
    title: 'Neko — Pink',
    description: 'A pink variant from Stine Weirsøe Flamant\'s NEKO cat series. Graphic, bold, with a pop-art sensibility.',
    file: ['neko', 'neko_pink.png'],
  },
  {
    title: 'Neko Human I',
    description: 'Where human and cat meet — a digital drawing from Stine Weirsøe Flamant\'s exploration of the NEKO identity. Part of the Procreate series.',
    file: ['neko', 'Neko Human I.png'],
  },
  {
    title: 'Neko Human II',
    description: 'Second piece in the Neko Human series. Stine Weirsøe Flamant blends human form and cat imagery in fluid digital line work.',
    file: ['neko', 'Neko Human II.png'],
  },

  // ── SHERO ─────────────────────────────────────────────────────────────────
  {
    title: 'SHERO — Purple',
    description: 'The SHERO print in deep purple — Stine Weirsøe Flamant\'s feminist pop-art icon. Bold lettering and graphic energy on transparent ground.',
    file: ['shero', 'SHERO — Purple.png'],
  },
  {
    title: 'SHERO — Indigo',
    description: 'SHERO in indigo — a cool, dark take on Stine Weirsøe Flamant\'s SHERO series. Feminist art with graphic punch.',
    file: ['shero', 'SHERO — Indigo.png'],
  },
  {
    title: 'SHERO — III',
    description: 'Third print in the SHERO series by Stine Weirsøe Flamant. Layered colour, strong graphic composition, feminist energy.',
    file: ['shero', 'SHERO — III.png'],
  },

  // ── MASKS ─────────────────────────────────────────────────────────────────
  {
    title: 'Mask — I',
    description: 'A hand-drawn mask in expressive line — first in Stine Weirsøe Flamant\'s mask series. Ink on paper, scanned and printed.',
    file: ['masks', 'Mask — I cropped.png'],
  },
  {
    title: 'Mask — II',
    description: 'Second mask in Stine Weirsøe Flamant\'s series of hand-drawn mask studies. Rich texture, bold presence.',
    file: ['masks', 'Mask — II.png'],
  },
  {
    title: 'Mask — III',
    description: 'Third mask study by Stine Weirsøe Flamant. Each mask in the series carries its own character and emotional weight.',
    file: ['masks', 'Mask — III.png'],
  },
  {
    title: 'Mask — Blasé',
    description: 'A Procreate digital mask portrait — detached, knowing, slightly bored. Part of Stine Weirsøe Flamant\'s digital mask series.',
    file: ['masks', 'Mask — Blasé.png'],
  },
  {
    title: 'Mask — Calling',
    description: 'A mask that reaches out — digital Procreate work by Stine Weirsøe Flamant exploring gesture and identity through masked figures.',
    file: ['masks', 'Mask — Calling.png'],
  },
  {
    title: 'Mask — Dream',
    description: 'Softly surreal — a masked figure caught in something between sleep and thought. Digital work by Stine Weirsøe Flamant.',
    file: ['masks', 'Mask — Dream.png'],
  },
  {
    title: 'Mask — Conformist',
    description: 'A mask that wears its role well — Stine Weirsøe Flamant\'s wry take on social performance and conformity. Procreate digital art.',
    file: ['masks', 'Mask — Conformist.png'],
  },
  {
    title: 'Mask Study',
    description: 'A looser, more exploratory mask drawing. Stine Weirsøe Flamant\'s Procreate sketch work at its most raw and immediate.',
    file: ['masks', 'Mask Study.png'],
  },
  {
    title: 'Moon Face',
    description: 'A face caught in lunar light — soft and otherworldly. Digital Procreate work by Stine Weirsøe Flamant.',
    file: ['masks', 'Moon Face.png'],
  },
  {
    title: 'Solar Face',
    description: 'A face turned toward the sun — radiating warmth and bold colour. Procreate digital art by Stine Weirsøe Flamant.',
    file: ['masks', 'Solar Face.png'],
  },
  {
    title: 'Sri Lanka Masks',
    description: 'Inspired by Sri Lankan ceremonial masks, this painting captures their vivid theatricality. Oil on board by Stine Weirsøe Flamant.',
    file: ['masks', 'Sri Lanka Masks.jpg'],
  },

  // ── SEA MONSTERS / PATTERNS ───────────────────────────────────────────────
  {
    title: 'Sea Monsters — Steel',
    description: 'Playful sea creatures in a cool steel palette. Part of Stine Weirsøe Flamant\'s Sea Monsters digital series — strange, charming, deeply original.',
    file: ['patterns', 'Sea Monsters — Steel.png'],
  },
  {
    title: 'Sea Monsters — Blue',
    description: 'Sea Monsters in deep ocean blue — Stine Weirsøe Flamant\'s quirky underwater world in landscape format.',
    file: ['patterns', 'Sea Monsters — Blue.png'],
  },
  {
    title: 'Sea Monsters — Gold',
    description: 'Sea Monsters in warm gold — the same beloved creatures in a richer, more celebratory palette. Stine Weirsøe Flamant.',
    file: ['patterns', 'Sea Monsters — Gold.png'],
  },
  {
    title: 'Sea Monsters — Cream',
    description: 'A quieter, cream-toned take on the Sea Monsters series. Soft and elegant — Stine Weirsøe Flamant.',
    file: ['patterns', 'Sea Monsters — Cream.png'],
  },
  {
    title: 'Monsters — Pattern',
    description: 'The full monster pattern — a repeat print built from Stine Weirsøe Flamant\'s creature drawings. Playful, dense, and endlessly surprising.',
    file: ['patterns', 'Monsters — Pattern.png'],
  },
  {
    title: 'Kaninskoven',
    description: 'Rabbit forest — a tile pattern of dense woodland populated by small animals. Stine Weirsøe Flamant\'s intricate repeat print design.',
    file: ['patterns', 'Kaninskoven.png'],
  },

  // ── BOTANICAL ─────────────────────────────────────────────────────────────
  {
    title: 'Botanical — Noir',
    description: 'Dark botanical composition with a rich, moody palette. Stine Weirsøe Flamant\'s digital exploration of plant forms and layered colour.',
    file: ['botanical', 'Botanical — Noir.png'],
  },
  {
    title: 'Botanical — Blanc',
    description: 'A lighter, airy botanical composition — soft forms and summer colours. Procreate digital work by Stine Weirsøe Flamant.',
    file: ['botanical', 'Botanical — Blanc.png'],
  },
  {
    title: 'Garden — Cream',
    description: 'A garden in cream tones — delicate flowers and loose botanical forms. Part of Stine Weirsøe Flamant\'s Garden series.',
    file: ['botanical', 'Garden — Cream.png'],
  },
  {
    title: 'Garden — Sky',
    description: 'Garden compositions set against an open sky blue. Stine Weirsøe Flamant\'s botanical Procreate series.',
    file: ['botanical', 'Garden — Sky.png'],
  },
  {
    title: 'Garden — Lavender',
    description: 'Botanical forms in soft lavender — the Garden series by Stine Weirsøe Flamant in its most meditative mood.',
    file: ['botanical', 'Garden — Lavender.png'],
  },
  {
    title: 'Garden — Sage',
    description: 'Garden in sage green — earthy, quiet, grounded. Part of Stine Weirsøe Flamant\'s four-season Garden series.',
    file: ['botanical', 'Garden — Sage.png'],
  },
  {
    title: 'Floating Poppies',
    description: 'Poppies drifting across a pale field — loose, graphic, free. Stine Weirsøe Flamant\'s Procreate botanical work.',
    file: ['botanical', 'Floating Poppies.png'],
  },
  {
    title: 'Night Poppies',
    description: 'Poppies after dark — deep tones, quiet drama. Stine Weirsøe Flamant\'s digital botanical work.',
    file: ['botanical', 'Night Poppies.png'],
  },
  {
    title: 'Poppy Field',
    description: 'A whole field of poppies — Stine Weirsøe Flamant\'s loose, expressive digital interpretation of a classic subject.',
    file: ['botanical', 'Poppy Field.png'],
  },
  {
    title: 'Forget-Me-Not',
    description: 'The small blue flower rendered in bold digital stroke — tender subject, graphic treatment. Stine Weirsøe Flamant.',
    file: ['botanical', 'Forget-Me-Not.png'],
  },
  {
    title: 'Colour Exploration I',
    description: 'First in a series of pure colour studies — Stine Weirsøe Flamant working through a botanical palette in Procreate.',
    file: ['botanical', 'Colour_Exploration 1.png'],
  },
  {
    title: 'Colour Exploration II',
    description: 'Second colour study from Stine Weirsøe Flamant\'s botanical Procreate series — layered, lush, experimental.',
    file: ['botanical', 'Colour_Exploration 2.png'],
  },
  {
    title: 'Colour Exploration III',
    description: 'Third colour study from Stine Weirsøe Flamant\'s botanical Procreate series.',
    file: ['botanical', 'Colour_Exploration 3.png'],
  },
  {
    title: 'Style Exploration',
    description: 'An exploratory Procreate work by Stine Weirsøe Flamant — loose mark-making and colour testing from the studio.',
    file: ['botanical', 'Style_Exploration.png'],
  },

  // ── ANIMALS ───────────────────────────────────────────────────────────────
  {
    title: 'Sleeping Cat',
    description: 'A cat, entirely at rest — soft digital lines, warm palette. Stine Weirsøe Flamant\'s tender Procreate portrait of feline stillness.',
    file: ['animals', 'Sleeping Cat.png'],
  },
  {
    title: 'Two Cats',
    description: 'Two cats — one frame, twice the personality. Digital Procreate work by Stine Weirsøe Flamant.',
    file: ['animals', 'Two Cats.png'],
  },
  {
    title: 'Zebra',
    description: 'A zebra study in bold graphic lines — pattern meeting animal form. Stine Weirsøe Flamant.',
    file: ['animals', 'Zebra.jpg'],
  },

  // ── ELEPHANTS ─────────────────────────────────────────────────────────────
  {
    title: 'Elephant — Green',
    description: 'Graphic elephant illustration in forest green — part of Stine Weirsøe Flamant\'s elephant series. Bold, warm, and full of character.',
    file: ['elephants', 'Elephant — Green.png'],
  },
  {
    title: 'Elephant — Yellow',
    description: 'Elephant in sunny yellow — Stine Weirsøe Flamant\'s cheerful illustration series in landscape format.',
    file: ['elephants', 'Elephant — Yellow.png'],
  },
  {
    title: 'Elephant — Lilac',
    description: 'A dreamy lilac elephant — Stine Weirsøe Flamant\'s graphic illustration series at its most gentle.',
    file: ['elephants', 'Elephant — Lilac.png'],
  },
  {
    title: 'Elephant — Red',
    description: 'Bold red elephant — the warmest, most assertive piece in Stine Weirsøe Flamant\'s elephant illustration series.',
    file: ['elephants', 'Elephant — Red.png'],
  },

  // ── TOURISM ───────────────────────────────────────────────────────────────
  {
    title: 'Tourism — I',
    description: 'First in the Tourism series — landscape photography by Stine Weirsøe Flamant, printed on archival paper. Travel reduced to its essential image.',
    file: ['tourism', 'Tourism — I.jpg'],
  },
  {
    title: 'Tourism — II',
    description: 'Second in the Tourism series by Stine Weirsøe Flamant. Landscape photography printed on fine art paper.',
    file: ['tourism', 'Tourism — II.jpg'],
  },
  {
    title: 'Tourism — III',
    description: 'Third Tourism photograph by Stine Weirsøe Flamant — quiet observation of place and light.',
    file: ['tourism', 'Tourism — III.jpg'],
  },
  {
    title: 'Tourism — IV',
    description: 'Fourth and final piece in the Tourism series by Stine Weirsøe Flamant. Landscape, light, stillness.',
    file: ['tourism', 'Tourism — IV.jpg'],
  },

  // ── PHOTOGRAPHY ───────────────────────────────────────────────────────────
  {
    title: 'Blue Flower on Green Wood',
    description: 'A single blue flower against textured green wood — Stine Weirsøe Flamant\'s close attention to the ordinary made extraordinary.',
    file: ['flowers', 'Blue Flower on Green Wood.png'],
  },
  {
    title: 'Dead Flowers',
    description: 'Dried flowers, still beautiful — Stine Weirsøe Flamant\'s photograph of decay and persistence. Quiet still life.',
    file: ['flowers', 'Dead Flowers.png'],
  },
  {
    title: 'Flowers on Linen',
    description: 'Flowers arranged on raw linen — soft, Nordic, considered. Photography by Stine Weirsøe Flamant.',
    file: ['flowers', 'Flowers on Linen.png'],
  },
  {
    title: 'No Ordinary Stone',
    description: 'A stone that refuses to be unremarkable — Stine Weirsøe Flamant\'s photographic eye finds form and colour in the overlooked.',
    file: ['flowers', 'No Ordinary Stone.png'],
  },
  {
    title: 'On the Light Table',
    description: 'Objects on a light table — transparency, glow, and the quiet curiosity of Stine Weirsøe Flamant\'s studio photography.',
    file: ['flowers', 'On the Light Table.png'],
  },
  {
    title: 'Purple Flower',
    description: 'A purple flower, close — Stine Weirsøe Flamant\'s photograph at the edge of abstraction. Colour first, subject second.',
    file: ['flowers', 'Purple Flower.png'],
  },
  {
    title: 'Red and Green Moss',
    description: 'Moss in two colours — Stine Weirsøe Flamant\'s nature photography, finding graphic composition in organic texture.',
    file: ['flowers', 'Red and Green Moss.png'],
  },
  {
    title: 'Vase on Stool',
    description: 'Still life with a vase on a stool — classic subject, contemporary eye. Photography by Stine Weirsøe Flamant.',
    file: ['flowers', 'Vase on Stool.png'],
  },
  {
    title: 'Taped Objects',
    description: 'A collection of everyday objects, taped and arranged — Stine Weirsøe Flamant\'s playful still life photography.',
    file: ['various', 'Taped Objects.png'],
  },

  // ── TUFTING ───────────────────────────────────────────────────────────────
  {
    title: 'Purple Sun',
    description: 'Hand-tufted sun in deep purple — Stine Weirsøe Flamant\'s textile art photographed as a fine art print. Original wall piece.',
    file: ['tufting', 'Purple Sun.jpg'],
  },
  {
    title: 'Candy I',
    description: 'Candy-coloured tufted textile work by Stine Weirsøe Flamant — joyful, handmade, printed as a high-quality art print.',
    file: ['tufting', 'Candy I.jpg'],
  },
  {
    title: 'Orange Sun',
    description: 'A tufted sun in warm orange — Stine Weirsøe Flamant\'s handmade textile art documented as a fine art print.',
    file: ['tufting', 'Orange Sun.jpg'],
  },
  {
    title: 'Rainbow II',
    description: 'Second rainbow tufting — Stine Weirsøe Flamant\'s hand-tufted textile arch in full spectrum colour.',
    file: ['tufting', 'Rainbow II.png'],
  },
  {
    title: 'Round Earth',
    description: 'A tufted round earth — Stine Weirsøe Flamant\'s circular textile form, printed as a fine art photograph of the original work.',
    file: ['tufting', 'Round Earth.jpg'],
  },
  {
    title: 'Floral Thing',
    description: 'A tufted floral textile piece by Stine Weirsøe Flamant — small format, dense texture, handmade.',
    file: ['tufting', 'Floral Thing.jpg'],
  },
  {
    title: 'Sitspot Large',
    description: 'Large tufted sitting spot by Stine Weirsøe Flamant — a functional textile object photographed as art.',
    file: ['tufting', 'Sitspot Large.png'],
  },
  {
    title: 'Elsk',
    description: '"Love" in Danish — tufted text work by Stine Weirsøe Flamant. One word, handmade, on the wall.',
    file: ['tufting', 'Elsk.png'],
  },

  // ── VARIOUS ───────────────────────────────────────────────────────────────
  {
    title: 'Geometric Garden',
    description: 'Garden forms reduced to geometry — Stine Weirsøe Flamant\'s Procreate work where botanical meets minimal.',
    file: ['various', 'Geometric Garden.png'],
  },
  {
    title: 'Sommerby',
    description: 'Inspired by Sommerby — Stine Weirsøe Flamant\'s digital work capturing the atmosphere of a Danish summer place.',
    file: ['various', 'Sommerby.png'],
  },
]

function escapeCSV(s: string) {
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return `"${s}"`
}

const rows = [
  ['Product Title', 'Product Description', 'Product UID', 'Print File URL', 'Should Publish Images?'].map(escapeCSV).join(','),
  ...PRODUCTS.map(p =>
    [
      p.title,
      p.description,
      slug(p.title),
      url(p.file[0], p.file[1]),
      'true',
    ].map(escapeCSV).join(',')
  ),
]

const csvPath = resolve(process.cwd(), 'DayInDayIn Images/gelato_product_export.csv')
writeFileSync(csvPath, rows.join('\n') + '\n', 'utf8')
console.log(`Written ${PRODUCTS.length} products to ${csvPath}`)
