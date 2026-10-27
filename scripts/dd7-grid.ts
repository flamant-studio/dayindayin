// DD7: screenshot the listing (search "fine art print") with the 4 new prints, 1280 + 390
import { chromium } from 'playwright'
async function main() {
  const b = await chromium.launch({ channel: 'chrome' })
  for (const [n, w, h] of [['1280', 1280, 800], ['390', 390, 844]] as const) {
    const pg = await (await b.newContext({ viewport: { width: w, height: h } })).newPage()
    await pg.goto('https://dayindayin-site.vercel.app/search?q=fine+art+print', { waitUntil: 'networkidle' })
    const el = await pg.$('a[href$="/dead-flowers-fine-art-print"]'); await el?.scrollIntoViewIfNeeded(); await pg.waitForTimeout(1500)
    await pg.screenshot({ path: `_review/DD7/after-grid-search-${n}.png` })
    await pg.goto('https://dayindayin-site.vercel.app/shop', { waitUntil: 'networkidle' })
    const el2 = await pg.$('a[href$="/taped-objects-fine-art-print"]'); await el2?.scrollIntoViewIfNeeded(); await pg.waitForTimeout(1500)
    await pg.screenshot({ path: `_review/DD7/after-grid-shop-${n}.png` })
  }
  await b.close()
}
main()
