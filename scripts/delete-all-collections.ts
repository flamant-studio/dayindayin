/**
 * delete-all-collections.ts
 * Deletes all custom collections from the Shopify store.
 * Run before re-seeding collections.
 *
 *   npx tsx scripts/delete-all-collections.ts
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

async function rest<T>(token: string, method: string, path: string): Promise<T> {
  const res = await fetch(`https://${DOMAIN}/admin/api/2025-01${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
  })
  if (!res.ok && res.status !== 422) throw new Error(`REST ${method} ${path}: ${res.status}`)
  return res.status === 204 ? ({} as T) : res.json() as Promise<T>
}

async function main() {
  const token = await getToken()
  let deleted = 0

  const data = await rest<{ custom_collections: Array<{ id: number; title: string }> }>(
    token, 'GET', '/custom_collections.json?limit=250'
  )

  for (const col of data.custom_collections) {
    await rest(token, 'DELETE', `/custom_collections/${col.id}.json`)
    console.log(`  ✓ deleted "${col.title}"`)
    deleted++
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\nDeleted ${deleted} collections.`)
}

main().catch(err => { console.error(err); process.exit(1) })
