/**
 * upload-universe-2-fix.ts
 *
 * The old main image was an extreme detail crop with a harsh diagonal shadow
 * cast across it (someone's arm), no context of the whole canvas. The Dropbox
 * folder's "web ready" set also mixes in images from at least one different,
 * unrelated painting and one photo of someone's fingers holding a paint chip
 * (not the artwork at all) - excluded those. Using the images that visibly
 * match the same yellow/teal/pink/green canvas.
 *
 * Run: npx tsx scripts/upload-universe-2-fix.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, existsSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const FOLDER = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Paintings/DID-P-009_universe-2/web ready'

// 1 = full canvas on the work table (best available whole-piece shot); 2, 4, 5 = clean
// detail crops confirmed matching the same canvas. Skipped: 3 (a photo of paint-stained
// fingers, not the artwork), 7 and 10 (visibly different, unrelated paintings mixed into
// this folder).
const FILES = [
  '_29_painting_universe-2_1500x1000_1.png',
  '_29_painting_universe-2_1500x1000_2.png',
  '_29_painting_universe-2_1500x1000_4.png',
  '_29_painting_universe-2_1500x1000_5.png',
]

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

async function main() {
  if (!existsSync(FOLDER)) {
    console.error('Folder not found:', FOLDER)
    process.exit(1)
  }

  console.log('Uploading main image...')
  const mainUrl = await uploadFile(resolve(FOLDER, FILES[0]), 'works/painting/universe-2.jpg')
  console.log('  ✓', mainUrl)

  for (let i = 0; i < FILES.length; i++) {
    const blobPath = `works/painting/universe-2/gallery/${i + 1}.jpg`
    process.stdout.write(`Gallery ${i + 1}/${FILES.length}... `)
    await uploadFile(resolve(FOLDER, FILES[i]), blobPath)
    console.log('✓')
  }

  console.log(`\nDone. gallery: g('painting/universe-2', ${FILES.length})`)
}

main().catch((e) => { console.error(e); process.exit(1) })
