/**
 * rebuild-gelato-new-products.ts
 *
 * Deletes all 29 products created with the broken PATCH workflow
 * and recreates them correctly using imagePlaceholders: [{name: "ImagePlaceholder1", fileUrl}]
 * which triggers proper Gelato mockup generation + Shopify sync.
 *
 * Run: npx tsx scripts/rebuild-gelato-new-products.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, existsSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const BLOB  = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'
const DROPBOX_ART = '/Users/flamant-mini/Dropbox/_KUNST/Studio/print ready/Art photo'

// ── Products to delete (from broken seed runs) ─────────────

const DELETE_IDS = [
  // Framed vertical (392687cd)
  '24195b25-7343-4baa-b227-a088acafa6a0',
  '11f7d750-2af9-40db-bd87-3c93f9e2719d',
  '4981822c-bfdc-49d1-8383-4fdfb1e2f896',
  'dea9a062-a39b-46d2-85cc-26c60b2258c6',
  '708d8d0e-f51c-404f-8537-6b0e6cf0bf47',
  '91533623-6f66-4532-892d-d6efcfae67aa',
  '5053ef63-cfee-437b-9ad8-277c6c6a559a',
  // Mugs (0e9a0a04)
  '58bfa45d-2753-4663-878a-389384eb72cf',
  '193ea8c6-927e-40a6-aae8-7561bde6fe3e',
  'e37d7c39-e513-4003-9d04-c4d74fd4dda9',
  '65ae159f-e3a9-48a7-a3c1-83a56c14189c',
  // Postcards (c608faae)
  'e261ad46-18fe-4ac4-a1a0-f27f0e116f61',
  '5230b0b3-633d-4611-a750-8b331d260a56',
  '0779a225-1b48-469b-8719-5f411e9b4d7c',
  '29d9adc1-1e9a-43d0-b7b4-57c8dc780a29',
  '2fb4f03f-0523-4b71-9bdc-eae91db586df',
  '3c0b33da-eb05-49a4-818f-da71fc77b268',
  '9812bc8b-59a2-4a56-8c19-8d2d5636c1df',
  '99003656-57c1-4fcb-b249-11e3e9c07939',
  // Apparel
  'f25c991a-a2a5-480f-b67a-ea2bd5635c1c',
  'd16997bd-8a8f-4ebe-a436-7c7b7aefd99a',
]

// Framed horizontal IDs: fetch from Shopify by title
const FRAMED_H_TITLES = [
  'Tourism I — Framed', 'Tourism II — Framed', 'Tourism III — Framed', 'Tourism IV — Framed',
  'Elephant Green — Framed', 'Elephant Yellow — Framed', 'Elephant Lilac — Framed', 'Elephant Red — Framed',
]

// ── Product definitions ────────────────────────────────────

function framedDesc(title: string) {
  const bare = title.replace(' (Framed)', '').replace(' — Framed', '')
  return `<p>Fine art giclée print of Stine Weirsøe Flamant's <em>${bare}</em>, mounted in a premium wooden frame with museum-quality matte archival paper.</p>
<ul>
<li>Available in A4, A3, A2, and A1</li>
<li>Frame options: white, natural wood, black</li>
<li>250gsm off-white archival matte paper</li>
<li>Plexiglass front — ready to hang</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 5–10 business days</li>
</ul>`
}

function horizontalDesc(title: string) {
  const bare = title.replace(' — Framed', '')
  return `<p>Fine art giclée print of Stine Weirsøe Flamant's <em>${bare}</em>, mounted in a premium wooden frame.</p>
<ul>
<li>Available in A5, A4, and A3 landscape</li>
<li>Frame options: white, natural wood, black</li>
<li>250gsm archival matte paper</li>
<li>Plexiglass front — ready to hang</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 5–10 business days</li>
</ul>`
}

function mugDesc() {
  return `<p>Ceramic mug featuring Stine Weirsøe Flamant's Neko Paw design. Dishwasher-safe. Available in white and black, 11oz.</p>`
}

function postcardDesc(title: string) {
  return `<p>A6 horizontal postcard featuring <em>${title.replace(' — Postcard', '')}</em> by Stine Weirsøe Flamant. 300gsm uncoated card, matte finish. Pack of 10.</p>`
}

const FRAMED_V_PRODUCTS = [
  { blobUrl: `${BLOB}/gelato/neko/nekopaw_yellow_outline.png`,  title: 'Neko Paw — Yellow (Framed)',        tags: ['neko', 'cat', 'yellow', 'art-print', 'framed'] },
  { blobUrl: `${BLOB}/gelato/neko/nekopaw_yellow_neon.png`,     title: 'Neko Paw — Yellow Neon (Framed)',   tags: ['neko', 'cat', 'yellow', 'neon', 'art-print', 'framed'] },
  { blobUrl: `${BLOB}/gelato/neko/nekopaw_yellow_blue.png`,     title: 'Neko Paw — Yellow & Blue (Framed)', tags: ['neko', 'cat', 'yellow', 'blue', 'art-print', 'framed'] },
  { blobUrl: `${BLOB}/gelato/neko/nekopaw_pink_outline.png`,    title: 'Neko Paw — Pink (Framed)',          tags: ['neko', 'cat', 'pink', 'art-print', 'framed'] },
  { blobUrl: `${BLOB}/gelato/neko/nekopaw_lilac_outline.png`,   title: 'Neko Paw — Lilac (Framed)',         tags: ['neko', 'cat', 'lilac', 'purple', 'art-print', 'framed'] },
  { localFile: `${DROPBOX_ART}/Sheroshine_1swf2023-1.jpeg`, blobPath: 'gelato/framed-vertical/sheroshine.jpg',    title: 'Sheroshine (Framed)',    tags: ['shero', 'feminist', 'art-print', 'framed'] },
  { localFile: `${DROPBOX_ART}/Strongfloral-1.jpeg`,         blobPath: 'gelato/framed-vertical/strong-floral.jpg', title: 'Strong Floral (Framed)', tags: ['floral', 'botanical', 'art-print', 'framed'] },
]

const FRAMED_H_PRODUCTS = [
  { blobUrl: `${BLOB}/gelato/tourism/tourism-1.jpg`,       title: 'Tourism I — Framed',        tags: ['tourism', 'photography', 'art-print', 'framed'] },
  { blobUrl: `${BLOB}/gelato/tourism/tourism-2.jpg`,       title: 'Tourism II — Framed',       tags: ['tourism', 'photography', 'art-print', 'framed'] },
  { blobUrl: `${BLOB}/gelato/tourism/tourism-3.jpg`,       title: 'Tourism III — Framed',      tags: ['tourism', 'photography', 'art-print', 'framed'] },
  { blobUrl: `${BLOB}/gelato/tourism/tourism-4.jpg`,       title: 'Tourism IV — Framed',       tags: ['tourism', 'photography', 'art-print', 'framed'] },
  { blobUrl: `${BLOB}/gelato/elephants/elephant-green.jpg`,  title: 'Elephant Green — Framed',   tags: ['elephant', 'green', 'art-print', 'framed'] },
  { blobUrl: `${BLOB}/gelato/elephants/elephant-yellow.jpg`, title: 'Elephant Yellow — Framed',  tags: ['elephant', 'yellow', 'art-print', 'framed'] },
  { blobUrl: `${BLOB}/gelato/elephants/elephant-lilac.jpg`,  title: 'Elephant Lilac — Framed',   tags: ['elephant', 'lilac', 'purple', 'art-print', 'framed'] },
  { blobUrl: `${BLOB}/gelato/elephants/elephant-red.jpg`,    title: 'Elephant Red — Framed',     tags: ['elephant', 'red', 'art-print', 'framed'] },
]

const MUG_PRODUCTS = [
  { blobUrl: `${BLOB}/gelato/neko/nekopaw_yellow_outline.png`, title: 'Neko Paw Mug — Yellow',        tags: ['neko', 'cat', 'yellow', 'mug'] },
  { blobUrl: `${BLOB}/gelato/neko/nekopaw_pink_outline.png`,   title: 'Neko Paw Mug — Pink',          tags: ['neko', 'cat', 'pink', 'mug'] },
  { blobUrl: `${BLOB}/gelato/neko/nekopaw_lilac_outline.png`,  title: 'Neko Paw Mug — Lilac',         tags: ['neko', 'cat', 'lilac', 'mug'] },
  { blobUrl: `${BLOB}/gelato/neko/nekopaw_yellow_blue.png`,    title: 'Neko Paw Mug — Yellow & Blue', tags: ['neko', 'cat', 'yellow', 'blue', 'mug'] },
]

const POSTCARD_PRODUCTS = [
  { blobUrl: `${BLOB}/gelato/tourism/tourism-1.jpg`,       title: 'Tourism I — Postcard',       tags: ['tourism', 'postcard'] },
  { blobUrl: `${BLOB}/gelato/tourism/tourism-2.jpg`,       title: 'Tourism II — Postcard',      tags: ['tourism', 'postcard'] },
  { blobUrl: `${BLOB}/gelato/tourism/tourism-3.jpg`,       title: 'Tourism III — Postcard',     tags: ['tourism', 'postcard'] },
  { blobUrl: `${BLOB}/gelato/tourism/tourism-4.jpg`,       title: 'Tourism IV — Postcard',      tags: ['tourism', 'postcard'] },
  { blobUrl: `${BLOB}/gelato/elephants/elephant-green.jpg`,  title: 'Elephant Green — Postcard',  tags: ['elephant', 'postcard'] },
  { blobUrl: `${BLOB}/gelato/elephants/elephant-yellow.jpg`, title: 'Elephant Yellow — Postcard', tags: ['elephant', 'postcard'] },
  { blobUrl: `${BLOB}/gelato/elephants/elephant-lilac.jpg`,  title: 'Elephant Lilac — Postcard',  tags: ['elephant', 'postcard'] },
  { blobUrl: `${BLOB}/gelato/elephants/elephant-red.jpg`,    title: 'Elephant Red — Postcard',    tags: ['elephant', 'postcard'] },
]

const APPAREL_PRODUCTS = [
  {
    templateId: '2edd0df8-f9b1-4037-a7a2-456cd768739d',
    blobUrl: `${BLOB}/gelato/neko/nekopaw_yellow_outline.png`,
    title: 'Neko Paw — Tank Top',
    tags: ['neko', 'cat', 'apparel', 'tank-top'],
    description: '<p>Neko Paw tank top. Unisex fit, DTG printed. Available in white, sizes XS–2XL.</p>',
  },
  {
    templateId: '461771cb-a59e-4d1b-b767-18bab73d6f6c',
    blobUrl: `${BLOB}/gelato/neko/nekopaw_yellow_outline.png`,
    title: 'Neko Paw — Embroidered T-Shirt',
    tags: ['neko', 'cat', 'apparel', 'tshirt', 'embroidery'],
    description: '<p>Neko Paw embroidered chest logo t-shirt. White, sizes S–3XL.</p>',
  },
]

// ── Helpers ────────────────────────────────────────────────

async function uploadFromFile(localFile: string, blobPath: string): Promise<string> {
  if (!existsSync(localFile)) throw new Error(`Not found: ${localFile}`)
  let uploadPath = localFile
  let tmpPath: string | null = null
  if (/\.(tiff?|png)$/i.test(localFile)) {
    tmpPath = resolve(tmpdir(), `rebuild-${Date.now()}.jpg`)
    execSync(`sips -s format jpeg -s formatOptions 92 "${localFile}" --out "${tmpPath}"`, { stdio: 'pipe' })
    uploadPath = tmpPath
  }
  const buf = readFileSync(uploadPath)
  const blob = await put(blobPath, buf, { access: 'public', contentType: 'image/jpeg', allowOverwrite: true })
  if (tmpPath) unlinkSync(tmpPath)
  return blob.url
}

async function gelatoDelete(productId: string): Promise<void> {
  const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${productId}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': KEY },
  })
  if (!r.ok && r.status !== 404) {
    const e = await r.text()
    console.warn(`    delete ${productId} → ${r.status}: ${e.slice(0,80)}`)
  }
}

async function gelatoCreate(templateId: string, title: string, description: string, tags: string[], fileUrl: string): Promise<string> {
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId,
        title,
        description,
        tags,
        imagePlaceholders: [{ name: 'ImagePlaceholder1', fileUrl }],
      }),
    }
  )
  const json = await res.json() as any
  if (!res.ok) throw new Error(`Create failed: ${JSON.stringify(json)}`)
  return json.id as string
}

// Find framed horizontal product IDs via Shopify (we didn't store them)
async function findHorizontalFramedIds(): Promise<string[]> {
  const domain  = process.env.SHOPIFY_STORE_DOMAIN!
  const token   = process.env.SHOPIFY_ADMIN_TOKEN!
  const ids: string[] = []

  for (const title of FRAMED_H_TITLES) {
    const query = `
      query { products(first: 5, query: "title:'${title}'") {
        edges { node { id metafields(first:5, namespace:"gelato") { edges { node { key value } } } } }
      }}
    `
    const r = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    // Fall back: search REST by title
    const restR = await fetch(
      `https://${domain}/admin/api/2024-01/products.json?title=${encodeURIComponent(title)}&fields=id,title`,
      { headers: { 'X-Shopify-Access-Token': token } }
    )
    const restJ = await restR.json() as any
    const shopifyId = restJ.products?.[0]?.id
    if (!shopifyId) { console.warn(`  ⚠ Shopify product not found: "${title}"`); continue }

    // Get Gelato product ID from Shopify product (it's stored in the externalId / metafield)
    // Try searching Gelato products list for matching title
    const gR = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=50`,
      { headers: { 'X-API-KEY': KEY } }
    )
    const gJ = await gR.json() as any
    const match = (gJ.products ?? []).find((p: any) => p.title === title)
    if (match) { ids.push(match.id) }
    else { console.warn(`  ⚠ Gelato product not found: "${title}"`) }
  }
  return ids
}

// ── Main ───────────────────────────────────────────────────

async function main() {
  console.log('Phase 1: Discovering framed-horizontal product IDs from Gelato...')
  const horizontalIds = await findHorizontalFramedIds()
  console.log(`  Found ${horizontalIds.length} of 8 horizontal framed products`)

  const allDeleteIds = [...DELETE_IDS, ...horizontalIds]
  console.log(`\nPhase 2: Deleting ${allDeleteIds.length} products from Gelato...`)
  for (const id of allDeleteIds) {
    process.stdout.write(`  DELETE ${id}... `)
    await gelatoDelete(id)
    console.log('✓')
  }

  console.log('\nPhase 3: Recreating products with correct imagePlaceholders...\n')

  // ── Framed vertical (392687cd) ──
  console.log('— Framed Vertical (12 variants each) —')
  for (const p of FRAMED_V_PRODUCTS) {
    process.stdout.write(`  ▸ ${p.title}... `)
    let artUrl: string
    if ('blobUrl' in p) {
      artUrl = p.blobUrl
    } else {
      artUrl = await uploadFromFile(p.localFile, p.blobPath)
    }
    const id = await gelatoCreate('392687cd-4959-4186-bc3a-fb135d1e0c1d', p.title, framedDesc(p.title), p.tags, artUrl)
    console.log(`✓ ${id}`)
    await new Promise(r => setTimeout(r, 500))
  }

  // ── Framed horizontal (992be2b6) ──
  console.log('\n— Framed Horizontal (12 variants each) —')
  for (const p of FRAMED_H_PRODUCTS) {
    process.stdout.write(`  ▸ ${p.title}... `)
    const id = await gelatoCreate('992be2b6-4005-4abb-884c-9d4fa2f4affb', p.title, horizontalDesc(p.title), p.tags, p.blobUrl)
    console.log(`✓ ${id}`)
    await new Promise(r => setTimeout(r, 500))
  }

  // ── Mugs (0e9a0a04) ──
  console.log('\n— Mugs —')
  for (const p of MUG_PRODUCTS) {
    process.stdout.write(`  ▸ ${p.title}... `)
    const id = await gelatoCreate('0e9a0a04-1016-4216-9a40-4f42a00b8dca', p.title, mugDesc(), p.tags, p.blobUrl)
    console.log(`✓ ${id}`)
    await new Promise(r => setTimeout(r, 500))
  }

  // ── Postcards (c608faae) ──
  console.log('\n— Postcards —')
  for (const p of POSTCARD_PRODUCTS) {
    process.stdout.write(`  ▸ ${p.title}... `)
    const id = await gelatoCreate('c608faae-710c-4312-bb61-85b9c4a1f4f5', p.title, postcardDesc(p.title), p.tags, p.blobUrl)
    console.log(`✓ ${id}`)
    await new Promise(r => setTimeout(r, 500))
  }

  // ── Apparel (two different templates) ──
  console.log('\n— Apparel —')
  for (const p of APPAREL_PRODUCTS) {
    process.stdout.write(`  ▸ ${p.title}... `)
    const id = await gelatoCreate(p.templateId, p.title, p.description, p.tags, p.blobUrl)
    console.log(`✓ ${id}`)
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n✅ Done. Gelato will generate mockups asynchronously (minutes to hours).')
  console.log('Check Gelato dashboard and Shopify for updated product images.')
}

main().catch(err => { console.error(err); process.exit(1) })
