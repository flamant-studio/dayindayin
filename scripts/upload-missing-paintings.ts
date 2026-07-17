/**
 * upload-missing-paintings.ts
 *
 * Two paintings confirmed missing from the site entirely (Sebastian, 2026-07-17):
 * DID-P-005_hc-andersen and DID-P-014_her-er-en-sandhed. Both folders contain a
 * single consistent piece (checked multiple photos each, no mixed-up assets).
 *
 * Run: npx tsx scripts/upload-missing-paintings.ts
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
    slug: 'hc-andersen',
    folder: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Paintings/DID-P-005_hc-andersen',
    files: [
      'web ready/_25_painting_hc-andersen_1500x1000_1.png',
      '2020-07-29 10.19.18.jpg',
      '2021-01-02 00.03.21-1.jpg',
    ],
  },
  {
    slug: 'her-er-en-sandhed',
    folder: '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Paintings/DID-P-014_her-er-en-sandhed',
    files: [
      'web ready/_214_painting_her-er-en-sandhed_1500x1000_1.png',
      '2019-09-16 11.12.11-2.jpg',
      '2019-09-16 11.12.11-3.jpg',
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
    const mainUrl = await uploadFile(resolve(work.folder, work.files[0]), `works/painting/${work.slug}.jpg`)
    console.log('main:', mainUrl)
    for (let i = 0; i < work.files.length; i++) {
      const blobPath = `works/painting/${work.slug}/gallery/${i + 1}.jpg`
      process.stdout.write(`gallery ${i + 1}/${work.files.length}... `)
      await uploadFile(resolve(work.folder, work.files[i]), blobPath)
      console.log('done')
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
