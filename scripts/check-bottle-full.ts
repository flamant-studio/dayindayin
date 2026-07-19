import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const ID    = 'de69114b-ba8d-4eab-9c6e-92698836d5d1'

async function main() {
  const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${ID}`, {
    headers: { 'X-API-KEY': KEY }
  })
  const j = await r.json() as any
  console.log('status:', j.status)
  console.log('isReadyToPublish:', j.isReadyToPublish)
  console.log('publishedAt:', j.publishedAt)
  console.log('errors:', JSON.stringify(j.errors))
  console.log('publishingProgress:', JSON.stringify(j.publishingProgress))
  console.log('publishingErrorCode:', j.publishingErrorCode)
  console.log('publishingErrorDetails:', j.publishingErrorDetails)
  console.log('productImages:', JSON.stringify(j.productImages?.map((i:any)=>({id:i.id,status:i.status,isPrimary:i.isPrimary})), null, 2))
  console.log('variants:', JSON.stringify(j.variants, null, 2))
}
main().catch(err => { console.error(err); process.exit(1) })
