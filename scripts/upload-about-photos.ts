import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const photos = [
  { src: '/tmp/about-portrait.jpg',     dest: 'about/stine-portrait.jpg' },
  { src: '/tmp/about-embroidery.jpg',   dest: 'about/stine-embroidery.jpg' },
  { src: '/tmp/about-embroidery-2.jpg', dest: 'about/stine-embroidery-2.jpg' },
]

async function main() {
  for (const { src, dest } of photos) {
    const buf = readFileSync(src)
    const blob = await put(dest, buf, { access: 'public', contentType: 'image/jpeg', allowOverwrite: true })
    console.log(`✓ ${dest} → ${blob.url}`)
  }
}

main().catch(console.error)
