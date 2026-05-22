import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { put } from '@vercel/blob'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const LIFE = '/Users/flamant-mini/Library/CloudStorage/Dropbox/_KUNST/WEBSITE ASSETS/_assets_generic_lifestyle_shots'

const FILES = [
  { path: `${LIFE}/2021-03-07 10.09.55.jpg`,     key: 'lifestyle/ls-01.jpg' },
  { path: `${LIFE}/2021-03-07 10.09.03.jpg`,     key: 'lifestyle/ls-02.jpg' },
  { path: `${LIFE}/assets_packshot_lifestyle_4.jpeg`, key: 'lifestyle/ls-03.jpg' },
  { path: `${LIFE}/2021-03-18 08.15.04.jpg`,     key: 'lifestyle/ls-04.jpg' },
  { path: `${LIFE}/2019-07-04 14.45.46.jpg`,     key: 'lifestyle/ls-05.jpg' },
  { path: `${LIFE}/2019-06-12 09.45.32.jpg`,     key: 'lifestyle/ls-06.jpg' },
  { path: `${LIFE}/2021-05-30 09.38.29.jpg`,     key: 'lifestyle/ls-07.jpg' },
  { path: `${LIFE}/2019-06-12 09.45.06.jpg`,     key: 'lifestyle/ls-08.jpg' },
  { path: `${LIFE}/2021-06-20 08.05.07.jpg`,     key: 'lifestyle/ls-09.jpg' },
]

async function main() {
  const urls: string[] = []
  for (const f of FILES) {
    process.stdout.write(`  ${f.key}: `)
    const buf = readFileSync(f.path)
    process.stdout.write(`${(buf.length/1024/1024).toFixed(1)}MB... `)
    const blob = await put(f.key, buf, { access: 'public', contentType: 'image/jpeg', allowOverwrite: true })
    urls.push(blob.url)
    console.log('✓')
  }
  console.log('\nURLs:')
  urls.forEach(u => console.log(u))
}
main().catch(e => { console.error(e); process.exit(1) })
