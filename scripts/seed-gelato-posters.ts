import * as dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const KEY      = process.env.GELATO_API_KEY!
const STORE    = '51ee1b39-75e6-4c19-af02-cfd7cb771a4a'
const TEMPLATE = '1339c7ec-201f-4188-a50b-c535cb414957'
const BLOB     = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'
// Placeholder name as defined in Gelato template
const PH_NAME  = 'nekopaw_yellow_neon.png'

function desc(artwork: string) {
  return `<p>Premium semi-glossy paper poster featuring <em>${artwork}</em> by Stine Weirsøe Flamant.</p>
<ul>
<li>200gsm semi-glossy FSC-certified paper</li>
<li>Available in A3, A2, and A1</li>
<li>Vivid color reproduction, fade-resistant</li>
<li>Printed and shipped on demand by Gelato</li>
<li>Ships to EU, UK, and Norway within 3–7 business days</li>
</ul>`
}

const PRODUCTS = [
  {
    title: 'Neko Paw — Yellow (Poster)',
    tags: ['neko', 'cat', 'yellow', 'poster'],
    fileUrl: `${BLOB}/gelato/neko/nekopaw_yellow_outline.png`,
  },
  {
    title: 'Neko Paw — Yellow Neon (Poster)',
    tags: ['neko', 'cat', 'yellow', 'neon', 'poster'],
    fileUrl: `${BLOB}/gelato/neko/nekopaw_yellow_neon.png`,
  },
  {
    title: 'Neko Paw — Yellow & Blue (Poster)',
    tags: ['neko', 'cat', 'yellow', 'blue', 'poster'],
    fileUrl: `${BLOB}/gelato/neko/nekopaw_yellow_blue.png`,
  },
  {
    title: 'Neko Paw — Pink (Poster)',
    tags: ['neko', 'cat', 'pink', 'poster'],
    fileUrl: `${BLOB}/gelato/neko/nekopaw_pink_outline.png`,
  },
  {
    title: 'Neko Paw — Lilac (Poster)',
    tags: ['neko', 'cat', 'lilac', 'purple', 'poster'],
    fileUrl: `${BLOB}/gelato/neko/nekopaw_lilac_outline.png`,
  },
  {
    title: 'Sheroshine (Poster)',
    tags: ['shero', 'feminist', 'poster'],
    fileUrl: `${BLOB}/gelato/framed-vertical/sheroshine.jpg`,
  },
  {
    title: 'Strong Floral (Poster)',
    tags: ['floral', 'botanical', 'poster'],
    fileUrl: `${BLOB}/gelato/framed-vertical/strong-floral.jpg`,
  },
]

async function createProduct(title: string, tags: string[], fileUrl: string): Promise<string> {
  const bare = title.replace(' (Poster)', '')
  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${STORE}/products:create-from-template`,
    {
      method: 'POST',
      headers: { 'X-API-KEY': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: TEMPLATE,
        title,
        description: desc(bare),
        tags,
        imagePlaceholders: [{ name: PH_NAME, fileUrl }],
      }),
    }
  )
  const json = await res.json() as any
  if (!res.ok) throw new Error(`Create failed: ${JSON.stringify(json).slice(0, 200)}`)
  return json.id as string
}

async function main() {
  console.log(`Seeding ${PRODUCTS.length} poster products from template ${TEMPLATE}...\n`)
  for (const p of PRODUCTS) {
    process.stdout.write(`  ▸ ${p.title}... `)
    const id = await createProduct(p.title, p.tags, p.fileUrl)
    console.log(`✓ ${id}`)
    await new Promise(r => setTimeout(r, 500))
  }
  console.log('\n✅ Done. Gelato will generate mockups asynchronously.')
}

main().catch(err => { console.error(err); process.exit(1) })
