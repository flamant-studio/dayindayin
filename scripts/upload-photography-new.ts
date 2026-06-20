/**
 * upload-photography-new.ts — 4 new photography works not yet in data.ts
 * Run: npx tsx scripts/upload-photography-new.ts
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync, readdirSync, existsSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })
const BASE = '/Users/flamant-mini/Dropbox/_KUNST/COLLECTION CURRENT/Photography'

const WORKS = [
  { slug: 'linen-and-yellow-flower', folder: `${BASE}/DID-PH-003_linen-and-yellow-flower_1500x1000` },
  { slug: 'a-very-small-frog',       folder: `${BASE}/DID-PH-005_a-very-small-frog_1500x1000` },
  { slug: 'colourful-shadows',       folder: `${BASE}/DID-PH-010_colourful-shadows_1500x1000` },
  { slug: 'minnie-mouse-neko-cat',   folder: `${BASE}/DID-PH-004_minnie-mouse-and-the-neko-cat_1500x1000` },
]

function toJpg(src: string): string {
  const tmp = resolve(tmpdir(), `up-${Math.random().toString(36).slice(2)}.jpg`)
  execSync(`sips -s format jpeg -s formatOptions 90 "${src}" --out "${tmp}"`, { stdio: 'pipe' })
  return tmp
}

async function upload(local: string, blob: string) {
  let tmp: string | null = null, path = local
  if (/\.(png|dng)$/i.test(local)) { tmp = toJpg(local); path = tmp }
  const data = readFileSync(path)
  const r = await put(blob, data, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false })
  if (tmp) unlinkSync(tmp)
  return r.url
}

function imgs(folder: string) {
  if (!existsSync(folder)) return []
  return readdirSync(folder).filter(f => /\.(png|jpg)$/i.test(f)).sort().map(f => resolve(folder, f))
}

async function main() {
  const results: Record<string, number> = {}
  for (const { slug, folder } of WORKS) {
    console.log(`\n→ ${slug}`)
    const images = imgs(folder)
    if (!images.length) { console.log('  No images'); continue }
    await upload(images[0], `works/photography/${slug}.jpg`)
    console.log(`  Main ✓`)
    const cap = Math.min(images.length, 5)
    for (let i = 0; i < cap; i++) {
      await upload(images[i], `works/photography/${slug}/gallery/${i + 1}.jpg`)
      process.stdout.write(`  Gallery ${i + 1}/${cap} ✓  `)
    }
    results[slug] = cap
    console.log()
  }
  console.log('\n=== counts ===')
  for (const [slug, n] of Object.entries(results)) console.log(`${slug}: ${n}`)
}
main().catch(console.error)
