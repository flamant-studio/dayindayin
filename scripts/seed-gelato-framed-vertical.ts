/**
 * seed-gelato-framed-vertical.ts
 *
 * Creates framed vertical art prints using the premium wooden framed poster template.
 * Workflow: create-from-template (no variants) → Gelato auto-populates all 12 variants
 *           (A4/A3/A2/A1 × white/wood/black) → PATCH each variant with the artwork.
 *
 * Run: npx tsx scripts/seed-gelato-framed-vertical.ts
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
const TEMPLATE_ID    = '392687cd-4959-4186-bc3a-fb135d1e0c1d'

const DROPBOX_NEKO   = '/Users/flamant-mini/Dropbox/_KUNST/Studio/Shop of Words'
const DROPBOX_PRINT  = '/Users/flamant-mini/Dropbox/_KUNST/Studio/print ready'
const DROPBOX_ART    = '/Users/flamant-mini/Dropbox/_KUNST/Studio/print ready/Art photo'

const BLOB_BASE = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

function framedDesc(title: string, orientation = 'portrait') {
  return `<p>Fine art giclée print of Stine Weirsøe Flamant's <em>${title}</em>, mounted in a premium wooden frame with museum-quality matte archival paper.</p>
<ul>
<li>Available in A4, A3, A2, and A1</li>
<li>Frame options: white, natural wood, black</li>
<li>250gsm off-white archival matte paper</li>
<li>Plexiglass front — ready to hang</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 5–10 business days</li>
</ul>`
}

// Artworks already in Blob from previous seeds — reuse their URLs
const ARTWORKS = [
  {
    blobUrl: `${BLOB_BASE}/gelato/neko/nekopaw_yellow_outline.png`,
    title: 'Neko Paw — Yellow (Framed)',
    tags: ['neko', 'cat', 'yellow', 'art-print', 'framed'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/neko/nekopaw_yellow_neon.png`,
    title: 'Neko Paw — Yellow Neon (Framed)',
    tags: ['neko', 'cat', 'yellow', 'neon', 'art-print', 'framed'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/neko/nekopaw_yellow_blue.png`,
    title: 'Neko Paw — Yellow & Blue (Framed)',
    tags: ['neko', 'cat', 'yellow', 'blue', 'art-print', 'framed'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/neko/nekopaw_pink_outline.png`,
    title: 'Neko Paw — Pink (Framed)',
    tags: ['neko', 'cat', 'pink', 'art-print', 'framed'],
  },
  {
    blobUrl: `${BLOB_BASE}/gelato/neko/nekopaw_lilac_outline.png`,
    title: 'Neko Paw — Lilac (Framed)',
    tags: ['neko', 'cat', 'lilac', 'purple', 'art-print', 'framed'],
  },
  {
    localFile: `${DROPBOX_ART}/Sheroshine_1swf2023-1.jpeg`,
    blobPath: 'gelato/framed-vertical/sheroshine.jpg',
    title: 'Sheroshine (Framed)',
    tags: ['shero', 'feminist', 'art-print', 'framed'],
  },
  {
    localFile: `${DROPBOX_ART}/Strongfloral-1.jpeg`,
    blobPath: 'gelato/framed-vertical/strong-floral.jpg',
    title: 'Strong Floral (Framed)',
    tags: ['floral', 'botanical', 'art-print', 'framed'],
  },
]

async function uploadFromFile(localFile: string, blobPath: string): Promise<string> {
  if (!existsSync(localFile)) throw new Error(`Not found: ${localFile}`)
  let uploadPath = localFile
  let tmpPath: string | null = null
  if (/\.(tiff?|png)$/i.test(localFile)) {
    tmpPath = resolve(tmpdir(), `did-fv-${Date.now()}.jpg`)
    execSync(`sips -s format jpeg -s formatOptions 92 "${localFile}" --out "${tmpPath}"`, { stdio: 'pipe' })
    uploadPath = tmpPath
  }
  const buf = readFileSync(uploadPath)
  const blob = await put(blobPath, buf, { access: 'public', contentType: 'image/jpeg', allowOverwrite: true })
  if (tmpPath) unlinkSync(tmpPath)
  return blob.url
}

async function createProduct(title: string, description: string, tags: string[]): Promise<string> {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: TEMPLATE_ID, title, description, tags }),
    }
  )
  const json = await res.json() as any
  if (!res.ok) throw new Error(`Create failed: ${JSON.stringify(json)}`)
  return json.id as string
}

async function waitForVariants(productId: string, expected = 12, maxWait = 120000): Promise<any[]> {
  const start = Date.now()
  while (Date.now() - start < maxWait) {
    const res = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products/${productId}`,
      { headers: { 'X-API-KEY': GELATO_API_KEY } }
    )
    const json = await res.json() as any
    const variants = json.variants ?? []
    if (variants.length >= expected) return variants
    await new Promise(r => setTimeout(r, 5000))
    process.stdout.write('.')
  }
  throw new Error(`Timed out waiting for variants on ${productId}`)
}

async function patchVariant(productId: string, variantId: string, fileUrl: string): Promise<void> {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products/${productId}/variants/${variantId}`,
    {
      method: 'PATCH',
      headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileUrl }),
    }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Patch failed: ${JSON.stringify(err)}`)
  }
}

async function main() {
  console.log(`Seeding ${ARTWORKS.length} framed vertical prints\n`)

  for (const artwork of ARTWORKS) {
    const title = artwork.title
    console.log(`▸ ${title}`)

    try {
      let artUrl: string
      if ((artwork as any).blobUrl) {
        artUrl = (artwork as any).blobUrl
        console.log(`  using existing blob`)
      } else {
        process.stdout.write(`  uploading artwork... `)
        artUrl = await uploadFromFile((artwork as any).localFile, (artwork as any).blobPath)
        console.log(`✓`)
      }

      process.stdout.write(`  creating product... `)
      const productId = await createProduct(title, framedDesc(title), artwork.tags)
      console.log(`✓ ${productId}`)

      process.stdout.write(`  waiting for variants`)
      const variants = await waitForVariants(productId, 12)
      console.log(` ✓ (${variants.length} variants)`)

      process.stdout.write(`  patching artwork on all variants... `)
      for (const v of variants) {
        await patchVariant(productId, v.id, artUrl)
        await new Promise(r => setTimeout(r, 200))
      }
      console.log(`✓`)

    } catch (err) {
      console.error(`\n  FAILED: ${err}`)
    }
    console.log()
  }

  console.log('Done. Products are auto-published — check Shopify for framed print listings.')
}

main().catch(err => { console.error(err); process.exit(1) })
