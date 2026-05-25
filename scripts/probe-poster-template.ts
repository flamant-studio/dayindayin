import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY = process.env.GELATO_API_KEY!
const TEMPLATE_ID = '1339c7ec-201f-4188-a50b-c535cb414957'

async function main() {
  const r = await fetch(`https://ecommerce.gelatoapis.com/v1/templates/${TEMPLATE_ID}`, {
    headers: { 'X-API-KEY': KEY }
  })
  const j = await r.json() as any
  // Print the full structure minus variants
  const { variants, ...rest } = j
  console.log('Template top-level keys:', Object.keys(j))
  console.log('Non-variant fields:', JSON.stringify(rest, null, 2))
  console.log('\nVariants:')
  variants?.forEach((v: any, i: number) => {
    console.log(`  [${i}]`, JSON.stringify(v, null, 2))
  })
}
main().catch(console.error)
