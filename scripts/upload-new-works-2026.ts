/**
 * upload-new-works-2026.ts
 *
 * Uploads main + gallery images for 5 new fine-art works to Vercel Blob.
 * Run: npx tsx scripts/upload-new-works-2026.ts
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
  category: 'tufting' | 'painting'
  folder: string
  webReadySubdir: string
}

const WORKS: WorkUpload[] = [
  { slug: 'bird-man',     category: 'painting', folder: `${BASE}/Paintings/DID-P-002_bird-man`,              webReadySubdir: 'web ready' },
  { slug: 'vaginals',     category: 'painting', folder: `${BASE}/Paintings/DID-P-006_vaginals`,              webReadySubdir: 'web ready' },
  { slug: 'pow',          category: 'tufting',  folder: `${BASE}/Tufting/DID-T-032_pow`,                     webReadySubdir: 'web ready' },
  { slug: 'jeweled-hand', category: 'tufting',  folder: `${BASE}/Tufting/DID-T-016_jeweled_hand_27x14`,      webReadySubdir: 'web ready' },
  { slug: 'sitspot',      category: 'tufting',  folder: `${BASE}/Tufting/DID-T-010_sitspot/_110_tufting_sitspot`, webReadySubdir: '' },
]

function toJpg(srcPath: string): string {
  const tmp = resolve(tmpdir(), `upload-${Date.now()}.jpg`)
  execSync(`sips -s format jpeg -s formatOptions 90 "${srcPath}" --out "${tmp}"`, { stdio: 'pipe' })
  return tmp
}

async function uploadFile(localPath: string, blobPath: string): Promise<string> {
  let tmpFile: string | null = null
  let filePath = localPath

  if (localPath.toLowerCase().endsWith('.png') || localPath.toLowerCase().endsWith('.dng')) {
    tmpFile = toJpg(localPath)
    filePath = tmpFile
  }

  const data = readFileSync(filePath)
  const result = await put(blobPath, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false })

  if (tmpFile) unlinkSync(tmpFile)
  return result.url
}

function getWebReadyImages(work: WorkUpload): string[] {
  const dir = work.webReadySubdir ? resolve(work.folder, work.webReadySubdir) : work.folder
  if (!existsSync(dir)) {
    console.warn(`  Warning: dir not found: ${dir}`)
    return []
  }
  return readdirSync(dir)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .sort()
    .map(f => resolve(dir, f))
}

async function main() {
  const results: Record<string, { main: string; gallery: string[] }> = {}

  for (const work of WORKS) {
    console.log(`\n→ ${work.slug}`)
    const images = getWebReadyImages(work)
    if (images.length === 0) {
      console.log('  No images found, skipping')
      continue
    }

    // Main image = first image
    const mainBlobPath = `works/${work.category}/${work.slug}.jpg`
    console.log(`  Uploading main: ${images[0].split('/').pop()}`)
    const mainUrl = await uploadFile(images[0], mainBlobPath)
    console.log(`  ✓ main: ${mainUrl}`)

    // Gallery images (all images, capped at 6)
    const galleryUrls: string[] = []
    const galleryImages = images.slice(0, 6)
    for (let i = 0; i < galleryImages.length; i++) {
      const galleryBlobPath = `works/${work.category}/${work.slug}/gallery/${i + 1}.jpg`
      console.log(`  Uploading gallery ${i + 1}: ${galleryImages[i].split('/').pop()}`)
      const url = await uploadFile(galleryImages[i], galleryBlobPath)
      galleryUrls.push(url)
      console.log(`  ✓ gallery ${i + 1}`)
    }

    results[work.slug] = { main: mainUrl, gallery: galleryUrls }
  }

  console.log('\n\n=== PASTE INTO lib/data.ts ===\n')
  for (const [slug, { gallery }] of Object.entries(results)) {
    const work = WORKS.find(w => w.slug === slug)!
    console.log(`  { slug: '${slug}', title: '${toTitle(slug)}', category: '${work.category}', year: '2021', description: '', image: \`\${BLOB}/${work.category}/${slug}.jpg\`, gallery: g('${work.category}/${slug}', ${gallery.length}) },`)
  }
}

function toTitle(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

main().catch(console.error)
