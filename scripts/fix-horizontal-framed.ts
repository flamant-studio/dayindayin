import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY      = process.env.GELATO_API_KEY!
const STORE    = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const TEMPLATE = '992be2b6-4005-4abb-884c-9d4fa2f4affb'
const PH_NAME  = 'Untitled_Artwork 4.png'
const BLOB     = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

const DELETE_IDS = [
  '6356aed8-d7a9-46a6-92a3-84f2196b51c2', // Tourism I — Framed
  '67586cae-13ef-4610-a705-70cff495b150', // Tourism II — Framed
  'e7c9c519-8208-477e-bfc6-82e182076775', // Tourism III — Framed
  '22bec91b-8df8-4437-b389-7d50a0af3b08', // Tourism IV — Framed
  '0615373c-10d4-4503-a744-1132e7feb032', // Elephant Green — Framed
  '79aac44e-1be3-4530-bb3f-e50a92a531ac', // Elephant Yellow — Framed
  '9c3ddf07-5fd3-4fbd-822d-6bbba64a1336', // Elephant Lilac — Framed
  '45eabb9c-9073-4385-be9a-4b1e537317ab', // Elephant Red — Framed
]

function desc(title: string) {
  const bare = title.replace(' — Framed', '')
  return `<p>Fine art giclée print of Stine Weirsøe Flamant's <em>${bare}</em>, mounted in a premium wooden frame with museum-quality matte archival paper.</p>
<ul>
<li>Available in A5, A4, and A3 landscape</li>
<li>Frame options: white, natural wood, black</li>
<li>250gsm archival matte paper</li>
<li>Plexiglass front — ready to hang</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 5–10 business days</li>
</ul>`
}

const PRODUCTS = [
  { title: 'Tourism I — Framed',       tags: ['tourism', 'photography', 'art-print', 'framed'], fileUrl: `${BLOB}/gelato/tourism/tourism-1.jpg` },
  { title: 'Tourism II — Framed',      tags: ['tourism', 'photography', 'art-print', 'framed'], fileUrl: `${BLOB}/gelato/tourism/tourism-2.jpg` },
  { title: 'Tourism III — Framed',     tags: ['tourism', 'photography', 'art-print', 'framed'], fileUrl: `${BLOB}/gelato/tourism/tourism-3.jpg` },
  { title: 'Tourism IV — Framed',      tags: ['tourism', 'photography', 'art-print', 'framed'], fileUrl: `${BLOB}/gelato/tourism/tourism-4.jpg` },
  { title: 'Elephant Green — Framed',  tags: ['elephant', 'green', 'art-print', 'framed'],      fileUrl: `${BLOB}/gelato/elephants/elephant-green.jpg` },
  { title: 'Elephant Yellow — Framed', tags: ['elephant', 'yellow', 'art-print', 'framed'],     fileUrl: `${BLOB}/gelato/elephants/elephant-yellow.jpg` },
  { title: 'Elephant Lilac — Framed',  tags: ['elephant', 'lilac', 'purple', 'art-print', 'framed'], fileUrl: `${BLOB}/gelato/elephants/elephant-lilac.jpg` },
  { title: 'Elephant Red — Framed',    tags: ['elephant', 'red', 'art-print', 'framed'],        fileUrl: `${BLOB}/gelato/elephants/elephant-red.jpg` },
]

async function main() {
  console.log('Step 1: Deleting 8 broken horizontal framed products...')
  for (const id of DELETE_IDS) {
    process.stdout.write(`  DELETE ${id}... `)
    const r = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products/${id}`, {
      method: 'DELETE',
      headers: { 'X-API-KEY': KEY },
    })
    console.log(r.ok || r.status === 404 ? '✓' : `✗ ${r.status}`)
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\nStep 2: Recreating with correct placeholder name "${PH_NAME}"...`)
  for (const p of PRODUCTS) {
    process.stdout.write(`  ▸ ${p.title}... `)
    const res = await fetch(
      `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products:create-from-template`,
      {
        method: 'POST',
        headers: { 'X-API-KEY': KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: TEMPLATE,
          title: p.title,
          description: desc(p.title),
          tags: p.tags,
          imagePlaceholders: [{ name: PH_NAME, fileUrl: p.fileUrl }],
        }),
      }
    )
    const json = await res.json() as any
    if (!res.ok) {
      console.log(`✗ ${JSON.stringify(json).slice(0, 120)}`)
    } else {
      console.log(`✓ ${json.id}`)
    }
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n✅ Done. Gelato will generate correct mockups asynchronously.')
}

main().catch(err => { console.error(err); process.exit(1) })
