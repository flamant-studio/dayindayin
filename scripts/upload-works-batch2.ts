/**
 * upload-works-batch2.ts — second batch of Fine Art works
 * Run: npx tsx scripts/upload-works-batch2.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const BASE = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT'
const BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works'

const WORKS = [
  // Tufting
  { slug: 'floral-thing',    cat: 'tufting',    year: '2021', title: 'Floral Thing',           file: `${BASE}/Tufting/DID-T-001_firkantet_blomst_ting_34x22/2021-02-02 14.21.37-2.jpg` },
  { slug: 'round-earth',     cat: 'tufting',    year: '2021', title: 'Round Earth',             file: `${BASE}/Tufting/DID-T-002_rund_jord_41x41/2021-02-02 15.01.53.jpg` },
  { slug: 'fleur-de-lys',    cat: 'tufting',    year: '2021', title: 'Fleur de Lys',            file: `${BASE}/Tufting/DID-T-008_fleur_de_lys_37x27/2021-02-02 14.53.40.jpg` },
  { slug: 'jellyfish',       cat: 'tufting',    year: '2021', title: 'Jellyfish',               file: `${BASE}/Tufting/DID-T-017_gople_56x24/2021-03-03 14.15.04.png` },
  { slug: 'rainbow-II',      cat: 'tufting',    year: '2021', title: 'Rainbow II',              file: `${BASE}/Tufting/DID-T-019_rainbow/2021-03-03 14.25.10.png` },
  { slug: 'tufted-mask',     cat: 'tufting',    year: '2021', title: 'Tufted Mask',             file: `${BASE}/Tufting/DID-T-023_mask_39x21/2021-03-03 14.42.15.png` },
  { slug: 'sitspot-large',   cat: 'tufting',    year: '2021', title: 'Sitspot Large',           file: `${BASE}/Tufting/DID-T-025_sitspot_large/2021-03-03 16.01.06.png` },
  { slug: 'universe-hole',   cat: 'tufting',    year: '2021', title: 'Universe with a Hole',   file: `${BASE}/Tufting/DID-T-026_univers_med_hul_i_midten/2021-03-03 16.18.34.png` },
  { slug: 'green-flower',    cat: 'tufting',    year: '2021', title: 'Green Flower',            file: `${BASE}/Tufting/DID-T-040_green-flower/2021-05-14 10.20.17.jpg` },
  { slug: 'pink-rug',        cat: 'tufting',    year: '2020', title: 'Pink Rug',               file: `${BASE}/Tufting/DID-T-042_lyserødt_tæppe_2/2020-06-08 11.36.36.jpg` },
  { slug: 'bedroom-rug',     cat: 'tufting',    year: '2020', title: 'Bedroom Rug',             file: `${BASE}/Tufting/DID-T-044_tæppe-på-væggen-i-soveværelset/2020-05-29 10.00.38.png` },
  // Embroidery
  { slug: 'doodles',         cat: 'embroidery', year: '2021', title: 'Doodles',                file: `${BASE}/Embroidery/DID-E-005_doodles/#23 16x21.png` },
  { slug: 'collage-bw',      cat: 'embroidery', year: '2021', title: 'Collage (Black & White)', file: `${BASE}/Embroidery/DID-E-008_collage-white-black_100x70/2021-03-03 15.51.27.png` },
  { slug: 'apple-scraps',    cat: 'embroidery', year: '2020', title: 'Apple Scraps',           file: `${BASE}/Embroidery/DID-E-010_apple-scraps/2020-11-26 12.48.50.jpg` },
  { slug: 'perfidt-perfekt', cat: 'embroidery', year: '2021', title: 'Perfidt Perfekt',        file: `${BASE}/Embroidery/DID-E-012_perfidt-perfekt/2021-05-07 12.22.39.jpg` },
  { slug: 'ingenting',       cat: 'embroidery', year: '2020', title: 'Ingenting',              file: `${BASE}/Embroidery/DID-E-013_ingenting/2020-08-01 12.03.35.jpg` },
  // Paintings
  { slug: 'green-on-blue',        cat: 'painting', year: '2021', title: 'Green on Blue',       file: `${BASE}/Paintings/DID-P-004_green-on-blue-board/2021-03-03 15.43.55.png` },
  { slug: 'colour-study',         cat: 'painting', year: '2020', title: 'Colour Study',        file: `${BASE}/Paintings/DID-P-008_colour-study/2020-07-04 08.38.37-2.jpg` },
  { slug: 'universe-collection',  cat: 'painting', year: '2021', title: 'Universe Collection', file: `${BASE}/Paintings/DID-P-012_universe-collection/2021-04-27 10.37.32.jpg` },
  { slug: 'colour-study-blue',    cat: 'painting', year: '2021', title: 'Colour Study Blue',   file: `${BASE}/Paintings/DID-P-013_colour-study-blue/2021-04-27 10.24.24.jpg` },
  { slug: 'sri-lanka-masks',      cat: 'painting', year: '2020', title: 'Sri Lanka Masks',     file: `${BASE}/Paintings/DID-P-021_sri-lanka-masks/2020-07-31 08.49.50.jpg` },
  // Photography
  { slug: 'polaroids',          cat: 'photography', year: '2021', title: 'Polaroids',          file: `${BASE}/Photography/DID-PH-009_polaroids_1500x1000/_59_photo_polaroids_1500x1000_1.png` },
  { slug: 'on-the-light-table', cat: 'photography', year: '2021', title: 'On the Light Table', file: `${BASE}/Photography/DID-PH-011_on-the-light-table_1500x1000/_511_photo_on-the-light-table_1500x1000_1.png` },
  { slug: 'dead-flowers',       cat: 'photography', year: '2021', title: 'Dead Flowers',       file: `${BASE}/Photography/DID-PH-012_dead-flowers_1500x1000/_512_photo_dead-flowers_1500x1000_2.png` },
  { slug: 'vase-on-stool',      cat: 'photography', year: '2021', title: 'Vase on Stool',      file: `${BASE}/Photography/DID-PH-017_vase-on-stool_1500x1000/_517_photo_vase-on-stool_1500x1000_4.png` },
  { slug: 'purple-flower',      cat: 'photography', year: '2021', title: 'Purple Flower',      file: `${BASE}/Photography/DID-PH-016_purple-flower_1500x1000/_516_photo_purple-flower_1500x1000_2.png` },
]

function toJpeg(src: string, dest: string) {
  execSync(`sips -s format jpeg -s formatOptions 85 "${src}" --out "${dest}"`, { stdio: 'pipe' })
}

async function upload(work: typeof WORKS[0]): Promise<string> {
  const isPng = work.file.toLowerCase().endsWith('.png')
  let uploadPath = work.file
  let tmpPath: string | null = null

  if (isPng) {
    tmpPath = resolve(tmpdir(), `did-w2-${Date.now()}.jpg`)
    toJpeg(work.file, tmpPath)
    uploadPath = tmpPath
  }

  const buffer = readFileSync(uploadPath)
  const mb = (buffer.length / 1024 / 1024).toFixed(1)
  process.stdout.write(`${mb}MB... `)

  const blob = await put(`works/${work.cat}/${work.slug}.jpg`, buffer, {
    access: 'public',
    contentType: 'image/jpeg',
    allowOverwrite: true,
  })

  if (tmpPath) unlinkSync(tmpPath)
  return blob.url
}

async function main() {
  console.log(`Uploading ${WORKS.length} additional works\n`)

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

  const catMap: Record<string, string> = { tufting: 'tufting', embroidery: 'embroidery', painting: 'painting', photography: 'photography' }
  const descMap: Record<string, string> = { tufting: 'Hand-tufted wool on canvas.', embroidery: 'Embroidery on fabric.', painting: 'Mixed media on canvas.', photography: 'Fine art photograph.' }

  console.log('\n\n// Add these to lib/data.ts works array:\n')
  for (const r of results) {
    console.log(`  { slug: '${r.slug}', title: '${r.title}', category: '${catMap[r.cat]}', year: '${r.year}', description: '${descMap[r.cat]}', image: '${r.url}' },`)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
