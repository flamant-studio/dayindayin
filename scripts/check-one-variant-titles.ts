import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
const KEY = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
async function main() {
  const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/d800a2ab-a8e6-4ae8-8e30-30d3746d619f`, { headers: { 'X-API-KEY': KEY } })
  const j = await r.json() as any
  console.log('Rabbit tote variants:', JSON.stringify(j.variants?.map((v:any)=>v.title)))
}
main()
