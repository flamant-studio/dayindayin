import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY = process.env.GELATO_API_KEY!
const TEMPLATE_ID = '992be2b6-4005-4abb-884c-9d4fa2f4affb'

async function main() {
  const r = await fetch(`https://ecommerce.gelatoapis.com/v1/templates/${TEMPLATE_ID}`, {
    headers: { 'X-API-KEY': KEY }
  })
  const j = await r.json() as any
  console.log('Template:', j.templateName)
  for (const v of (j.variants ?? []).slice(0, 3)) {
    console.log(`\nVariant: ${v.title}`)
    console.log('  imagePlaceholders:', JSON.stringify(v.imagePlaceholders, null, 4))
  }
}
main().catch(console.error)
