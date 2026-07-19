/**
 * upload-liebes-panopticon-fix.ts
 *
 * The existing Blob gallery for liebes-panopticon was the back/WIP of the piece
 * (main image) plus what looked like unrelated photos (gallery/1-5) — turned out
 * those ARE genuine photos of this piece, just individual components of what is a
 * multi-panel composite work, not one flat canvas. Replacing with the real
 * "web ready" curated set from Dropbox. See LOG.md 2026-07-11 for the full story.
 *
 * Run: npx tsx scripts/upload-liebes-panopticon-fix.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, existsSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const FOLDER = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Tufting/DID-T-028_liebes_panopticon/web ready'

// Ordered: hero first (the round "target/eye" disc — the clearest single motif,
// and it matches the design visible in the old back-shot), then the rest.
const FILES = [
  '2021-04-26 17.12.51.png',   // round target/eye disc — main hero
  '2021-04-26 17.17.28.png',   // round pie-wedge disc, second component
  '2021-07-06 10.25.49.png',   // full assembled piece on the floor
  '2021-06-18 10.22.35.png',   // angled detail, assembled piece
  '2021-06-18 22.49.34-4.png', // design study / painted reference
  '2021-07-15 14.46.56.png',   // in-progress, mounted on board outdoors
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
  const mainUrl = await uploadFile(resolve(FOLDER, FILES[0]), 'works/tufting/liebes-panopticon.jpg')
  console.log('  ✓', mainUrl)

  for (let i = 0; i < FILES.length; i++) {
    const blobPath = `works/tufting/liebes-panopticon/gallery/${i + 1}.jpg`
    process.stdout.write(`Gallery ${i + 1}/${FILES.length}... `)
    await uploadFile(resolve(FOLDER, FILES[i]), blobPath)
    console.log('✓')
  }

  console.log(`\nDone. gallery: g('tufting/liebes-panopticon', ${FILES.length})`)
}

main().catch((e) => { console.error(e); process.exit(1) })
