/**
 * upload-series-tile-images.ts
 *
 * "Browse by Series" (home + /collections) was sourcing tile images by
 * searching Shopify products by title keyword — this meant the tiles showed
 * whatever product happened to match, which was often a framed-print product
 * photo (Floral, Masks) or a tall composition that didn't crop well into a
 * square (NEKO showed the paw squeezed with the pendant below it, SHERO's
 * word risked being cropped). Sebastian (2026-07-17, repeat complaint):
 * this is a category nav, not a product listing — it should show iconic,
 * flat artwork that fills the square, not product mockups.
 *
 * Fix: 7 hand-picked, hand-cropped images sourced directly from the public
 * `dayindayin` artwork repo's local checkout (DayInDayIn Images/), one per
 * series, pre-cropped to fill a square with no dead space. SHERO is a
 * transparent PNG padded to a true square so the full wordmark is always
 * visible regardless of container aspect ratio (was previously at risk of
 * being cropped on the sides in a wide-oval-into-square center-crop).
 *
 * Run: npx tsx scripts/upload-series-tile-images.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const DIR = '/private/tmp/claude-501/-Users-flamant-mini/d89fb865-6dd0-4d66-a249-efbbe187c272/scratchpad/series-crops'

const FILES: Array<{ tag: string; file: string; contentType: string }> = [
  { tag: 'shero', file: 'final-shero.png', contentType: 'image/png' },
  { tag: 'neko', file: 'final-neko.jpg', contentType: 'image/jpeg' },
  { tag: 'masks', file: 'final-masks.jpg', contentType: 'image/jpeg' },
  { tag: 'botanical', file: 'final-botanical.jpg', contentType: 'image/jpeg' },
  { tag: 'floral', file: 'final-floral.jpg', contentType: 'image/jpeg' },
  { tag: 'sea-monsters', file: 'final-sea-monsters.jpg', contentType: 'image/jpeg' },
  { tag: 'tourism', file: 'final-tourism.jpg', contentType: 'image/jpeg' },
]

async function main() {
  for (const { tag, file, contentType } of FILES) {
    const data = readFileSync(resolve(DIR, file))
    const ext = contentType === 'image/png' ? 'png' : 'jpg'
    const blobPath = `works/series/${tag}.${ext}`
    const result = await put(blobPath, data, { access: 'public', contentType, addRandomSuffix: false, allowOverwrite: true })
    console.log(tag.padEnd(14), result.url)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
