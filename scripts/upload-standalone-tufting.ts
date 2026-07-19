/**
 * upload-standalone-tufting.ts
 *
 * 4 standalone pieces confirmed missing from the site by the full Dropbox
 * sweep. Note: DID-T-024_fyrværkeri is embroidery (satin-stitch thread
 * starbursts), not tufting, despite sitting in the Tufting folder -
 * categorized correctly on the site regardless of its Dropbox location.
 *
 * Run: npx tsx scripts/upload-standalone-tufting.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const WORKS = [
  { slug: 'small-round-tricolor', category: 'tufting',    file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-006_lille_rund_hvid-blå-rød_24x21/web ready/_16_tufting_round_white_1500x1000_1.png' },
  { slug: 'fireworks',            category: 'embroidery', file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-024_fyrværkeri/web ready/_124_tufting_fyrværkeri_1500x1000_1.png' },
  { slug: 'square-flower-thing',  category: 'tufting',    file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-033_firkantet_blomst_ting_34x23/web ready/_133_tufting_firkantet_blomst_ting_34x23_1500x1000_1.png' },
  { slug: 'green-square',         category: 'tufting',    file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-015_firkantet_grøn_60x51/web ready/_115_tufting_green-square_1500x1000_1.png' },
]

function toJpg(srcPath: string): string {
  const tmp = resolve(tmpdir(), `upload-work-${Math.random().toString(36).slice(2)}.jpg`)
  execSync(`sips -s format jpeg -s formatOptions 90 "${srcPath}" --out "${tmp}"`, { stdio: 'pipe' })
  return tmp
}

async function main() {
  for (const { slug, category, file } of WORKS) {
    const tmp = toJpg(file)
    const data = readFileSync(tmp)
    unlinkSync(tmp)
    const mainUrl = await put(`works/${category}/${slug}.jpg`, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
    const galleryUrl = await put(`works/${category}/${slug}/gallery/1.jpg`, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
    console.log(slug, mainUrl.url, galleryUrl.url)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
