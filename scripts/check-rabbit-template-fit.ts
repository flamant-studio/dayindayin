/**
 * check-rabbit-template-fit.ts — READ-ONLY. Queries the live Gelato template API
 * for the 5 transparent-artwork-suitable templates, to check what dimension/aspect
 * data is actually available for imagePlaceholders before committing artwork to any.
 *
 * Run: npx tsx scripts/check-rabbit-template-fit.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const GELATO_API_KEY = process.env.GELATO_API_KEY!

const TEMPLATES: Record<string, string> = {
  Mug: '0e9a0a04-1016-4216-9a40-4f42a00b8dca',
  'Tote Bag': 'a28d9355-d78d-4d13-afec-8f120d989280',
  'Tank Top': '2edd0df8-f9b1-4037-a7a2-456cd768739d',
  'Water Bottle': '8d192eeb-22c2-49cf-bb6f-b7df07fe11ce',
  'Dad Cap': '4350a3d2-888e-4b7f-a504-90d4fc34d9a4',
}

async function main() {
  for (const [name, id] of Object.entries(TEMPLATES)) {
    const res = await fetch(`https://ecommerce.gelatoapis.com/v1/templates/${id}`, {
      headers: { 'X-API-KEY': GELATO_API_KEY },
    })
    console.log(`\n=== ${name} (${id}) — status ${res.status} ===`)
    if (!res.ok) { console.log(await res.text()); continue }
    const data = await res.json()
    console.log(JSON.stringify(data, null, 2).slice(0, 3000))
  }
}

main().catch(e => { console.error(e); process.exit(1) })
