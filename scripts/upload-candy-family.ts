/**
 * upload-candy-family.ts
 *
 * 7 distinct "Candy" tufted pieces confirmed by the full Dropbox sweep -
 * the site's existing "Candy I" is sourced from a different, separate
 * piece not among these 7 (per the sweep's pixel comparison against the
 * DID-T-035 group reference shot). All 7 verified visually distinct from
 * each other before upload (different shapes: lollipop, candy cane, ring,
 * round jewel; different colorways).
 *
 * Run: npx tsx scripts/upload-candy-family.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const WORKS = [
  { slug: 'candy-ii',   file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-004_candy/web ready/_14_tufting_candy_1500x1000_1.png' },
  { slug: 'candy-iii',  file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-007_candy/2021-02-02 14.46.58.jpg' },
  { slug: 'candy-iv',   file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-030_candy_26x24/web ready/_130_tufting_candy_26x24_1500x1000_1.png' },
  { slug: 'candy-v',    file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-031_candy/web ready/_131_tufting_candy_1500x1000_1.png' },
  { slug: 'candy-vi',   file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-034_candy/web ready/_134_tufting_candy_1500x1000_1.png' },
  { slug: 'candy-cane', file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-036_candy/web ready/_136_tufting_candy_1500x1000_1.png' },
  { slug: 'candy-vii',  file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-037_candy/web ready/_137_tufting_candy_1500x1000_1.png' },
]

function toJpg(srcPath: string): string {
  const tmp = resolve(tmpdir(), `upload-work-${Math.random().toString(36).slice(2)}.jpg`)
  execSync(`sips -s format jpeg -s formatOptions 90 "${srcPath}" --out "${tmp}"`, { stdio: 'pipe' })
  return tmp
}

async function main() {
  for (const { slug, file } of WORKS) {
    const tmp = toJpg(file)
    const data = readFileSync(tmp)
    unlinkSync(tmp)
    const mainUrl = await put(`works/tufting/${slug}.jpg`, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
    const galleryUrl = await put(`works/tufting/${slug}/gallery/1.jpg`, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
    console.log(slug, mainUrl.url, galleryUrl.url)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
