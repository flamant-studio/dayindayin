import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

const IDS = [
  '194acff4-4c52-4c31-a405-10b0c88aa45f', // Neko Yellow
  '2e1dec9e-f92f-4870-94b5-cd6fb5af3d96', // Sheroshine
  'f9162864-5b8a-48ac-8f4f-260ab4e74a31', // Strong Floral
]

async function main() {
  for (const id of IDS) {
    const r = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${id}`,
      { headers: { 'X-API-KEY': KEY } }
    )
    const p = await r.json() as any
    const ph = p.variants?.[0]?.imagePlaceholders ?? []
    console.log(`\n${p.title}`)
    console.log(`  images: ${p.productImages?.length ?? 0}, placeholder fileUrl: ${ph[0]?.fileUrl ?? 'none'}`)
  }
}
main().catch(console.error)
