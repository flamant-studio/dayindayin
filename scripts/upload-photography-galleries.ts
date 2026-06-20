/**
 * upload-photography-galleries.ts
 *
 * Uploads gallery images for photography works that have multiple source images.
 * Note: main images already exist in Blob. This script only uploads gallery sets.
 * Run: npx tsx scripts/upload-photography-galleries.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, readdirSync, existsSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const BASE = '/Users/flamant-mini/Dropbox/_KUNST/COLLECTION CURRENT/Photography'

const GALLERIES = [
  { slug: 'taped-objects',    folder: `${BASE}/DID-PH-018_taped-objects_1500x1000` },
  { slug: 'flowers-on-linen', folder: `${BASE}/DID-PH-019_flowers-on-linen_1500x1000` },
  { slug: 'dead-flowers',     folder: `${BASE}/DID-PH-012_dead-flowers_1500x1000` },
  { slug: 'vase-on-stool',    folder: `${BASE}/DID-PH-017_vase-on-stool_1500x1000` },
  { slug: 'purple-flower',    folder: `${BASE}/DID-PH-016_purple-flower_1500x1000` },
]

function toJpg(srcPath: string): string {
  const tmp = resolve(tmpdir(), `upload-ph-${Math.random().toString(36).slice(2)}.jpg`)
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
  const result = await put(blobPath, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false })
  if (tmpFile) unlinkSync(tmpFile)
  return result.url
}

function getImages(folder: string): string[] {
  if (!existsSync(folder)) return []
  return readdirSync(folder)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .sort()
    .map(f => resolve(folder, f))
}

async function main() {
  const counts: Record<string, number> = {}
  for (const { slug, folder } of GALLERIES) {
    console.log(`\n→ ${slug}`)
    const images = getImages(folder)
    if (images.length === 0) { console.log('  No images'); continue }
    console.log(`  ${images.length} images found`)
    const cap = Math.min(images.length, 6)
    for (let i = 0; i < cap; i++) {
      process.stdout.write(`  Gallery ${i + 1}/${cap}... `)
      await uploadFile(images[i], `works/photography/${slug}/gallery/${i + 1}.jpg`)
      console.log('✓')
    }
    counts[slug] = cap
  }
  console.log('\n=== data.ts gallery updates ===')
  for (const [slug, n] of Object.entries(counts)) {
    console.log(`  ${slug}: gallery: g('photography/${slug}', ${n})`)
  }
}

main().catch(console.error)
