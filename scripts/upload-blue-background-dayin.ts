/**
 * upload-blue-background-dayin.ts
 *
 * DID-P-019 was used for the About page brand-mark collage, but never got
 * its own fine-art catalog entry (2026-07-18 sweep flagged it as "missing").
 *
 * Run: npx tsx scripts/upload-blue-background-dayin.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  const data = readFileSync('/private/tmp/claude-501/-Users-flamant-mini/d89fb865-6dd0-4d66-a249-efbbe187c272/scratchpad/blue-background-dayin.jpg')
  const main = await put('works/painting/blue-background-dayin.jpg', data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
  const gal = await put('works/painting/blue-background-dayin/gallery/1.jpg', data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
  console.log(main.url, gal.url)
}

main().catch((e) => { console.error(e); process.exit(1) })
