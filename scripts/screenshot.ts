/**
 * Screenshot utility — proof tool for UX fixes.
 * Usage:
 *   npx tsx scripts/screenshot.ts                    # all pages, saves to screenshots/[timestamp]/
 *   npx tsx scripts/screenshot.ts [task-id]          # saves to screenshots/[task-id]/
 *   BASE_URL=http://localhost:3000 npx tsx scripts/screenshot.ts
 */
import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL = process.env.BASE_URL || 'https://dayindayin-site.vercel.app'

const PAGES = [
  { id: 'home',        path: '/' },
  { id: 'shop',        path: '/shop' },
  { id: 'pdp',         path: '/shop/serlgjhser' },
  { id: 'fine-art',    path: '/fine-art' },
  { id: 'archive',     path: '/archive' },
  { id: 'works',       path: '/works/liebes-panopticon' },
  { id: 'commissions', path: '/commissions' },
]

const VIEWPORTS = [
  { name: 'mobile',  width: 390,  height: 844 },
  { name: 'desktop', width: 1280, height: 900 },
]

async function run() {
  const taskId = process.argv[2] || new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const outDir = path.join(__dirname, '..', 'screenshots', taskId)
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    const page = await ctx.newPage()

    for (const pg of PAGES) {
      const url = BASE_URL + pg.path
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
        await page.waitForTimeout(800)
        const filename = `${pg.id}-${vp.name}.png`
        const filepath = path.join(outDir, filename)
        await page.screenshot({ path: filepath, fullPage: true })
        console.log(`✓ ${filename}`)
      } catch (err) {
        console.error(`✗ ${pg.id} (${vp.name}): ${err}`)
      }
    }

    await ctx.close()
  }

  await browser.close()
  console.log(`\nScreenshots saved to: screenshots/${taskId}/`)
}

run().catch(console.error)
