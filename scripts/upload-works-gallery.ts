/**
 * upload-works-gallery.ts
 *
 * Uploads up to 5 gallery images per work from _KUNST/COLLECTION CURRENT
 * to Vercel Blob at works/{category}/{slug}/gallery/{n}.jpg
 *
 * Prefers "web ready" subfolder images; falls back to raw JPGs sorted by name.
 * Skips NEF/RAW files. Converts PNG → JPEG before upload.
 *
 * Run: npx tsx scripts/upload-works-gallery.ts
 * Output: gallery arrays ready to paste into lib/data.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, readdirSync, statSync, unlinkSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const BASE = '/Users/flamant-mini/Dropbox/_KUNST/COLLECTION CURRENT'
const MAX_PER_WORK = 5

// Map from work slug → folder path relative to BASE
// Omit works that don't have good gallery material
const GALLERY_MAP: Array<{
  slug: string
  category: 'tufting' | 'embroidery' | 'painting' | 'photography'
  folder: string
  webReadySubdir?: boolean // if true, look in folder/web ready/ first
}> = [
  // Tufting
  { slug: 'purple-sun',        category: 'tufting',   folder: 'Tufting/DID-T-003_purple-sun',                     webReadySubdir: true },
  { slug: 'candy-I',           category: 'tufting',   folder: 'Tufting/DID-T-004_candy',                          webReadySubdir: true },
  { slug: 'orange-sun',        category: 'tufting',   folder: 'Tufting/DID-T-014_orange_sol_51x37',               webReadySubdir: true },
  { slug: 'rainbow-I',         category: 'tufting',   folder: 'Tufting/DID-T-018_rainbow',                        webReadySubdir: true },
  { slug: 'rainbow-II',        category: 'tufting',   folder: 'Tufting/DID-T-019_rainbow',                        webReadySubdir: true },
  { slug: 'birds',             category: 'tufting',   folder: 'Tufting/DID-T-029_birds',                          webReadySubdir: true },
  { slug: 'du-und',            category: 'tufting',   folder: 'Tufting/DID-T-039_du-und',                         webReadySubdir: true },
  { slug: 'hej',               category: 'tufting',   folder: 'Tufting/DID-T-041_hej' },
  { slug: 'liebes-panopticon', category: 'tufting',   folder: 'Tufting/DID-T-028_liebes_panopticon',              webReadySubdir: true },
  { slug: 'floral-thing',      category: 'tufting',   folder: 'Tufting/DID-T-001_firkantet_blomst_ting_34x22',    webReadySubdir: true },
  { slug: 'round-earth',       category: 'tufting',   folder: 'Tufting/DID-T-002_rund_jord_41x41',                webReadySubdir: true },
  { slug: 'jellyfish',         category: 'tufting',   folder: 'Tufting/DID-T-017_gople_56x24',                    webReadySubdir: true },
  { slug: 'tufted-mask',       category: 'tufting',   folder: 'Tufting/DID-T-023_mask_39x21',                     webReadySubdir: true },
  { slug: 'sitspot-large',     category: 'tufting',   folder: 'Tufting/DID-T-025_sitspot_large',                  webReadySubdir: true },
  { slug: 'universe-hole',     category: 'tufting',   folder: 'Tufting/DID-T-026_univers_med_hul_i_midten',       webReadySubdir: true },
  { slug: 'green-flower',      category: 'tufting',   folder: 'Tufting/DID-T-040_green-flower',                   webReadySubdir: true },
  { slug: 'pink-rug',          category: 'tufting',   folder: 'Tufting/DID-T-027_lyserødt_tæppe',                 webReadySubdir: true },
  { slug: 'bedroom-rug',       category: 'tufting',   folder: 'Tufting/DID-T-044_tæppe-på-væggen-i-soveværelset', webReadySubdir: true },

  // Embroidery
  { slug: 'fuck-alting',           category: 'embroidery', folder: 'Embroidery/DID-E-001_fuck-alting',           webReadySubdir: true },
  { slug: 'gud-har-meldt-afbud',   category: 'embroidery', folder: 'Embroidery/DID-E-002_gud-har-meldt-afbud',   webReadySubdir: true },
  { slug: 'doodles',               category: 'embroidery', folder: 'Embroidery/DID-E-005_doodles',               webReadySubdir: true },
  { slug: 'elsk',                  category: 'embroidery', folder: 'Embroidery/DID-E-006_elsk',                  webReadySubdir: true },
  { slug: 'be-a-dragon',           category: 'embroidery', folder: 'Embroidery/DID-E-007_be-a-dragon',           webReadySubdir: true },
  { slug: 'collage-bw',            category: 'embroidery', folder: 'Embroidery/DID-E-008_collage-white-black_100x70', webReadySubdir: true },
  { slug: 'apple-scraps',          category: 'embroidery', folder: 'Embroidery/DID-E-010_apple-scraps',          webReadySubdir: true },
  { slug: 'perfidt-perfekt',       category: 'embroidery', folder: 'Embroidery/DID-E-012_perfidt-perfekt',       webReadySubdir: true },
  { slug: 'ingenting',             category: 'embroidery', folder: 'Embroidery/DID-E-013_ingenting',             webReadySubdir: true },
  { slug: 'theres-nothing-here',   category: 'embroidery', folder: 'Embroidery/DID-E-015_theres-nothing-here',   webReadySubdir: true },
  { slug: 'mariann',               category: 'embroidery', folder: 'Embroidery/DID-E-016_mariann',               webReadySubdir: true },

  // Paintings
  { slug: 'universe-1',           category: 'painting', folder: 'Paintings/DID-P-003_universe-1' },
  { slug: 'universe-2',           category: 'painting', folder: 'Paintings/DID-P-009_universe-2' },
  { slug: 'universe-3',           category: 'painting', folder: 'Paintings/DID-P-017_universe-3' },
  { slug: 'blue-branch',          category: 'painting', folder: 'Paintings/DID-P-010_blue-branch' },
  { slug: 'person-walking',       category: 'painting', folder: 'Paintings/DID-P-015_person_walking' },
  { slug: 'green-on-blue',        category: 'painting', folder: 'Paintings/DID-P-004_green-on-blue-board' },
  { slug: 'colour-study',         category: 'painting', folder: 'Paintings/DID-P-008_colour-study' },
  { slug: 'universe-collection',  category: 'painting', folder: 'Paintings/DID-P-012_universe-collection' },
  { slug: 'colour-study-blue',    category: 'painting', folder: 'Paintings/DID-P-013_colour-study-blue' },
  { slug: 'sri-lanka-masks',      category: 'painting', folder: 'Paintings/DID-P-021_sri-lanka-masks' },

  // Photography
  { slug: 'view-from-the-studio',      category: 'photography', folder: 'Photography/DID-PH-002_view-from-the-studio_1500x1000' },
  { slug: 'blue-flower-on-green-wood', category: 'photography', folder: 'Photography/DID-PH-006_blue-flower-on-green-wood_1500x1000' },
  { slug: 'red-and-green-moss',        category: 'photography', folder: 'Photography/DID-PH-007_red-and-green-moss_1500x1000' },
  { slug: 'no-ordinary-stone',         category: 'photography', folder: 'Photography/DID-PH-008_no-ordinary-stone_1500x1000' },
  { slug: 'polaroids',                 category: 'photography', folder: 'Photography/DID-PH-009_polaroids_1500x1000' },
  { slug: 'on-the-light-table',        category: 'photography', folder: 'Photography/DID-PH-011_on-the-light-table_1500x1000' },
  { slug: 'dead-flowers',              category: 'photography', folder: 'Photography/DID-PH-012_dead-flowers_1500x1000' },
  { slug: 'vase-on-stool',             category: 'photography', folder: 'Photography/DID-PH-017_vase-on-stool_1500x1000' },
  { slug: 'taped-objects',             category: 'photography', folder: 'Photography/DID-PH-018_taped-objects_1500x1000' },
  { slug: 'flowers-on-linen',          category: 'photography', folder: 'Photography/DID-PH-019_flowers-on-linen_1500x1000' },
  { slug: 'purple-flower',             category: 'photography', folder: 'Photography/DID-PH-016_purple-flower_1500x1000' },
]

function findImages(folderPath: string, webReadySubdir?: boolean): string[] {
  if (!existsSync(folderPath)) return []

  // Try web ready subfolder first
  if (webReadySubdir) {
    const wrPath = resolve(folderPath, 'web ready')
    if (existsSync(wrPath)) {
      const files = readdirSync(wrPath)
        .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
        .sort()
        .map(f => resolve(wrPath, f))
      if (files.length > 0) return files
    }
  }

  // Fall back to root folder JPGs
  return readdirSync(folderPath)
    .filter(f => /\.(jpg|jpeg)$/i.test(f))
    .sort()
    .map(f => resolve(folderPath, f))
}

function toJpeg(src: string): string {
  const dest = resolve(tmpdir(), `did-gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`)
  execSync(`sips -s format jpeg -s formatOptions 82 "${src}" --out "${dest}"`, { stdio: 'pipe' })
  return dest
}

async function uploadImage(src: string, blobPath: string): Promise<string> {
  const isPng = src.toLowerCase().endsWith('.png')
  let uploadSrc = src
  let tmpPath: string | null = null

  if (isPng) {
    tmpPath = toJpeg(src)
    uploadSrc = tmpPath
  }

  const buffer = readFileSync(uploadSrc)
  const blob = await put(blobPath, buffer, {
    access: 'public',
    contentType: 'image/jpeg',
    allowOverwrite: true,
  })

  if (tmpPath) {
    try { unlinkSync(tmpPath) } catch {}
  }
  return blob.url
}

async function main() {
  console.log(`\nUploading gallery images for ${GALLERY_MAP.length} works\n`)

  const results: Record<string, string[]> = {}

  for (const work of GALLERY_MAP) {
    const folderPath = resolve(BASE, work.folder)
    const images = findImages(folderPath, work.webReadySubdir)

    if (images.length === 0) {
      console.log(`  ${work.slug}: no images found, skipping`)
      continue
    }

    const selected = images.slice(0, MAX_PER_WORK)
    const urls: string[] = []
    process.stdout.write(`  ${work.slug} (${selected.length} images): `)

    for (let i = 0; i < selected.length; i++) {
      const blobPath = `works/${work.category}/${work.slug}/gallery/${i + 1}.jpg`
      try {
        const url = await uploadImage(selected[i], blobPath)
        urls.push(url)
        process.stdout.write('✓')
      } catch (err) {
        process.stdout.write('✗')
        console.error(`  [${work.slug}/${i + 1}] ${err}`)
      }
    }
    console.log()
    if (urls.length > 0) results[work.slug] = urls
  }

  console.log('\n\n// ── Gallery arrays for lib/data.ts ───────────────────────────────\n')
  for (const [slug, urls] of Object.entries(results)) {
    const urlList = urls.map(u => `'${u}'`).join(',\n      ')
    console.log(`  // ${slug}`)
    console.log(`  gallery: [\n      ${urlList}\n  ],\n`)
  }

  console.log('\n\n// ── Summary JSON (machine-readable) ──────────────────────────────\n')
  console.log(JSON.stringify(results, null, 2))
}

main().catch(err => { console.error(err); process.exit(1) })
