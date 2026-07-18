/**
 * upload-rainbow-variants.ts
 *
 * Full Dropbox sweep found 4 Rainbow colorway folders (DID-T-018/019/020/022).
 * Pixel-checked all 4: 018 matches the live Rainbow I exactly, 019 matches
 * the live Rainbow II exactly. 020 and 022 are genuinely new, uncatalogued
 * colorways - added as Rainbow III and IV.
 *
 * Run: npx tsx scripts/upload-rainbow-variants.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const WORKS = [
  { slug: 'rainbow-iii', file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-020_rainbow/web ready/_120_tufting_rainbow_1500x1000_1.png' },
  { slug: 'rainbow-iv',  file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-022_rainbow/web ready/_122_tufting_rainbow_1500x1000_1.png' },
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
