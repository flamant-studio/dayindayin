import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY   = process.env.GELATO_API_KEY!
const STORE = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'

const IDS = [
  '2f27caf7-ed3e-4d42-b43d-ea664f43419f', // Elephant Red — Framed
  'aacbefeb-133f-4ff2-8466-f423945adde5', // Elephant Lilac — Framed
  '30fad206-1b77-42e9-8d87-bf42ccaf6def', // Elephant Yellow — Framed
  '83f17886-c2a8-4826-9d8c-63583adeedb6', // Elephant Green — Framed
  '5b30c43a-77bb-460c-9744-64616f75c243', // Tourism IV — Framed
  '0fb9d065-bcec-41cc-8d4f-bbbbff79efea', // Tourism III — Framed
  '92f69101-c81b-4980-993e-b0b06dfb8836', // Tourism II — Framed
  '2a2916e8-0a0f-4601-b8d6-350bd4aa3b58', // Tourism I — Framed
]

async function main() {
  console.log('Deleting 8 broken horizontal framed products...')
  for (const id of IDS) {
    process.stdout.write(`  DELETE ${id}... `)
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${id}`, {
      method: 'DELETE',
      headers: { 'X-API-KEY': KEY },
    })
    console.log(r.ok || r.status === 404 ? '✓' : `✗ ${r.status}`)
  }
  console.log('Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
