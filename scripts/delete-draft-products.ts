/**
 * delete-draft-products.ts
 * Deletes all DRAFT products from the Shopify store.
 * Run this before re-seeding if a previous seed run created broken products.
 *
 *   npx tsx scripts/delete-draft-products.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!

async function getToken(): Promise<string> {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }).toString(),
  })
  const data = await res.json() as { access_token: string }
  return data.access_token
}

async function rest<T>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok && res.status !== 422) throw new Error(`REST ${method} ${path}: ${res.status}`)
  return res.status === 204 ? ({} as T) : res.json() as Promise<T>
}

async function main() {
  const token = await getToken()

  let deleted = 0
  let page = 1
  let hasMore = true

  while (hasMore) {
    const data = await rest<{ products: Array<{ id: number; title: string; status: string }> }>(
      token, 'GET', `/products.json?published_status=unpublished&limit=250`
    )
    const products = data.products
    if (products.length === 0) { hasMore = false; break }

    for (const p of products) {
      await rest(token, 'DELETE', `/products/${p.id}.json`)
      console.log(`  ✓ deleted [${++deleted}] ${p.title}`)
      await new Promise(r => setTimeout(r, 300))
    }
    page++
  }

  console.log(`\nDeleted ${deleted} draft products.`)
}

main().catch(err => { console.error(err); process.exit(1) })
