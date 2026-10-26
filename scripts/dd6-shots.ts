// DD6: shop screenshots (1280 + 390) + which of the 6 handles are linked on the page. Usage: npx tsx scripts/dd6-shots.ts before|after
import { chromium } from 'playwright'
const tag = process.argv[2]
const BASE = 'https://dayindayin-site.vercel.app'
const H = ['shero-iii-fine-art-print','shero-indigo-fine-art-print','shero-purple-fine-art-print','neko-paw-cap-blue','neko-paw-cap-lilac','neko-paw-cap-yellow','neko-paw-cap-pink']
async function main() {
  const b = await chromium.launch({ channel: 'chrome' })
  for (const [name, w, h] of [['1280', 1280, 800], ['390', 390, 844]] as const) {
    const pg = await (await b.newContext({ viewport: { width: w, height: h } })).newPage()
    for (const [id, url] of [['shop', '/shop'], ['shop-neko', '/shop?filter=neko'], ['shop-shero', '/shop?filter=shero']]) {
      await pg.goto(BASE + url, { waitUntil: 'networkidle' })
      const hrefs = await pg.$$eval('a', as => as.map(a => (a as HTMLAnchorElement).getAttribute('href') || ''))
      console.log(tag, name, id, H.map(x => `${x}:${hrefs.some(l => l.endsWith('/' + x)) ? 'present' : 'absent'}`).join(' '))
      await pg.screenshot({ path: `_review/DD6/${tag}-${id}-${name}.png`, fullPage: false })
    }
  }
  const pdp = await (await b.newContext()).newPage()
  for (const x of H) { const r = await pdp.goto(`${BASE}/shop/${x}`); console.log(tag, 'pdp', x, r?.status()) }
  await b.close()
}
main()
