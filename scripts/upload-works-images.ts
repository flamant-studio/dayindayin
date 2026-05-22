/**
 * upload-works-images.ts
 *
 * Uploads artwork images from COLLECTION CURRENT to Vercel Blob,
 * then prints the updated lib/data.ts content.
 *
 * Run: npx tsx scripts/upload-works-images.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const BASE = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT'

const WORKS = [
  // Tufting
  { slug: 'purple-sun',        category: 'tufting',     year: '2019', title: 'Purple Sun',           file: `${BASE}/Tufting/DID-T-003_purple-sun/2019-05-27 11.47.46.jpg` },
  { slug: 'candy-I',           category: 'tufting',     year: '2021', title: 'Candy I',              file: `${BASE}/Tufting/DID-T-004_candy/2021-02-02 14.32.14-1.jpg` },
  { slug: 'orange-sun',        category: 'tufting',     year: '2021', title: 'Orange Sun',           file: `${BASE}/Tufting/DID-T-014_orange_sol_51x37/2021-02-02 15.29.25.jpg` },
  { slug: 'rainbow-I',         category: 'tufting',     year: '2021', title: 'Rainbow I',            file: `${BASE}/Tufting/DID-T-018_rainbow/2021-03-03 14.18.32.png` },
  { slug: 'birds',             category: 'tufting',     year: '2021', title: 'Birds',                file: `${BASE}/Tufting/DID-T-029_birds/2021-05-31 12.48.21.jpg` },
  { slug: 'du-und',            category: 'tufting',     year: '2021', title: 'Du und',               file: `${BASE}/Tufting/DID-T-039_du-und/2021-07-22 14.05.33.jpg` },
  { slug: 'hej',               category: 'tufting',     year: '2021', title: 'Hej',                  file: `${BASE}/Tufting/DID-T-041_hej/2021-07-12 09.35.03.jpg` },
  { slug: 'liebes-panopticon', category: 'tufting',     year: '2021', title: 'Liebes Panopticon',    file: `${BASE}/Tufting/DID-T-028_liebes_panopticon/2021-02-24 13.02.42.jpg` },
  // Embroidery
  { slug: 'fuck-alting',       category: 'embroidery',  year: '2020', title: 'Fuck Alting',          file: `${BASE}/Embroidery/DID-E-001_fuck-alting/2020-11-26 12.48.01.jpg` },
  { slug: 'gud-har-meldt-afbud', category: 'embroidery', year: '2019', title: 'Gud Har Meldt Afbud', file: `${BASE}/Embroidery/DID-E-002_gud-har-meldt-afbud/2019-06-12 07.39.28.jpg` },
  { slug: 'elsk',              category: 'embroidery',  year: '2021', title: 'Elsk',                 file: `${BASE}/Embroidery/DID-E-006_elsk/2021-03-03 15.18.50.png` },
  { slug: 'be-a-dragon',       category: 'embroidery',  year: '2021', title: 'Be a Dragon',          file: `${BASE}/Embroidery/DID-E-007_be-a-dragon/2021-03-03 15.21.56.png` },
  { slug: 'theres-nothing-here', category: 'embroidery', year: '2020', title: "There's Nothing Here", file: `${BASE}/Embroidery/DID-E-015_theres-nothing-here/2020-09-01 07.30.27-1.jpg` },
  { slug: 'mariann',           category: 'embroidery',  year: '2020', title: 'Mariann',              file: `${BASE}/Embroidery/DID-E-016_mariann/2020-06-08 13.50.05.jpg` },
  // Paintings
  { slug: 'universe-1',        category: 'painting',    year: '2021', title: 'Universe I',           file: `${BASE}/Paintings/DID-P-003_universe-1/2021-03-03 15.38.26.png` },
  { slug: 'universe-2',        category: 'painting',    year: '2021', title: 'Universe II',          file: `${BASE}/Paintings/DID-P-009_universe-2/2021-03-25 10.31.41.jpg` },
  { slug: 'universe-3',        category: 'painting',    year: '2021', title: 'Universe III',         file: `${BASE}/Paintings/DID-P-017_universe-3/2021-03-12 13.10.23.jpg` },
  { slug: 'blue-branch',       category: 'painting',    year: '2021', title: 'Blue Branch',          file: `${BASE}/Paintings/DID-P-010_blue-branch/2021-03-26 10.12.51.jpg` },
  { slug: 'person-walking',    category: 'painting',    year: '2021', title: 'Person Walking',       file: `${BASE}/Paintings/DID-P-015_person_walking/2021-04-22 09.27.47.jpg` },
  // Photography
  { slug: 'view-from-the-studio',      category: 'photography', year: '2021', title: 'View from the Studio',    file: `${BASE}/Photography/DID-PH-002_view-from-the-studio_1500x1000/_52_photo_view-from-the-studio_1500x1000_1.jpg` },
  { slug: 'blue-flower-on-green-wood', category: 'photography', year: '2021', title: 'Blue Flower on Green Wood', file: `${BASE}/Photography/DID-PH-006_blue-flower-on-green-wood_1500x1000/_56_photo_blue-flower-on-green-wood_1500x1000_1.png` },
  { slug: 'red-and-green-moss',        category: 'photography', year: '2021', title: 'Red and Green Moss',      file: `${BASE}/Photography/DID-PH-007_red-and-green-moss_1500x1000/_57_photo_red-and-green-moss_1500x1000_3.png` },
  { slug: 'no-ordinary-stone',         category: 'photography', year: '2021', title: 'No Ordinary Stone',       file: `${BASE}/Photography/DID-PH-008_no-ordinary-stone_1500x1000/_58_photo_no-ordinary-stone_1500x1000_1.png` },
  { slug: 'taped-objects',             category: 'photography', year: '2021', title: 'Taped Objects',           file: `${BASE}/Photography/DID-PH-018_taped-objects_1500x1000/_518_photo_taped-objects_1500x1000_5.png` },
  { slug: 'flowers-on-linen',          category: 'photography', year: '2021', title: 'Flowers on Linen',        file: `${BASE}/Photography/DID-PH-019_flowers-on-linen_1500x1000/_519_photo_flowers-on-linen_1500x1000_3.png` },
]

const DESCRIPTIONS: Record<string, string> = {
  tufting: 'Hand-tufted wool on canvas.',
  embroidery: 'Embroidery on fabric.',
  painting: 'Mixed media on canvas.',
  photography: 'Fine art photograph.',
}

function toJpeg(src: string, dest: string) {
  execSync(`sips -s format jpeg -s formatOptions 85 "${src}" --out "${dest}"`, { stdio: 'pipe' })
}

async function upload(work: typeof WORKS[0]): Promise<string> {
  const isPng = work.file.toLowerCase().endsWith('.png')
  let uploadPath = work.file
  let tmpPath: string | null = null

  if (isPng) {
    tmpPath = resolve(tmpdir(), `did-work-${Date.now()}.jpg`)
    toJpeg(work.file, tmpPath)
    uploadPath = tmpPath
  }

  const buffer = readFileSync(uploadPath)
  const mb = (buffer.length / 1024 / 1024).toFixed(1)
  process.stdout.write(`${mb}MB... `)

  const blob = await put(`works/${work.category}/${work.slug}.jpg`, buffer, {
    access: 'public',
    contentType: 'image/jpeg',
    allowOverwrite: true,
  })

  if (tmpPath) unlinkSync(tmpPath)
  return blob.url
}

async function main() {
  console.log(`Uploading ${WORKS.length} artwork images to Vercel Blob\n`)

  const results: Array<typeof WORKS[0] & { url: string }> = []

  for (const work of WORKS) {
    process.stdout.write(`  ${work.slug}: `)
    try {
      const url = await upload(work)
      results.push({ ...work, url })
      console.log('✓')
    } catch (err) {
      console.error(`FAILED — ${err}`)
    }
  }

  console.log('\n\n// ── Generated lib/data.ts works array ──────────────────────────\n')
  console.log('export const works: Work[] = [')
  for (const r of results) {
    const desc = DESCRIPTIONS[r.category]
    console.log(`  { slug: "${r.slug}", title: "${r.title}", category: "${r.category}", year: "${r.year}", description: "${desc}", image: "${r.url}" },`)
  }
  console.log(']')
}

main().catch(err => { console.error(err); process.exit(1) })
