import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY = process.env.GELATO_API_KEY!

// Check the actual placeholder name used in each template type
const TEMPLATES = [
  { id: '392687cd-4959-4186-bc3a-fb135d1e0c1d', label: 'Framed Vertical' },
  { id: '992be2b6-4005-4abb-884c-9d4fa2f4affb', label: 'Framed Horizontal' },
  // Mug and postcard templates (from the previous seed scripts)
  { id: '0e9a0a04-f79a-4a09-af65-80e45c2e0acd', label: 'Mug' },
  { id: 'c608faae-a2a5-4fbe-b17e-c6e4ed1534df', label: 'Postcard' },
  { id: '1339c7ec-201f-4188-a50b-c535cb414957', label: 'Poster' },
]

async function main() {
  for (const t of TEMPLATES) {
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/templates/${t.id}`, {
      headers: { 'X-API-KEY': KEY }
    })
    const j = await r.json() as any
    const ph = j.variants?.[0]?.imagePlaceholders?.[0]?.name ?? 'NOT FOUND'
    console.log(`${t.label}: "${ph}"`)
  }
}
main().catch(console.error)
