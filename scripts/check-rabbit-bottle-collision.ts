import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

async function main() {
  const r = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products?limit=100&offset=0`,
    { headers: { 'X-API-KEY': KEY } }
  )
  const j = await r.json() as any
  const matches = (j.products ?? []).filter((p: any) => p.title?.toLowerCase().includes('rabbit'))
  console.log(JSON.stringify(matches.map((p: any) => ({ id: p.id, title: p.title, status: p.status, createdAt: p.createdAt })), null, 2))
}
main().catch(err => { console.error(err); process.exit(1) })
