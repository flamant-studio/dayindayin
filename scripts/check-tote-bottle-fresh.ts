/**
 * check-tote-bottle-fresh.ts — READ-ONLY. Re-checks Tote Bag + Water Bottle
 * templates after Sebastian edited them in the Gelato dashboard (2026-07-19).
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!

const TEMPLATES: Record<string, string> = {
  'Tote Bag': 'a28d9355-d78d-4d13-afec-8f120d989280',
  'Water Bottle': '8d192eeb-22c2-49cf-bb6f-b7df07fe11ce',
}

async function main() {
  for (const [name, id] of Object.entries(TEMPLATES)) {
    const res = await fetch(`https://ecommerce.gelatoapis.com/v1/templates/${id}`, {
      headers: { 'X-API-KEY': GELATO_API_KEY },
    })
    console.log(`\n=== ${name} (${id}) — status ${res.status} ===`)
    if (!res.ok) { console.log(await res.text()); continue }
    const data = await res.json()
    console.log(JSON.stringify(data, null, 2))
  }
}

main().catch(e => { console.error(e); process.exit(1) })
