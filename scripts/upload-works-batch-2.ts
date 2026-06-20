/**
 * upload-works-batch-2.ts
 *
 * Uploads main + gallery images for 8 new fine-art works + 1 gallery backfill.
 * Run: npx tsx scripts/upload-works-batch-2.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, readdirSync, existsSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const BASE = '/Users/flamant-mini/Dropbox/_KUNST/COLLECTION CURRENT'

interface WorkUpload {
  slug: string
  category: 'tufting' | 'painting' | 'embroidery'
  folder: string
  galleryOnly?: boolean  // skip main image upload
}

const WORKS: WorkUpload[] = [
  { slug: 'stripes-on-beige',    category: 'tufting',    folder: `${BASE}/Tufting/DID-T-005_striber_på_beige_22x22/web ready` },
  { slug: 'pink-rug-II',         category: 'tufting',    folder: `${BASE}/Tufting/DID-T-042_lyserødt_tæppe_2/web ready` },
  { slug: 'red-on-wood',         category: 'tufting',    folder: `${BASE}/Tufting/DID-T-043_red_on_wood_board/web ready` },
  { slug: 'bedroom-wall-rug',    category: 'tufting',    folder: `${BASE}/Tufting/DID-T-044_tæppe-på-væggen-i-soveværelset/web ready` },
  { slug: 'green-background',    category: 'painting',   folder: `${BASE}/Paintings/DID-P-001_green-background/web ready` },
  { slug: 'seb-livingroom',      category: 'painting',   folder: `${BASE}/Paintings/DID-P-016_seb-livingroom/web ready` },
  { slug: 'green-on-blue',       category: 'painting',   folder: `${BASE}/Paintings/DID-P-004_green-on-blue-board/web ready`, galleryOnly: true },
  { slug: 'gud-har-meldt-afbud-II', category: 'embroidery', folder: `${BASE}/Embroidery/DID-E-003_gud-har-meldt-afbud-2/web ready` },
  { slug: 'long-hair-dont-care', category: 'embroidery', folder: `${BASE}/Embroidery/DID-E-009_long-hair-dont-care/web ready` },
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
  const result = await put(blobPath, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false })

  if (tmpFile) unlinkSync(tmpFile)
  return result.url
}

function getImages(folder: string): string[] {
  if (!existsSync(folder)) {
    console.warn(`  Warning: folder not found: ${folder}`)
    return []
  }
  return readdirSync(folder)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .sort()
    .map(f => resolve(folder, f))
}

async function main() {
  const results: Record<string, { galleryCount: number }> = {}

  for (const work of WORKS) {
    console.log(`\n→ ${work.slug} (${work.category})${work.galleryOnly ? ' [gallery only]' : ''}`)
    const images = getImages(work.folder)
    if (images.length === 0) {
      console.log('  No images found, skipping')
      continue
    }
    console.log(`  Found ${images.length} images`)

    if (!work.galleryOnly) {
      const mainBlobPath = `works/${work.category}/${work.slug}.jpg`
      console.log(`  Uploading main → ${mainBlobPath}`)
      const url = await uploadFile(images[0], mainBlobPath)
      console.log(`  ✓ ${url}`)
    }

    const galleryImages = images.slice(0, 6)
    for (let i = 0; i < galleryImages.length; i++) {
      const blobPath = `works/${work.category}/${work.slug}/gallery/${i + 1}.jpg`
      process.stdout.write(`  Gallery ${i + 1}/${galleryImages.length}... `)
      await uploadFile(galleryImages[i], blobPath)
      console.log('✓')
    }

    results[work.slug] = { galleryCount: galleryImages.length }
  }

  console.log('\n\n=== Upload complete. data.ts additions: ===\n')
  for (const work of WORKS) {
    const r = results[work.slug]
    if (!r) continue
    if (work.galleryOnly) {
      console.log(`  // UPDATE green-on-blue: add  gallery: g('painting/green-on-blue', ${r.galleryCount})`)
      continue
    }
    console.log(`  { slug: '${work.slug}', category: '${work.category}', gallery: g('${work.category}/${work.slug}', ${r.galleryCount}) }`)
  }
}

main().catch(console.error)
