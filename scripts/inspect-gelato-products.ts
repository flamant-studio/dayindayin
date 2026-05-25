import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

const SAMPLES: Record<string, string> = {
  'framed-vertical':  '24195b25-7343-4baa-b227-a088acafa6a0',
  'mug':              '58bfa45d-2753-4663-878a-389384eb72cf',
  'postcard':         'e261ad46-18fe-4ac4-a1a0-f27f0e116f61',
  'tank-top':         'f25c991a-a2a5-480f-b67a-ea2bd5635c1c',
}

async function main() {
  for (const [label, id] of Object.entries(SAMPLES)) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${id}`, {
      headers: { 'X-API-KEY': KEY }
    })
    const j = await r.json() as any
    const v = j.variants?.[0]
    console.log(`\n=== ${label} (${id}) ===`)
    console.log('status:', j.status)
    console.log('images:', JSON.stringify(j.images?.slice(0,2), null, 2))
    if (v) {
      console.log('variant title:', v.title)
      console.log('variant keys:', Object.keys(v).join(', '))
      console.log('variant.imagePlaceholders:', JSON.stringify(v.imagePlaceholders, null, 2))
      console.log('variant.fileUrl:', v.fileUrl)
      console.log('variant.previewUrl:', v.previewUrl)
      console.log('variant.productUid:', v.productUid)
    }
  }
}

main().catch(err => { console.error(err); process.exit(1) })
