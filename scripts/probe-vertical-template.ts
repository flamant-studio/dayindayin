import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY = process.env.GELATO_API_KEY!

async function probe(id: string, label: string) {
  const r = await fetch(`https://ecommerce.gelatoapis.com/v1/templates/${id}`, { headers: { 'X-API-KEY': KEY } })
  const j = await r.json() as any
  const ph = j.variants?.[0]?.imagePlaceholders
  console.log(`${label}: "${ph?.[0]?.name}"`)
}

async function main() {
  await probe('392687cd-4959-4186-bc3a-fb135d1e0c1d', 'Vertical framed')
  await probe('992be2b6-4005-4abb-884c-9d4fa2f4affb', 'Horizontal framed')
}
main().catch(console.error)
