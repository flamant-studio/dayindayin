// DD7: live shots (1280+390) of the 4 new prints: PDP each + listing pages; prints checks as JSON lines. Usage: npx tsx scripts/dd7-shots.ts
import { chromium } from 'playwright'
import { createHash } from 'crypto'
const BASE = 'https://dayindayin-site.vercel.app'
const H = ['blue-flower-on-green-wood','dead-flowers','red-and-green-moss','taped-objects'].map(x => `${x}-fine-art-print`)
async function main() {
  const b = await chromium.launch({ channel: 'chrome' })
  for (const [name, w, h] of [['1280', 1280, 800], ['390', 390, 844]] as const) {
    const pg = await (await b.newContext({ viewport: { width: w, height: h } })).newPage()
    const errs: string[] = []; pg.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)) })
    for (const [id, url] of [['shop', '/shop'], ['fine-art', '/fine-art?view=grid'], ['search', '/search?q=fine+art+print']]) {
      await pg.goto(BASE + url, { waitUntil: 'networkidle' })
      const hrefs = await pg.$$eval('a', as => as.map(a => (a as HTMLAnchorElement).getAttribute('href') || ''))
      console.log(JSON.stringify({ vp: name, page: id, present: H.filter(x => hrefs.some(l => l.endsWith('/' + x))) }))
    }
    for (const x of H) {
      const r = await pg.goto(`${BASE}/shop/${x}`, { waitUntil: 'networkidle' })
      const info = await pg.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('main img')) as HTMLImageElement[]
        const big = imgs.sort((a, b) => b.naturalWidth - a.naturalWidth)[0]
        return { h1: document.querySelector('h1')?.textContent, img: big?.currentSrc, nw: big?.naturalWidth, nh: big?.naturalHeight, price: document.body.innerText.match(/\d+[,.]\d{2}\s?(kr|DKK)|kr\.?\s?\d+[,.]?\d*/i)?.[0], add: !!Array.from(document.querySelectorAll('button')).find(bt => /add to cart|læg i kurv/i.test(bt.textContent || '')), label: document.body.innerText.match(/Fine Art Print|Art Print|Print Material/i)?.[0] }
      })
      let hash = ''
      if (info.img) { const buf = Buffer.from(await (await fetch(info.img)).arrayBuffer()); hash = createHash('md5').update(buf).digest('hex').slice(0, 10) }
      console.log(JSON.stringify({ vp: name, handle: x, status: r?.status(), ...info, hash }))
      await pg.screenshot({ path: `_review/DD7/after-pdp-${x.replace('-fine-art-print', '')}-${name}.png` })
    }
    console.log(JSON.stringify({ vp: name, consoleErrors: errs }))
  }
  await b.close()
}
main()
