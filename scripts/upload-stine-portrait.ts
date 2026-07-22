/**
 * upload-stine-portrait.ts
 *
 * Fixes about/stine-portrait.jpg, which was live as a scan of painted paper
 * (colour-wash test) — not a photo of Stine at all. Sebastian's replacement:
 * her reflection in a studio window, framed by a blossom branch, shot
 * 2021-04-21. Cropped to the About page's 3:4 portrait slot, centred on the
 * reflection rather than the window-sill still life.
 *
 * Run: npx tsx scripts/upload-stine-portrait.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const SRC = '/private/tmp/claude-501/-Users-flamant-mini/d89fb865-6dd0-4d66-a249-efbbe187c272/scratchpad/preview/portrait-crop-v1.jpg'

async function main() {
  const data = readFileSync(SRC)
  const result = await put('about/stine-portrait.jpg', data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
  console.log('uploaded:', result.url)
}

main().catch((e) => { console.error(e); process.exit(1) })
