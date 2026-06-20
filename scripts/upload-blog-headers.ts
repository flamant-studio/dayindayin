/**
 * upload-blog-headers.ts — upload 2021 art year review images as blog post headers
 * Run: npx tsx scripts/upload-blog-headers.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const SRC = '/Users/flamant-mini/Dropbox/_KUNST/Studio/Texts and images_blog_wbsite/'
const FILES = [
  { src: '2021_artyear_review-02.png', blob: 'blog/artyear-2021-02.jpg' },
  { src: '2021_artyear_review-04.png', blob: 'blog/artyear-2021-04.jpg' },
  { src: '2021_artyear_review-06.png', blob: 'blog/artyear-2021-06.jpg' },
  { src: '2021_artyear_review-08.png', blob: 'blog/artyear-2021-08.jpg' },
]

async function main() {
  for (const { src, blob } of FILES) {
    const tmp = resolve(tmpdir(), `review-${Date.now()}.jpg`)
    execSync(`sips -s format jpeg -s formatOptions 88 "${SRC}${src}" --out "${tmp}"`, { stdio: 'pipe' })
    const data = readFileSync(tmp)
    const r = await put(blob, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false })
    unlinkSync(tmp)
    console.log('✓', r.url)
  }
}

main().catch(console.error)
