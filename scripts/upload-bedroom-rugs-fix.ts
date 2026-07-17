/**
 * upload-bedroom-rugs-fix.ts
 *
 * bedroom-rug.jpg was a watermarked/captioned promo image ("Solen og månens
 * land") — a different, unrelated-looking asset, flagged as broken in
 * ISSUES.md UX-15. Turns out bedroom-rug and bedroom-wall-rug are the same
 * physical piece (Dropbox DID-T-044_tæppe-på-væggen-i-soveværelset — "the
 * rug on the wall in the bedroom"), just two site catalog entries. Sebastian
 * confirmed via message (2026-07-17): pick something reasonable for one or
 * both, not worth resolving the catalog-duplication question right now.
 *
 * Fix: clean, unwatermarked photos from the same folder for both slugs,
 * different lead image + ordering per slug so they aren't pixel-identical.
 *
 * Run: npx tsx scripts/upload-bedroom-rugs-fix.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, existsSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const FOLDER = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-044_tæppe-på-væggen-i-soveværelset/web ready'

const NAMES = {
  flatlay: '_144_tufting_tæppe-på-væggen-i-soveværelset_1500x1000_2.png', // clean flat lay, no watermark
  onWall:  '_144_tufting_tæppe-på-væggen-i-soveværelset_1500x1000_5.png', // hung on an actual wall
  fold:    '_144_tufting_tæppe-på-væggen-i-soveværelset_1500x1000_1.png', // off-loom fold, process
  chair:   '_144_tufting_tæppe-på-væggen-i-soveværelset_1500x1000_6.png', // draped on a chair, lifestyle
  detail:  '_144_tufting_tæppe-på-væggen-i-soveværelset_1500x1000_3.png', // stars/moon detail crop
  macro:   '_144_tufting_tæppe-på-væggen-i-soveværelset_1500x1000_4.png', // macro texture
}

const BEDROOM_WALL_RUG = [NAMES.flatlay, NAMES.onWall, NAMES.fold, NAMES.chair, NAMES.detail, NAMES.macro]
const BEDROOM_RUG = [NAMES.chair, NAMES.fold, NAMES.onWall, NAMES.detail, NAMES.macro]

function toJpg(srcPath: string): string {
  const tmp = resolve(tmpdir(), `upload-work-${Math.random().toString(36).slice(2)}.jpg`)
  execSync(`sips -s format jpeg -s formatOptions 90 "${srcPath}" --out "${tmp}"`, { stdio: 'pipe' })
  return tmp
}

async function uploadFile(localPath: string, blobPath: string): Promise<string> {
  let tmpFile: string | null = null
  let filePath = localPath
  if (/\.(png|dng)$/i.test(localPath)) {
    tmpFile = toJpg(localPath)
    filePath = tmpFile
  }
  const data = readFileSync(filePath)
  const result = await put(blobPath, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
  if (tmpFile) unlinkSync(tmpFile)
  return result.url
}

async function uploadSet(slug: string, files: string[]) {
  console.log(`\n=== ${slug} ===`)
  const mainUrl = await uploadFile(resolve(FOLDER, files[0]), `works/tufting/${slug}.jpg`)
  console.log('main:', mainUrl)
  for (let i = 0; i < files.length; i++) {
    const blobPath = `works/tufting/${slug}/gallery/${i + 1}.jpg`
    process.stdout.write(`gallery ${i + 1}/${files.length}... `)
    await uploadFile(resolve(FOLDER, files[i]), blobPath)
    console.log('done')
  }
}

async function main() {
  if (!existsSync(FOLDER)) {
    console.error('Folder not found:', FOLDER)
    process.exit(1)
  }
  await uploadSet('bedroom-wall-rug', BEDROOM_WALL_RUG)
  await uploadSet('bedroom-rug', BEDROOM_RUG)
  console.log('\nDone. gallery counts: bedroom-wall-rug=6, bedroom-rug=5 (both already match lib/data.ts).')
}

main().catch((e) => { console.error(e); process.exit(1) })
