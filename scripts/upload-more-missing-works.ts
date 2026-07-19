/**
 * upload-more-missing-works.ts
 *
 * 3 more pieces confirmed missing from the site by the full _KUNST sweep
 * (2026-07-17). Fantasy (painting) and det-er-bare-tanker (embroidery) only
 * have one photo each in Dropbox - single-image works. Red-to-blue broderi
 * has 6 web-ready crops, used 3.
 *
 * Deliberately NOT included: DID-E-004_stranger-things - an embroidered
 * reproduction of Netflix's trademarked "Stranger Things" show logo. Adding
 * a third-party trademark to a commercial print/art site is a real legal
 * risk, flagged to Sebastian rather than published.
 *
 * Run: npx tsx scripts/upload-more-missing-works.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, existsSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const WORKS = [
  {
    slug: 'fantasy',
    category: 'painting',
    folder: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Paintings/DID-P-007_fantasy',
    files: ['web ready/_27_painting_fantasy_1500x1000_1.png'],
  },
  {
    slug: 'det-er-bare-tanker',
    category: 'embroidery',
    folder: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Embroidery/DID-E-011_det-er-bare-tanker',
    files: ['web ready/_311_embroidery_det-er-bare-tanker_1500x1000_1.png'],
  },
  {
    slug: 'red-to-blue-broderi',
    category: 'embroidery',
    folder: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Embroidery/DID-E-014_red-to-blue broderi',
    files: [
      'web ready/_314_embroidery_red-to-blue broderi_1500x1000_1.png',
      'web ready/_314_embroidery_red-to-blue broderi_1500x1000_3.png',
      'web ready/_314_embroidery_red-to-blue broderi_1500x1000_5.png',
    ],
  },
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
  for (const work of WORKS) {
    if (!existsSync(work.folder)) {
      console.error('Folder not found:', work.folder)
      continue
    }
    console.log(`\n=== ${work.slug} ===`)
    const mainUrl = await uploadFile(resolve(work.folder, work.files[0]), `works/${work.category}/${work.slug}.jpg`)
    console.log('main:', mainUrl)
    for (let i = 0; i < work.files.length; i++) {
      const blobPath = `works/${work.category}/${work.slug}/gallery/${i + 1}.jpg`
      process.stdout.write(`gallery ${i + 1}/${work.files.length}... `)
      await uploadFile(resolve(work.folder, work.files[i]), blobPath)
      console.log('done')
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
