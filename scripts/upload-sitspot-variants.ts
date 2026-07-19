/**
 * upload-sitspot-variants.ts
 *
 * Sweep found the "Sitspot" family has (at least) 3 distinct physical
 * colorways, but the site only showed one. Adding the other 2:
 * - DID-T-012 (mustard/purple/sage-green/blue) - DID-T-011 is a duplicate
 *   photo session of the same piece, not used.
 * - DID-T-013 (purple/teal/red/yellow, actually 74x44cm)
 *
 * Also: the live "sitspot-large" entry's photo is correctly sourced from
 * DID-T-025, but its "74x44 cm" dimension is wrong - that number belongs
 * to DID-T-013 (a different, separate piece), not this one. Fixed
 * separately in lib/data.ts (dimension removed, not guessed).
 *
 * Run: npx tsx scripts/upload-sitspot-variants.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const WORKS = [
  {
    slug: 'sitspot-ii',
    file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-012_sitspot/web ready/_112_tufting_sitspot_1500x1000_1.png',
  },
  {
    slug: 'sitspot-iii',
    file: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-013_sitspot_74x44/web ready/_113_tufting_sitspot_1500x1000_1.png',
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
    const mainUrl = await put(`works/tufting/${slug}.jpg`, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
    const galleryUrl = await put(`works/tufting/${slug}/gallery/1.jpg`, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
    console.log(slug, mainUrl.url, galleryUrl.url)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
