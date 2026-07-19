/**
 * upload-cat-doll-poster.ts
 *
 * The homepage hero background video (video/hero-loop.mp4) shows Stine's cat-doll
 * piece, but the <video poster> fallback was ls-01.jpg - a totally unrelated
 * lifestyle photo. Replacing it with a real photo of the actual doll (2026-07-17).
 *
 * Run: npx tsx scripts/upload-cat-doll-poster.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  const data = readFileSync('/private/tmp/claude-501/-Users-flamant-mini/d89fb865-6dd0-4d66-a249-efbbe187c272/scratchpad/cat-doll-poster.jpg')
  const result = await put('lifestyle/cat-doll-poster.jpg', data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
  console.log('uploaded:', result.url)
}

main().catch((e) => { console.error(e); process.exit(1) })
