/**
 * upload-photography-loop10.ts
 * Tasks 01-03: 4 new photography works + gallery backfills
 * Run: npx tsx scripts/upload-photography-loop10.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, readdirSync, existsSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const PHOTO_BASE = '/Users/flamant-mini/Dropbox/_KUNST/COLLECTION CURRENT/Photography'

// 4 new works to add
const NEW_WORKS = [
  {
    slug: 'purple-fabric-in-garden',
    folder: `${PHOTO_BASE}/DID-PH-001_purple-fabric-in-garden/web ready`,
  },
  {
    slug: 'smorrebrod',
    folder: `${PHOTO_BASE}/DID-PH-013_smørrebrød_1500x1000`,
  },
  {
    slug: 'yarn',
    folder: `${PHOTO_BASE}/DID-PH-014_yarn_1500x1000`,
  },
  {
    slug: 'office-shot',
    folder: `${PHOTO_BASE}/DID-PH-015_office-shot_1500x1000`,
  },
]

// Gallery-only backfills for works with single image (same image as gallery/1)
const GALLERY_BACKFILLS = [
  { slug: 'red-and-green-moss',   folder: `${PHOTO_BASE}/DID-PH-007_red-and-green-moss_1500x1000` },
  { slug: 'blue-flower-on-green-wood', folder: `${PHOTO_BASE}/DID-PH-006_blue-flower-on-green-wood_1500x1000` },
  { slug: 'no-ordinary-stone',    folder: `${PHOTO_BASE}/DID-PH-008_no-ordinary-stone_1500x1000` },
  { slug: 'polaroids',            folder: `${PHOTO_BASE}/DID-PH-009_polaroids_1500x1000` },
  { slug: 'on-the-light-table',   folder: `${PHOTO_BASE}/DID-PH-011_on-the-light-table_1500x1000` },
]

function toJpg(src: string): string {
  const tmp = resolve(tmpdir(), `up-ph-${Date.now()}.jpg`)
  execSync(`sips -s format jpeg -s formatOptions 90 "${src}" --out "${tmp}"`, { stdio: 'pipe' })
  return tmp
}

async function uploadFile(local: string, blobPath: string): Promise<string> {
  let tmp: string | null = null
  let path = local
  if (/\.(png|tiff?|nef|dng)$/i.test(local)) {
    tmp = toJpg(local)
    path = tmp
  }
  const data = readFileSync(path)
  const r = await put(blobPath, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false })
  if (tmp) unlinkSync(tmp)
  console.log(`  ✓ ${blobPath}`)
  return r.url
}

function listImages(folder: string): string[] {
  if (!existsSync(folder)) { console.log(`  ⚠ folder missing: ${folder}`); return [] }
  return readdirSync(folder)
    .filter(f => /\.(png|jpg|jpeg|tiff?|nef)$/i.test(f))
    .sort()
    .map(f => resolve(folder, f))
}

async function main() {
  const counts: Record<string, number> = {}

  console.log('\n=== NEW WORKS ===')
  for (const { slug, folder } of NEW_WORKS) {
    console.log(`\n→ ${slug}`)
    const images = listImages(folder)
    if (!images.length) { console.log('  No images found'); continue }
    // Upload main image
    await uploadFile(images[0], `works/photography/${slug}.jpg`)
    // Upload gallery images (all images as gallery)
    const cap = Math.min(images.length, 6)
    for (let i = 0; i < cap; i++) {
      await uploadFile(images[i], `works/photography/${slug}/gallery/${i + 1}.jpg`)
    }
    counts[slug] = cap
  }

  console.log('\n=== GALLERY BACKFILLS ===')
  for (const { slug, folder } of GALLERY_BACKFILLS) {
    console.log(`\n→ ${slug}`)
    const images = listImages(folder)
    if (!images.length) { console.log('  No images found'); continue }
    const cap = Math.min(images.length, 6)
    for (let i = 0; i < cap; i++) {
      await uploadFile(images[i], `works/photography/${slug}/gallery/${i + 1}.jpg`)
    }
    counts[slug + ' (gallery)'] = cap
  }

  console.log('\n=== SUMMARY ===')
  for (const [k, n] of Object.entries(counts)) {
    console.log(`  ${k}: ${n} images`)
  }
}

main().catch(console.error)
