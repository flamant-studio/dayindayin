/**
 * seed-gelato-procreate-batch.ts
 *
 * Seeds all Procreate artworks as Gelato products.
 * Covers portrait, landscape, and square formats in one run.
 *
 * Run:     npx tsx scripts/seed-gelato-procreate-batch.ts
 * Dry run: DRY_RUN=1 npx tsx scripts/seed-gelato-procreate-batch.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, unlinkSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!
const STORE_ID       = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const DRY_RUN        = process.env.DRY_RUN === '1'

const BATCH_DIR = resolve(process.cwd(), 'assets/Procreate-batch')

// ── Templates ────────────────────────────────────────────────────────────────

const PORTRAIT_TEMPLATE_ID    = '6005fae3-64a6-4f62-8328-93d2ce6bae58'
const PORTRAIT_PLACEHOLDER    = 'nekopaw_yellow_neon.png'
const PORTRAIT_VARIANTS       = [
  'b3d4dda4-ac21-4419-9616-46624fb8090c', // A4
  '2d58a7c4-c307-4c5b-882a-acc019bf4a6a', // A3
  '542aaaaf-3112-42f4-9661-736f460b89d7', // A2
]

const LANDSCAPE_TEMPLATE_ID   = '18600284-2b9d-433a-af02-d728dc81e83b'
const LANDSCAPE_PLACEHOLDER   = 'Tourism_1.png'
const LANDSCAPE_VARIANTS      = [
  '12c93580-97d9-4815-8565-9febbe8cf35d', // A3 landscape
  '64b85284-3389-4855-8ef5-a8b1c6109616', // 15×20 cm
  '4c6df0a8-18b9-49df-a44f-3d9979aa9acb', // 21×29.7 cm landscape
]

const SQUARE_TEMPLATE_ID      = '323d6ff5-9795-40d6-8d11-d9a3a2710d87'
const SQUARE_PLACEHOLDER      = 'Sheroshine_1swf2023-1.jpeg'
const SQUARE_WATERMARK_PH     = 'infinity watermark dayin.png'
const SQUARE_TEXT_PH          = 'Text 5'
const SQUARE_VARIANTS         = [
  'c19e1e08-dfd4-4abe-9203-80cb64b08727', // 30×30 cm
  '9c96bb29-451f-451d-9abb-c9794f0be757', // 40×40 cm
  'd91a6aae-a737-4fb7-99a2-476cab17135d', // 70×70 cm
]

const WATERMARK_FILE = resolve(
  process.env.HOME!,
  'Dropbox/_KUNST/Studio/Brand/Logo exploration/Dayin_dayin_boldinfinitysymbol.png'
)

// ── Artwork definitions ───────────────────────────────────────────────────────

type Template = 'portrait' | 'landscape' | 'square'

interface Artwork {
  file:     string        // filename in BATCH_DIR
  blob:     string        // Vercel Blob key
  title:    string
  tags:     string[]
  template: Template
  medium:   string        // for description copy
}

const BASE_TAGS = ['art-print', 'stine-weirsoe-flamant', 'procreate']

function t(tags: string[]): string[] {
  return [...BASE_TAGS, ...tags]
}

const ARTWORKS: Artwork[] = [
  // ── Portrait ──────────────────────────────────────────────────────────────
  {
    file: 'Untitled_Artwork 1.png',
    blob: 'gelato/procreate/solar-face.jpg',
    title: 'Solar Face',
    tags: t(['painting', 'faces']),
    template: 'portrait',
    medium: 'Procreate digital painting',
  },
  {
    file: 'Untitled_Artwork 5.png',
    blob: 'gelato/procreate/the-fist.jpg',
    title: 'The Fist',
    tags: t(['painting', 'shero']),
    template: 'portrait',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Untitled_Artwork 12.png',
    blob: 'gelato/procreate/sea-monsters-steel.jpg',
    title: 'Sea Monsters — Steel',
    tags: t(['painting', 'sea-monsters']),
    template: 'portrait',
    medium: 'Procreate digital pattern',
  },
  {
    file: 'Sommerby_Elementer.png',
    blob: 'gelato/procreate/sommerby-elements.jpg',
    title: 'Sommerby Elements',
    tags: t(['painting', 'sommerby']),
    template: 'portrait',
    medium: 'Procreate digital painting',
  },
  {
    file: 'Maske_Mod_Blaserthed.png',
    blob: 'gelato/procreate/mask-blase.jpg',
    title: 'Mask — Blasé',
    tags: t(['painting', 'faces']),
    template: 'portrait',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Neko_Pussy_Human.png',
    blob: 'gelato/procreate/neko-human-i.jpg',
    title: 'Neko Human I',
    tags: t(['painting', 'neko']),
    template: 'portrait',
    medium: 'Procreate digital painting',
  },
  {
    file: 'Neko_Pussy_Human 2.png',
    blob: 'gelato/procreate/neko-human-ii.jpg',
    title: 'Neko Human II',
    tags: t(['painting', 'neko']),
    template: 'portrait',
    medium: 'Procreate digital painting',
  },
  {
    file: 'Colour_Exploration.png',
    blob: 'gelato/procreate/botanical-noir.jpg',
    title: 'Botanical — Noir',
    tags: t(['painting', 'botanical']),
    template: 'portrait',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Master_Composition2sommertæt.png',
    blob: 'gelato/procreate/botanical-blanc.jpg',
    title: 'Botanical — Blanc',
    tags: t(['painting', 'botanical']),
    template: 'portrait',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Maske_Mod_Opkald.png',
    blob: 'gelato/procreate/mask-calling.jpg',
    title: 'Mask — Calling',
    tags: t(['painting', 'faces']),
    template: 'portrait',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Untitled_Artwork 3.png',
    blob: 'gelato/procreate/moon-face.jpg',
    title: 'Moon Face',
    tags: t(['painting', 'faces']),
    template: 'portrait',
    medium: 'Procreate digital painting',
  },
  {
    file: 'Maske_Mod_Binære_Forventninger.png',
    blob: 'gelato/procreate/mask-dream.jpg',
    title: 'Mask — Dream',
    tags: t(['painting', 'faces']),
    template: 'portrait',
    medium: 'Procreate digital painting',
  },
  // Extracted garden colorways (portrait, 1712×2480 each)
  {
    file: 'Garden_Cream.png',
    blob: 'gelato/procreate/garden-cream.jpg',
    title: 'Garden — Cream',
    tags: t(['painting', 'botanical']),
    template: 'portrait',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Garden_Sky.png',
    blob: 'gelato/procreate/garden-sky.jpg',
    title: 'Garden — Sky',
    tags: t(['painting', 'botanical']),
    template: 'portrait',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Garden_Lavender.png',
    blob: 'gelato/procreate/garden-lavender.jpg',
    title: 'Garden — Lavender',
    tags: t(['painting', 'botanical']),
    template: 'portrait',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Garden_Sage.png',
    blob: 'gelato/procreate/garden-sage.jpg',
    title: 'Garden — Sage',
    tags: t(['painting', 'botanical']),
    template: 'portrait',
    medium: 'Procreate digital illustration',
  },
  // Untitled_Artwork 4 — mask study (landscape)
  {
    file: 'Untitled_Artwork 4.png',
    blob: 'gelato/procreate/mask-study.jpg',
    title: 'Mask Study',
    tags: t(['painting', 'faces']),
    template: 'landscape',
    medium: 'Procreate digital illustration',
  },

  // ── Landscape ─────────────────────────────────────────────────────────────
  {
    file: 'Sheroprint_transparent.png',
    blob: 'gelato/procreate/shero-purple.jpg',
    title: 'SHERO — Purple',
    tags: t(['painting', 'shero']),
    template: 'landscape',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Sheroprint_transparent 1.png',
    blob: 'gelato/procreate/shero-indigo.jpg',
    title: 'SHERO — Indigo',
    tags: t(['painting', 'shero']),
    template: 'landscape',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Sheroprint_transparent 2.png',
    blob: 'gelato/procreate/shero-3.jpg',
    title: 'SHERO — III',
    tags: t(['painting', 'shero']),
    template: 'landscape',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'IMG_1944.png',
    blob: 'gelato/procreate/two-cats.jpg',
    title: 'Two Cats',
    tags: t(['painting', 'neko']),
    template: 'landscape',
    medium: 'Procreate digital painting',
  },
  {
    file: 'Untitled_Artwork 10.png',
    blob: 'gelato/procreate/sea-monsters-blue.jpg',
    title: 'Sea Monsters — Blue',
    tags: t(['painting', 'sea-monsters']),
    template: 'landscape',
    medium: 'Procreate digital pattern',
  },

  // ── Square ────────────────────────────────────────────────────────────────
  {
    file: 'Untitled_Artwork 2.png',
    blob: 'gelato/procreate/sleeping-cat.jpg',
    title: 'Sleeping Cat',
    tags: t(['painting', 'neko']),
    template: 'square',
    medium: 'Procreate digital painting',
  },
  {
    file: 'Untitled_Artwork 6.png',
    blob: 'gelato/procreate/floating-poppies.jpg',
    title: 'Floating Poppies',
    tags: t(['painting', 'floral']),
    template: 'square',
    medium: 'Procreate digital painting',
  },
  {
    file: 'Untitled_Artwork 7.png',
    blob: 'gelato/procreate/night-poppies.jpg',
    title: 'Night Poppies',
    tags: t(['painting', 'floral']),
    template: 'square',
    medium: 'Procreate digital painting',
  },
  {
    file: 'Untitled_Artwork 8.png',
    blob: 'gelato/procreate/poppy-field.jpg',
    title: 'Poppy Field',
    tags: t(['painting', 'floral']),
    template: 'square',
    medium: 'Procreate digital pattern',
  },
  {
    file: 'Untitled_Artwork 9.png',
    blob: 'gelato/procreate/forget-me-not.jpg',
    title: 'Forget-Me-Not',
    tags: t(['painting']),
    template: 'square',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Untitled_Artwork 11.png',
    blob: 'gelato/procreate/sea-monsters-gold.jpg',
    title: 'Sea Monsters — Gold',
    tags: t(['painting', 'sea-monsters']),
    template: 'square',
    medium: 'Procreate digital pattern',
  },
  {
    file: 'Untitled_Artwork 13.png',
    blob: 'gelato/procreate/sea-monsters-cream.jpg',
    title: 'Sea Monsters — Cream',
    tags: t(['painting', 'sea-monsters']),
    template: 'square',
    medium: 'Procreate digital pattern',
  },
  {
    file: 'Geometric_garden.png',
    blob: 'gelato/procreate/geometric-garden.jpg',
    title: 'Geometric Garden',
    tags: t(['painting']),
    template: 'square',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Maske_Mod_Medløberi.png',
    blob: 'gelato/procreate/mask-conformist.jpg',
    title: 'Mask — Conformist',
    tags: t(['painting', 'faces']),
    template: 'square',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Neko_pote.png',
    blob: 'gelato/procreate/fist-blue.jpg',
    title: 'The Fist — Blue',
    tags: t(['painting', 'shero']),
    template: 'square',
    medium: 'Procreate digital illustration',
  },
  {
    file: 'Neko_pote 1.png',
    blob: 'gelato/procreate/fist-ink.jpg',
    title: 'The Fist — Ink',
    tags: t(['painting', 'shero']),
    template: 'square',
    medium: 'Procreate digital illustration',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function description(title: string, medium: string): string {
  return `<p>Original digital artwork by Copenhagen artist Stine Weirsøe Flamant. ${medium}.</p>
<ul>
<li>Fine art giclée print on 200gsm FSC-certified enhanced matte paper</li>
<li>Matte finish, no glare</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`
}

function toJpeg(src: string, dest: string) {
  execSync(`sips -s format jpeg -s formatOptions 95 "${src}" --out "${dest}"`, { stdio: 'pipe' })
}

async function uploadFile(localPath: string, blobKey: string): Promise<string> {
  if (!existsSync(localPath)) throw new Error(`Not found: ${localPath}`)
  const needsConvert = /\.(png|tiff?)$/i.test(localPath)
  let uploadPath = localPath
  let tmpPath: string | null = null

  if (needsConvert) {
    tmpPath = resolve(tmpdir(), `did-pb-${Date.now()}.jpg`)
    process.stdout.write('→JPEG ')
    toJpeg(localPath, tmpPath)
    uploadPath = tmpPath
  }

  const buffer = readFileSync(uploadPath)
  const mb = (buffer.length / 1024 / 1024).toFixed(1)
  process.stdout.write(`${mb}MB `)

  const blob = await put(blobKey, buffer, {
    access: 'public',
    contentType: 'image/jpeg',
    allowOverwrite: true,
  })

  if (tmpPath) unlinkSync(tmpPath)
  return blob.url
}

function buildVariants(artwork: Artwork, artworkUrl: string, watermarkUrl: string) {
  const { template } = artwork
  const [templateId, variants, placeholder] =
    template === 'portrait'  ? [PORTRAIT_TEMPLATE_ID,  PORTRAIT_VARIANTS,  PORTRAIT_PLACEHOLDER]  :
    template === 'landscape' ? [LANDSCAPE_TEMPLATE_ID, LANDSCAPE_VARIANTS, LANDSCAPE_PLACEHOLDER] :
                               [SQUARE_TEMPLATE_ID,    SQUARE_VARIANTS,    SQUARE_PLACEHOLDER]

  return {
    templateId,
    variantDefs: variants.map(templateVariantId => {
      const imagePlaceholders: { name: string; fileUrl: string }[] = [
        { name: placeholder, fileUrl: artworkUrl },
      ]
      if (template === 'square') {
        imagePlaceholders.push({ name: SQUARE_WATERMARK_PH, fileUrl: watermarkUrl })
      }
      const textPlaceholders = template === 'square'
        ? [{ name: SQUARE_TEXT_PH, text: 'Stine Weirsøe Flamant' }]
        : []
      return { templateVariantId, imagePlaceholders, textPlaceholders }
    }),
  }
}

async function createProduct(
  artwork: Artwork,
  artworkUrl: string,
  watermarkUrl: string
): Promise<string> {
  const { templateId, variantDefs } = buildVariants(artwork, artworkUrl, watermarkUrl)

  if (DRY_RUN) {
    console.log(`  [DRY RUN] ${artwork.title} (${artwork.template}) → ${artwork.blob}`)
    return 'dry-run'
  }

  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId,
        title: artwork.title,
        description: description(artwork.title, artwork.medium),
        tags: artwork.tags,
        variants: variantDefs,
      }),
    }
  )
  const json = await res.json() as { id?: string; errors?: unknown }
  if (!res.ok) throw new Error(`Gelato ${res.status}: ${JSON.stringify(json)}`)
  return json.id!
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!GELATO_API_KEY) { console.error('GELATO_API_KEY not set'); process.exit(1) }

  const portraits  = ARTWORKS.filter(a => a.template === 'portrait')
  const landscapes = ARTWORKS.filter(a => a.template === 'landscape')
  const squares    = ARTWORKS.filter(a => a.template === 'square')

  console.log(`Procreate batch: ${ARTWORKS.length} artworks`)
  console.log(`  Portrait:  ${portraits.length}`)
  console.log(`  Landscape: ${landscapes.length}`)
  console.log(`  Square:    ${squares.length}`)
  if (DRY_RUN) console.log('  DRY RUN — nothing will be created\n')
  console.log()

  // Upload watermark once (needed for square template)
  let watermarkUrl = ''
  if (!DRY_RUN && squares.length > 0) {
    process.stdout.write('Uploading watermark... ')
    watermarkUrl = await uploadFile(WATERMARK_FILE, 'gelato/procreate/watermark-infinity.jpg')
    console.log('✓\n')
  }

  let created = 0, failed = 0

  for (const artwork of ARTWORKS) {
    const localPath = resolve(BATCH_DIR, artwork.file)
    process.stdout.write(`▸ [${artwork.template}] ${artwork.title} ... `)

    try {
      const artworkUrl = DRY_RUN ? 'dry-run' : await uploadFile(localPath, artwork.blob)
      const id = await createProduct(artwork, artworkUrl, watermarkUrl)
      console.log(`✓ ${String(id).slice(0, 8)}`)
      created++
      if (!DRY_RUN) await new Promise(r => setTimeout(r, 1500))
    } catch (err) {
      console.error(`FAILED: ${err}`)
      failed++
    }
  }

  console.log(`\nDone. Created: ${created}  Failed: ${failed}`)
  if (!DRY_RUN) console.log('Products are DRAFT — check mockups in Gelato, then publish via Shopify.')
}

main().catch(err => { console.error(err); process.exit(1) })
