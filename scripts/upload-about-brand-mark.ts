/**
 * upload-about-brand-mark.ts
 *
 * Sebastian's pick for the About page: the original "Day In Day In" brand
 * collage - studio-blue background, a decayed monstera leaf, a dandelion
 * seed head, a torn fabric swatch, the hand-lettered name in a painted
 * ribbon. Source: DID-P-019_blue-background-dayin.
 *
 * Run: npx tsx scripts/upload-about-brand-mark.ts
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const SRC = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/COLLECTION CURRENT/Paintings/DID-P-019_blue-background-dayin/2020-07-29 11.21.07.png'

async function main() {
  const tmp = resolve(tmpdir(), 'about-brand-mark.jpg')
  execSync(`sips -s format jpeg -s formatOptions 90 "${SRC}" --out "${tmp}"`, { stdio: 'pipe' })
  const data = readFileSync(tmp)
  const result = await put('about/brand-mark.jpg', data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false, allowOverwrite: true })
  console.log('uploaded:', result.url)
}

main().catch((e) => { console.error(e); process.exit(1) })
