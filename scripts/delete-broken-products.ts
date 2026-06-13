/**
 * delete-broken-products.ts
 * Deletes all mug, tote, and tank-top products from Gelato.
 * Skips any product with "CANARY" in its title.
 * Run: npx tsx scripts/delete-broken-products.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY      = process.env.GELATO_API_KEY!
const STORE_ID = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const BASE     = `https://ecommerce.gelatoapis.com/v1/stores/${STORE_ID}`

async function getJson(url: string) {
  const r = await fetch(url, { headers: { 'X-API-KEY': KEY } })
  if (!r.ok) throw new Error(`GET ${url} → ${r.status}`)
  return r.json() as Promise<any>
}

async function deleteProduct(id: string): Promise<void> {
  const r = await fetch(`${BASE}/products/${id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': KEY },
  })
  if (!r.ok) {
    const txt = await r.text()
    throw new Error(`DELETE ${id} → ${r.status}: ${txt.slice(0,120)}`)
  }
}

function isTarget(uid: string): 'mug' | 'tote' | 'tank' | null {
  if (uid.includes('mug_product'))         return 'mug'
  if (uid.includes('tote-bag') || uid.includes('bag_product')) return 'tote'
  if (uid.includes('tank-top'))            return 'tank'
  return null
}

async function main() {
  console.log('Collecting mug/tote/tank-top products...\n')

  const targets: { id: string; title: string; type: string }[] = []
  let offset = 0

  while (true) {
    const data = await getJson(`${BASE}/products?limit=100&offset=${offset}`)
    const products: any[] = data.products ?? []
    if (!products.length) break

    for (const p of products) {
      if (p.title?.includes('CANARY')) continue
      const uid0 = (p.variants?.[0]?.productUid) ?? ''
      const type = isTarget(uid0)
      if (type) targets.push({ id: p.id, title: p.title, type })
    }
    offset += 100
    if (products.length < 100) break
  }

  const byType = { mug: 0, tote: 0, tank: 0 }
  targets.forEach(t => byType[t.type as keyof typeof byType]++)
  console.log(`Found: ${targets.length} products to delete`)
  console.log(`  Mugs: ${byType.mug}  Totes: ${byType.tote}  Tank tops: ${byType.tank}\n`)

  let deleted = 0, failed = 0
  for (const p of targets) {
    process.stdout.write(`  [${deleted + failed + 1}/${targets.length}] ${p.type} "${p.title.slice(0, 50)}"... `)
    try {
      await deleteProduct(p.id)
      console.log('✓')
      deleted++
    } catch (e) {
      console.log(`FAILED: ${e}`)
      failed++
    }
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\nDone. Deleted: ${deleted}  Failed: ${failed}`)
}

main().catch(e => { console.error(e); process.exit(1) })
