/**
 * upload-lifestyle-refresh.ts
 *
 * Sebastian's picks from the WEBSITE ASSETS Dropbox folders (2026-07-23):
 * - Homepage lifestyle strip (4 slots): yarn cones macro, tufted rainbow
 *   piece photographed in a tree, yarn + wool comb on a windowsill, tufted
 *   swatch with pompoms on yellow.
 * - About page process photos (2 slots, "something more colorful"):
 *   French-knot embroidery macro, cut-pile tufting macro — both from
 *   _assets_generic_process shots.
 *
 * The yarn-cones and rainbow-in-tree shots come from video clips; frames
 * were already extracted to the scratchpad this session.
 *
 * Run: npx tsx scripts/upload-lifestyle-refresh.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { execSync } from 'child_process'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const SCRATCH = '/private/tmp/claude-501/-Users-flamant-mini/d89fb865-6dd0-4d66-a249-efbbe187c272/scratchpad/preview'
const LIFESTYLE_DIR = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/WEBSITE ASSETS/_assets_generic_lifestyle_shots'
const PROCESS_DIR = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/WEBSITE ASSETS/_assets_generic_process shots'

const JOBS = [
  // Homepage lifestyle strip
  { src: `${SCRATCH}/mov-frame.jpg`, key: 'lifestyle/ls-10.jpg', convert: false },
  { src: `${SCRATCH}/mp4-frame.jpg`, key: 'lifestyle/ls-11.jpg', convert: false },
  { src: `${LIFESTYLE_DIR}/2019-06-02 17.53.03.jpg`, key: 'lifestyle/ls-12.jpg', convert: true },
  { src: `${LIFESTYLE_DIR}/2021-05-28 11.47.45-1.jpg`, key: 'lifestyle/ls-13.jpg', convert: true },
  // About page process photos (replacing stine-embroidery.jpg / -2.jpg)
  { src: `${PROCESS_DIR}/2021-04-13 13.06.44.jpg`, key: 'about/stine-embroidery.jpg', convert: true },
  { src: `${PROCESS_DIR}/2021-05-21 14.26.17.jpg`, key: 'about/stine-embroidery-2.jpg', convert: true },
]

async function main() {
  for (const job of JOBS) {
    let filePath = job.src
    if (job.convert) {
      const tmp = `/tmp/${job.key.replace(/\//g, '_')}`
      execSync(`sips -s format jpeg -s formatOptions 88 "${job.src}" --out "${tmp}"`, { stdio: 'pipe' })
      filePath = tmp
    }
    const data = readFileSync(filePath)
    const result = await put(job.key, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
    console.log(`${job.key} -> ${result.url}`)
  }
}
main().catch((e) => { console.error(e); process.exit(1) })
