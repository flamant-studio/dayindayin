/**
 * publish-gelato-to-shopify.ts
 *
 * For every Gelato product that has synced to Shopify:
 *   1. Sets tags (series + category) and productType on the Shopify product
 *   2. Publishes it to the Online Store channel
 *
 * Safe to re-run — already-published products just get tags re-applied.
 *
 * Run: npx tsx scripts/publish-gelato-to-shopify.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_KEY   = process.env.GELATO_API_KEY!
const STORE_ID     = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const SHOP_DOMAIN  = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID    = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!
const ONLINE_STORE_PUB_ID = 'gid://shopify/Publication/337681482075'

// ── Tag inference ─────────────────────────────────────────────────────────────

function inferProductType(uid: string): string {
  if (uid.includes('mug_product'))            return 'Mug'
  if (uid.includes('framed_poster'))          return 'Framed Print'
  if (uid.includes('flat_'))                  return 'Poster'
  if (uid.includes('tote-bag') || uid.includes('bag_product')) return 'Tote Bag'
  if (uid.includes('gsc_tank-top'))           return 'Tank Top'
  if (uid.includes('gsc_crewneck'))           return 'Crewneck'
  if (uid.includes('gca_hat'))                return 'Dad Cap'
  if (uid.includes('bottle_product'))         return 'Water Bottle'
  if (uid.includes('wood_'))                  return 'Wood Print'
  if (uid.includes('pack_of_folded_cards'))   return 'Greeting Card'
  if (uid.includes('pack_of_cards'))          return 'Postcard'
  return 'Art Print'
}

function inferCategoryTag(uid: string): string | null {
  if (uid.includes('mug_product'))            return 'mug'
  if (uid.includes('framed_poster'))          return 'framed'
  if (uid.includes('flat_'))                  return 'poster'
  if (uid.includes('tote-bag') || uid.includes('bag_product')) return 'tote'
  if (uid.includes('gsc_tank-top') || uid.includes('gsc_crewneck') || uid.includes('gca_hat')) return 'apparel'
  if (uid.includes('bottle_product'))         return 'water-bottle'
  if (uid.includes('wood_'))                  return 'wood-print'
  if (uid.includes('pack_of_folded_cards'))   return 'greeting-card'
  if (uid.includes('pack_of_cards'))          return 'postcard'
  return null  // fine_arts_poster falls through to 'Art Print' default in categoryLabel()
}

function inferSeriesTag(title: string): string | null {
  const t = title.toLowerCase()
  if (t.includes('neko') || t.includes('sleeping cat'))               return 'neko'
  if (t.includes('shero'))                                             return 'shero'
  if (t.includes('sea monster'))                                       return 'sea-monsters'
  if (t.includes('botanical') || t.includes('garden'))                return 'botanical'
  if (t.includes('poppy') || t.includes('poppies') || t.includes('floral') ||
      t.includes('flower') || t.includes('forget-me-not'))             return 'floral'
  if (t.includes('mask') || t.includes('moon face') || t.includes('solar face')) return 'faces'
  return null
}

function inferTags(title: string, uid: string): string[] {
  const tags: string[] = []
  const cat = inferCategoryTag(uid)
  if (cat) tags.push(cat)
  const series = inferSeriesTag(title)
  if (series) tags.push(series)
  return tags
}

// ── Gelato ────────────────────────────────────────────────────────────────────

interface GelatoVariant { productUid: string }
interface GelatoProduct {
  id: string
  title: string
  externalId?: string | null
  status?: string
  variants?: GelatoVariant[]
}

async function getGelatoProducts(): Promise<GelatoProduct[]> {
  const all: GelatoProduct[] = []
  let offset = 0
  while (true) {
    const res = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}/products?limit=100&offset=${offset}`,
      { headers: { 'X-API-KEY': GELATO_KEY } }
    )
    const data = await res.json() as { products?: GelatoProduct[] }
    const page = data.products ?? []
    all.push(...page)
    if (page.length < 100) break
    offset += 100
    await new Promise(r => setTimeout(r, 200))
  }
  return all
}

// ── Shopify ───────────────────────────────────────────────────────────────────

async function getShopifyToken(): Promise<string> {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }).toString(),
  })
  const data = await res.json() as { access_token: string }
  return data.access_token
}

async function shopifyGql(token: string, query: string, variables?: Record<string, unknown>) {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  })
  return res.json() as Promise<{ data: Record<string, unknown>; errors?: unknown[] }>
}

async function tagAndSetType(
  token: string,
  shopifyProductId: string,
  title: string,
  tags: string[],
  productType: string
): Promise<boolean> {
  const gid = `gid://shopify/Product/${shopifyProductId}`
  const res = await shopifyGql(token,
    `mutation Update($input: ProductInput!) {
      productUpdate(input: $input) {
        product { id tags productType }
        userErrors { field message }
      }
    }`,
    { input: { id: gid, tags, productType } }
  )
  const errs = (res.data?.productUpdate as any)?.userErrors ?? []
  if (errs.length > 0) {
    console.error(`  ✗ tag "${title}": ${JSON.stringify(errs)}`)
    return false
  }
  return true
}

async function publishProduct(token: string, shopifyProductId: string, title: string): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await shopifyGql(token,
      `mutation Publish($id: ID!, $pubId: ID!) {
        publishablePublish(id: $id, input: { publicationIds: [$pubId] }) {
          userErrors { field message }
        }
      }`,
      { id: `gid://shopify/Product/${shopifyProductId}`, pubId: ONLINE_STORE_PUB_ID }
    )
    if ((res as any).errors === 'Throttled') {
      await new Promise(r => setTimeout(r, 10000))
      continue
    }
    const errs = (res.data?.publishablePublish as any)?.userErrors ?? []
    if (errs.length > 0) {
      console.error(`  ✗ publish "${title}": ${JSON.stringify(errs)}`)
      return false
    }
    return true
  }
  return false
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Gelato → Shopify: tag + publish ===\n')

  const gelatoProducts = await getGelatoProducts()
  const synced   = gelatoProducts.filter(p => p.externalId)
  const unsynced = gelatoProducts.filter(p => !p.externalId)

  console.log(`Gelato total: ${gelatoProducts.length}  |  synced to Shopify: ${synced.length}  |  pending: ${unsynced.length}`)
  if (unsynced.length > 0) {
    console.log(`Still syncing: ${unsynced.slice(0, 5).map(p => p.title).join(', ')}${unsynced.length > 5 ? `… +${unsynced.length - 5} more` : ''}`)
  }
  console.log()

  const token = await getShopifyToken()

  let tagged = 0, published = 0, failed = 0

  for (const p of synced) {
    const uid         = p.variants?.[0]?.productUid ?? ''
    const tags        = inferTags(p.title, uid)
    const productType = inferProductType(uid)

    process.stdout.write(`  ${p.title.slice(0, 55).padEnd(55)} [${productType}] [${tags.join(', ') || 'no series'}] `)

    const tagOk = await tagAndSetType(token, p.externalId!, p.title, tags, productType)
    if (tagOk) tagged++

    const pubOk = await publishProduct(token, p.externalId!, p.title)
    if (pubOk) published++
    else failed++

    console.log(tagOk && pubOk ? '✓' : '✗')
    await new Promise(r => setTimeout(r, 400))
  }

  console.log(`\nDone.  Tagged: ${tagged}  Published: ${published}  Failed: ${failed}`)
  if (unsynced.length > 0) {
    console.log(`Re-run to catch remaining ${unsynced.length} products once Gelato finishes syncing.`)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
