/**
 * upload-mixed-media.ts
 *
 * 5 finished Mixed-media pieces confirmed by the full Dropbox sweep, added
 * once the site's WorkCategory type gained a 'mixed' option (2026-07-18).
 *
 * Run: npx tsx scripts/upload-mixed-media.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const WORKS = [
  {
    slug: 'cat-doll',
    file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Mixed/DID-M-001_cat-doll/2020-07-18 15.43.11.jpg',
  },
  {
    slug: 'pink-bag',
    file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Mixed/DID-M-002_pink-bag/2019-06-29 10.02.26.dng',
  },
  {
    slug: 'polaroids-on-fabrics',
    file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Mixed/DID-M-004_polaroids-on-fabrics/2020-08-01 12.13.39.jpg',
  },
  {
    slug: 'tufting-on-embroidered-background',
    file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Mixed/DID-M-005_tufting-on-embroided-background/2020-11-24 15.12.40.jpg',
  },
  {
    slug: 'laundry-bags',
    file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Mixed/DID-M-007_laundry-bags/2020-11-28 11.07.24.jpg',
  },
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
    const mainUrl = await put(`works/mixed/${slug}.jpg`, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
    const galleryUrl = await put(`works/mixed/${slug}/gallery/1.jpg`, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
    console.log(slug, mainUrl.url, galleryUrl.url)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
