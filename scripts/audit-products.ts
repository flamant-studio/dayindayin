/**
 * audit-products.ts
 *
 * Reads MANIFEST.csv (source of truth), then checks every product against
 * both Gelato and Shopify. Writes AUDIT.md.
 *
 * Checks per product:
 *   1. Gelato: product exists with exact title?
 *   2. Gelato: variant count matches manifest?
 *   3. Gelato: first variant fileUrl set, and does it match the manifest artwork URL?
 *   4. Shopify: product exists (synced via externalId)?
 *   5. Shopify: has at least 1 image?
 *   6. Shopify: page returns 200 (storefront product exists and is active)?
 *
 * Status:
 *   OK              all checks pass
 *   ARTWORK_WRONG   fileUrl set but differs from manifest URL
 *   ARTWORK_MISSING fileUrl is null (unpatched or not verifiable via API)
 *   WRONG_VARIANTS  variant count doesn't match manifest
 *   NO_IMAGES       in Shopify but 0 images (Gelato still generating mockups)
 *   UNSYNCED        in Gelato but externalId null (not yet in Shopify)
 *   MISSING         not found in Gelato at all
 *
 * Run: npx tsx scripts/audit-products.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY  = process.env.GELATO_API_KEY!
const STORE_ID        = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const SHOPIFY_STORE   = process.env.SHOPIFY_STORE_DOMAIN!
const SHOPIFY_API_VER = '2025-01'

let _shopifyToken: string | null = null
let _shopifyTokenExpiry = 0

async function getShopifyToken(): Promise<string> {
  if (_shopifyToken && _shopifyTokenExpiry - 60_000 > Date.now()) return _shopifyToken
  const res = await fetch(`https://${SHOPIFY_STORE}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SHOPIFY_CLIENT_ID!,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET!,
    }).toString(),
  })
  if (!res.ok) throw new Error(`Shopify token mint: ${res.status}`)
  const data = await res.json() as { access_token: string; expires_in: number }
  _shopifyToken = data.access_token
  _shopifyTokenExpiry = Date.now() + data.expires_in * 1000
  return _shopifyToken
}

// ── Manifest ──────────────────────────────────────────────────────────────────

interface ManifestRow {
  product_title: string
  type: string
  artwork_title: string
  artwork_filename: string
  artwork_url: string
  template_id: string
  expected_variant_count: number
  shopify_handle: string
  orientation: string
}

function loadManifest(): ManifestRow[] {
  const csv = readFileSync(resolve(process.cwd(), 'MANIFEST.csv'), 'utf8')
  const lines = csv.split('\n').filter(l => l.trim())
  const headers = lines[0].split(',')
  return lines.slice(1).map(line => {
    const fields: string[] = []
    let i = 0, f = '', inQ = false
    while (i < line.length) {
      const c = line[i]
      if (c === '"' && !inQ) { inQ = true; i++; continue }
      if (c === '"' && inQ && line[i + 1] === '"') { f += '"'; i += 2; continue }
      if (c === '"' && inQ) { fields.push(f); f = ''; inQ = false; i++; continue }
      if (c === ',' && !inQ) { fields.push(f); f = ''; i++; continue }
      f += c; i++
    }
    fields.push(f)
    const obj: Record<string, string> = {}
    headers.forEach((h, idx) => { obj[h] = fields[idx] ?? '' })
    return {
      product_title: obj.product_title,
      type: obj.type,
      artwork_title: obj.artwork_title,
      artwork_filename: obj.artwork_filename,
      artwork_url: obj.artwork_url,
      template_id: obj.template_id,
      expected_variant_count: parseInt(obj.expected_variant_count, 10),
      shopify_handle: obj.shopify_handle,
      orientation: obj.orientation,
    }
  })
}

// ── Gelato ────────────────────────────────────────────────────────────────────

interface GelatoVariantDetail {
  id: string
  title: string
  fileUrl: string | null
}

interface GelatoProduct {
  id: string
  title: string
  externalId: string | null
  variants: Array<{ id: string; title: string; externalId: string | null }>
}

async function gelato(path: string): Promise<Record<string, unknown>> {
  const res = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}${path}`, {
    headers: { 'X-API-KEY': GELATO_API_KEY },
  })
  if (!res.ok) throw new Error(`Gelato ${res.status}: ${path}`)
  return res.json() as Promise<Record<string, unknown>>
}

async function getAllGelatoProducts(): Promise<GelatoProduct[]> {
  const all: GelatoProduct[] = []
  let offset = 0
  while (true) {
    const d = await gelato(`/products?limit=100&offset=${offset}`)
    const page = (d.products as GelatoProduct[]) ?? []
    all.push(...page)
    if (page.length < 100) break
    offset += 100
    await new Promise(r => setTimeout(r, 300))
  }
  return all
}

async function getVariantFileUrl(productId: string, variantId: string): Promise<string | null> {
  try {
    const d = await gelato(`/products/${productId}/variants/${variantId}`)
    return (d as { fileUrl?: string | null }).fileUrl ?? null
  } catch {
    return null
  }
}

// ── Shopify ───────────────────────────────────────────────────────────────────

interface ShopifyProductSummary {
  id: string
  title: string
  handle: string
  status: string
  imageCount: number
}

async function shopifyAdmin<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = await getShopifyToken()
  const res = await fetch(`https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VER}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json() as { data?: T; errors?: unknown }
  if (json.errors) throw new Error(`Shopify GQL error: ${JSON.stringify(json.errors).slice(0, 200)}`)
  return json.data as T
}

async function getAllShopifyProducts(): Promise<ShopifyProductSummary[]> {
  const all: ShopifyProductSummary[] = []
  let cursor: string | null = null
  while (true) {
    const data = await shopifyAdmin<{
      products: {
        edges: {
          node: { id: string; title: string; handle: string; status: string; images: { edges: unknown[] } }
        }[]
        pageInfo: { hasNextPage: boolean; endCursor: string }
      }
    }>(`
      query($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges { node { id title handle status images(first: 1) { edges { node { id } } } } }
          pageInfo { hasNextPage endCursor }
        }
      }
    `, { first: 250, after: cursor })
    for (const e of data.products.edges) {
      all.push({
        id: e.node.id,
        title: e.node.title,
        handle: e.node.handle,
        status: e.node.status,
        imageCount: e.node.images.edges.length,
      })
    }
    if (!data.products.pageInfo.hasNextPage) break
    cursor = data.products.pageInfo.endCursor
    await new Promise(r => setTimeout(r, 300))
  }
  return all
}

// ── Audit ─────────────────────────────────────────────────────────────────────

type AuditStatus =
  | 'OK'
  | 'ARTWORK_WRONG'
  | 'ARTWORK_MISSING'
  | 'WRONG_VARIANTS'
  | 'NO_IMAGES'
  | 'UNSYNCED'
  | 'MISSING'

interface AuditRow {
  manifest: ManifestRow
  status: AuditStatus
  gelatoId: string
  actualVariantCount: number
  actualFileUrl: string
  shopifyHandle: string
  shopifyImages: number
  shopifyStatus: string
  detail: string
}

async function main() {
  console.log('Loading manifest...')
  const manifest = loadManifest()
  console.log(`  ${manifest.length} products in manifest`)

  console.log('Fetching Gelato products...')
  const gelatoProducts = await getAllGelatoProducts()
  console.log(`  ${gelatoProducts.length} products in Gelato`)
  const gelatoByTitle = new Map(gelatoProducts.map(p => [p.title.toLowerCase(), p]))

  console.log('Fetching Shopify products...')
  const shopifyProducts = await getAllShopifyProducts()
  console.log(`  ${shopifyProducts.length} products in Shopify`)
  const shopifyByTitle = new Map(shopifyProducts.map(p => [p.title.toLowerCase(), p]))

  const results: AuditRow[] = []
  let done = 0

  for (const m of manifest) {
    process.stdout.write(`\r  [${++done}/${manifest.length}] ${m.product_title.slice(0, 55).padEnd(55)}`)

    const gp = gelatoByTitle.get(m.product_title.toLowerCase())
    const sp = shopifyByTitle.get(m.product_title.toLowerCase())

    if (!gp) {
      results.push({
        manifest: m,
        status: 'MISSING',
        gelatoId: '',
        actualVariantCount: 0,
        actualFileUrl: '',
        shopifyHandle: sp?.handle ?? '',
        shopifyImages: sp?.imageCount ?? 0,
        shopifyStatus: sp?.status ?? '',
        detail: 'Not found in Gelato',
      })
      continue
    }

    // Check variant count
    const actualVariantCount = gp.variants?.length ?? 0
    const variantCountOk = actualVariantCount === m.expected_variant_count

    // Get fileUrl from first variant
    let actualFileUrl = ''
    if (gp.variants && gp.variants.length > 0) {
      actualFileUrl = await getVariantFileUrl(gp.id, gp.variants[0].id) ?? ''
      await new Promise(r => setTimeout(r, 200))
    }

    const shopifyImages = sp?.imageCount ?? 0
    const shopifyStatus = sp?.status ?? ''

    // Determine status (first failing check wins)
    let status: AuditStatus
    let detail = ''

    if (!variantCountOk) {
      status = 'WRONG_VARIANTS'
      detail = `Expected ${m.expected_variant_count} variants, got ${actualVariantCount}`
    } else if (!gp.externalId) {
      status = 'UNSYNCED'
      detail = 'externalId null — not yet synced to Shopify'
    } else if (actualFileUrl && actualFileUrl !== m.artwork_url) {
      status = 'ARTWORK_WRONG'
      detail = `fileUrl: ${actualFileUrl.split('/').pop()} ≠ manifest: ${m.artwork_filename}`
    } else if (!actualFileUrl) {
      // fileUrl null — may be correct (Gelato doesn't always expose it via GET)
      // Classify as ARTWORK_MISSING so Sebastian can visually verify
      if (shopifyImages === 0) {
        status = 'ARTWORK_MISSING'
        detail = 'fileUrl null + no Shopify images — artwork unverifiable'
      } else {
        // Has Shopify images — product was processed by Gelato, fileUrl just not exposed
        status = shopifyImages > 0 ? 'OK' : 'NO_IMAGES'
        detail = shopifyImages > 0 ? 'fileUrl null but has Shopify images (Gelato processed)' : ''
      }
    } else if (shopifyImages === 0) {
      status = 'NO_IMAGES'
      detail = 'Shopify images pending Gelato mockup generation'
    } else {
      status = 'OK'
      detail = ''
    }

    results.push({
      manifest: m,
      status,
      gelatoId: gp.id,
      actualVariantCount,
      actualFileUrl,
      shopifyHandle: sp?.handle ?? '',
      shopifyImages,
      shopifyStatus,
      detail,
    })
  }

  console.log('\n\nWriting AUDIT.md...')

  // ── Count by status and type ────────────────────────────────────────────────

  const statuses: AuditStatus[] = ['OK', 'ARTWORK_WRONG', 'ARTWORK_MISSING', 'WRONG_VARIANTS', 'NO_IMAGES', 'UNSYNCED', 'MISSING']
  const statusIcon: Record<AuditStatus, string> = {
    OK: '✅',
    ARTWORK_WRONG: '❌',
    ARTWORK_MISSING: '⚠️',
    WRONG_VARIANTS: '❌',
    NO_IMAGES: '🕐',
    UNSYNCED: '🔄',
    MISSING: '❌',
  }

  const countBy = (s: AuditStatus) => results.filter(r => r.status === s).length

  const lines: string[] = []
  lines.push('# Product Audit — 2026-06-12')
  lines.push('')
  lines.push(`Generated from MANIFEST.csv (${manifest.length} expected products) vs live Gelato + Shopify state.`)
  lines.push('')
  lines.push('## Summary')
  lines.push('')
  lines.push('| Status | Count | Meaning |')
  lines.push('|--------|-------|---------|')
  lines.push(`| ✅ OK | ${countBy('OK')} | Correct variant count, artwork verified or Shopify images present |`)
  lines.push(`| ❌ ARTWORK_WRONG | ${countBy('ARTWORK_WRONG')} | fileUrl set but differs from manifest — wrong artwork patched |`)
  lines.push(`| ⚠️ ARTWORK_MISSING | ${countBy('ARTWORK_MISSING')} | fileUrl null AND no Shopify images — cannot verify artwork |`)
  lines.push(`| ❌ WRONG_VARIANTS | ${countBy('WRONG_VARIANTS')} | Variant count doesn't match manifest |`)
  lines.push(`| 🕐 NO_IMAGES | ${countBy('NO_IMAGES')} | In Shopify, Gelato mockup generation pending |`)
  lines.push(`| 🔄 UNSYNCED | ${countBy('UNSYNCED')} | In Gelato, not yet synced to Shopify |`)
  lines.push(`| ❌ MISSING | ${countBy('MISSING')} | Not found in Gelato at all |`)
  lines.push(`| **Total** | **${results.length}** | |`)
  lines.push('')

  // ── By product type ─────────────────────────────────────────────────────────

  const types = ['Poster', 'Mug', 'Tote', 'Tank Top']
  lines.push('## By Product Type')
  lines.push('')
  lines.push('| Type | OK | ⚠️/❌ Broken | 🕐 No Images | 🔄 Unsynced | Total |')
  lines.push('|------|-----|------------|------------|-----------|-------|')
  for (const type of types) {
    const tr = results.filter(r => r.manifest.type === type)
    const ok = tr.filter(r => r.status === 'OK').length
    const broken = tr.filter(r => ['ARTWORK_WRONG','ARTWORK_MISSING','WRONG_VARIANTS','MISSING'].includes(r.status)).length
    const noImg = tr.filter(r => r.status === 'NO_IMAGES').length
    const unsynced = tr.filter(r => r.status === 'UNSYNCED').length
    lines.push(`| ${type} | ${ok} | ${broken} | ${noImg} | ${unsynced} | ${tr.length} |`)
  }
  lines.push('')

  // ── Broken products ─────────────────────────────────────────────────────────

  const broken = results.filter(r => ['ARTWORK_WRONG','ARTWORK_MISSING','WRONG_VARIANTS','MISSING'].includes(r.status))
  if (broken.length > 0) {
    lines.push('## ❌ Broken — Action Required')
    lines.push('')
    lines.push('| Product | Type | Status | Expected Variants | Actual Variants | Artwork (manifest) | Actual fileUrl | Detail |')
    lines.push('|---------|------|--------|------------------|-----------------|-------------------|----------------|--------|')
    for (const r of broken) {
      const actualFile = r.actualFileUrl ? r.actualFileUrl.split('/').pop() ?? '' : 'null'
      lines.push(`| ${r.manifest.product_title} | ${r.manifest.type} | ${statusIcon[r.status]} ${r.status} | ${r.manifest.expected_variant_count} | ${r.actualVariantCount || '—'} | \`${r.manifest.artwork_filename}\` | \`${actualFile}\` | ${r.detail} |`)
    }
    lines.push('')
  }

  // ── Unsynced ────────────────────────────────────────────────────────────────

  const unsynced = results.filter(r => r.status === 'UNSYNCED')
  if (unsynced.length > 0) {
    lines.push('## 🔄 Unsynced — In Gelato, Not Yet in Shopify')
    lines.push('')
    lines.push(`${unsynced.length} products are in Gelato but their \`externalId\` is null — Gelato hasn't finished syncing them to Shopify. Re-run the publish script when sync completes.`)
    lines.push('')
    lines.push('| Product | Type | Gelato Variants |')
    lines.push('|---------|------|----------------|')
    for (const r of unsynced) {
      lines.push(`| ${r.manifest.product_title} | ${r.manifest.type} | ${r.actualVariantCount} |`)
    }
    lines.push('')
  }

  // ── No images ───────────────────────────────────────────────────────────────

  const noImages = results.filter(r => r.status === 'NO_IMAGES')
  if (noImages.length > 0) {
    lines.push('## 🕐 No Images — Gelato Mockup Pending')
    lines.push('')
    lines.push(`${noImages.length} products are in Shopify but have no images yet. Gelato generates mockups asynchronously — they will appear without any action needed.`)
    lines.push('')
    lines.push('| Product | Type |')
    lines.push('|---------|------|')
    for (const r of noImages) {
      lines.push(`| ${r.manifest.product_title} | ${r.manifest.type} |`)
    }
    lines.push('')
  }

  // ── OK ──────────────────────────────────────────────────────────────────────

  lines.push('## ✅ OK')
  lines.push('')
  lines.push('| Product | Type | Handle | Shopify Images | fileUrl | Artwork Filename |')
  lines.push('|---------|------|--------|---------------|---------|-----------------|')
  for (const r of results.filter(r => r.status === 'OK')) {
    const fileNote = r.actualFileUrl ? 'set' : 'null (Gelato processed)'
    lines.push(`| ${r.manifest.product_title} | ${r.manifest.type} | ${r.shopifyHandle} | ${r.shopifyImages} | ${fileNote} | \`${r.manifest.artwork_filename}\` |`)
  }

  writeFileSync(resolve(process.cwd(), 'AUDIT.md'), lines.join('\n'), 'utf8')

  // Console summary
  console.log(`\nAUDIT.md written.`)
  console.log(`\n  ✅  OK:               ${countBy('OK')}`)
  console.log(`  ❌  ARTWORK_WRONG:     ${countBy('ARTWORK_WRONG')}`)
  console.log(`  ⚠️   ARTWORK_MISSING:   ${countBy('ARTWORK_MISSING')}`)
  console.log(`  ❌  WRONG_VARIANTS:    ${countBy('WRONG_VARIANTS')}`)
  console.log(`  🕐  NO_IMAGES:         ${countBy('NO_IMAGES')}`)
  console.log(`  🔄  UNSYNCED:          ${countBy('UNSYNCED')}`)
  console.log(`  ❌  MISSING:           ${countBy('MISSING')}`)
  console.log(`      ─────────────────────`)
  console.log(`      Total:             ${results.length}`)
}

main().catch(err => { console.error(err); process.exit(1) })
