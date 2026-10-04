// Usage: node a11y-check.mjs <baseUrl> ; run from repo root. Writes _review/DD3/a11y-raw.json
import { chromium } from 'playwright'
import fs from 'fs'
const base = process.argv[2] || 'http://localhost:3100'
const axeSrc = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8')
const cats = ['tufting','embroidery','painting','photography','mixed','handhooking','digital']
const ONLY = process.env.ONLY
const pages0 = ['/', '/fine-art', '/fine-art?view=grid', ...cats.map(c => `/fine-art?category=${c}`),
  '/works/the-bather', '/works/38-homes', '/works/universe-1', '/works/cat-doll', '/shop', process.argv[3] || '/shop/PRODUCT']
const pages = ONLY ? pages0.filter(x => x === ONLY) : pages0
const viewports = [{ w: 390, h: 844 }, { w: 1280, h: 800 }]
const inPage = () => {
  const out = []
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4 }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]) }
  const parse = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x)); return { c: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 } }
  const bgOf = el => { let layers = []; for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none') return { img: true }; const b = parse(cs.backgroundColor); if (b && b.a > 0) { layers.push(b); if (b.a >= 1) break } } let base = [255, 255, 255]; for (const l of layers.reverse()) base = base.map((v, i) => v * (1 - l.a) + l.c[i] * l.a); return { c: base } }
  const sel = el => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0].replace(/^.*__(.*)__.*$/, '$1') : '')
  const vw = innerWidth
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const seen = new Set()
  while (walker.nextNode()) {
    const t = walker.currentNode; const txt = t.textContent.trim(); if (!txt) continue
    const el = t.parentElement; if (seen.has(el) || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue
    if (el.closest('[inert],[aria-hidden=true]') && !el.closest('svg')) { if (el.closest('aside')) continue }
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) continue
    if (el.classList.contains('skip-to-content') || el.closest('a[href="#main"]')) continue
    seen.add(el)
    const fs = parseFloat(cs.fontSize); const fg = parse(cs.color); const bg = bgOf(el)
    let opac = 1; for (let e = el; e; e = e.parentElement) opac *= parseFloat(getComputedStyle(e).opacity)
    if (fg && bg.c) { const eff = fg.c.map((v, i) => v * fg.a * opac + bg.c[i] * (1 - fg.a * opac)); const L1 = lum(eff), L2 = lum(bg.c); const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05); const large = fs >= 24 || (fs >= 18.66 && parseInt(cs.fontWeight) >= 700); if (ratio < (large ? 3 : 4.5)) { el.setAttribute('data-a11y-cand', String(out.length)); out.push({ k: 'contrast', s: sel(el), t: txt.slice(0, 40), v: ratio.toFixed(2), fs, cand: true, need: large ? 3 : 4.5, fg: fg.c, fa: fg.a }) } }
    if (bg.img) { el.setAttribute('data-a11y-cand', String(out.length)); out.push({ k: 'on-image', s: sel(el), t: txt.slice(0, 40), fs, cand: true, need: (fs >= 24 || (fs >= 18.66 && parseInt(cs.fontWeight) >= 700)) ? 3 : 4.5, fg: fg ? fg.c : [0,0,0], fa: fg ? fg.a : 1 }) }
    const min = vw <= 500 ? 14 : 12
    if (fs < min - 0.01) out.push({ k: 'size', s: sel(el), t: txt.slice(0, 40), v: fs })
  }
  for (const el of document.querySelectorAll('button,input:not([type=hidden]),select,textarea,[role=button],summary')) {
    if (el.closest('aside[inert],[inert]')) continue
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden') continue
    if (r.height < 43.5 || r.width < 43.5 && !el.matches('input[type=checkbox],input[type=radio]')) { if (r.height < 43.5) out.push({ k: 'tap', s: sel(el), t: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 30), v: Math.round(r.height) + 'x' + Math.round(r.width) }) }
    const txt = (el.innerText || '').trim()
    if (el.tagName === 'BUTTON' && txt && r.height > parseFloat(cs.lineHeight || 20) * 1.8 + 24 && vw <= 500 && !el.querySelector('img')) out.push({ k: 'wrap?', s: sel(el), t: txt.slice(0, 30), v: Math.round(r.height) })
  }
  if (document.documentElement.scrollWidth > innerWidth + 1) out.push({ k: 'h-overflow', s: 'html', v: document.documentElement.scrollWidth })
  return out
}
const browser = await chromium.launch()
const res = []
for (const vp of viewports) for (const banner of [true, false]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } })
  if (!banner) await ctx.addInitScript(() => localStorage.setItem('did_cookie_consent', 'accept'))
  const page = await ctx.newPage()
  for (const p of pages) {
    const r = await page.goto(base + p, { waitUntil: 'load', timeout: 30000 }).catch(e => null)
    if (!r || r.status() !== 200) { res.push({ p, vp: vp.w, banner, status: r ? r.status() : 'ERR' }); continue }
    await page.waitForTimeout(1200)
    await page.evaluate(axeSrc)
    const ax = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] })).violations.map(v => ({ id: v.id, n: v.nodes.length, ex: v.nodes.slice(0, 3).map(n => n.target.join(' ')) })))
    const ownAll = await page.evaluate(inPage)
    const own = ownAll
    const cands = own.filter(o => o.cand)
    if (cands.length) {
      await page.evaluate(() => { document.querySelectorAll('[data-a11y-cand]').forEach(el => { for (let e = el; e; e = e.parentElement) { if (getComputedStyle(e).opacity !== '1') { e.setAttribute('data-a11y-op', e.style.opacity || ''); e.style.setProperty('opacity', '1', 'important') } } }) })
      await page.addStyleTag({ content: '[aria-label="Cookie consent"],header,nav{visibility:hidden!important} *{color:transparent!important;text-shadow:none!important;caret-color:transparent!important} svg{visibility:hidden!important} video{animation:none!important}' , id:'a11y-hide'})
      for (const o of cands) {
        const idx = own.indexOf(o)
        const loc = page.locator(`[data-a11y-cand="${idx}"]`).first()
        await loc.evaluate(e => e.scrollIntoView({ block: 'center' })).catch(() => {})
        await page.evaluate(() => Promise.race([Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r }))), new Promise(r => setTimeout(r, 3000))]))
        await page.waitForTimeout(500)
        const box = await loc.boundingBox()
        if (!box || box.width < 1) { o.cand = false; o.k = 'skip'; continue }
        const clip = { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(box.width, vp.w - Math.max(0, box.x)), height: Math.min(box.height, vp.h - Math.max(0, box.y)) }
        if (clip.width < 1 || clip.height < 1) { o.k = 'skip'; continue }
        let png = (await page.screenshot({ clip })).toString('base64')
        const sample = (b64) => page.evaluate(async ([b64, fg, fa, need]) => {
          const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode()
          const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0)
          const d = g.getImageData(0, 0, c.width, c.height).data
          const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4 }
          const L = (r, gg, b) => .2126 * f(r) + .7152 * f(gg) + .0722 * f(b)
          const L1 = L(fg[0], fg[1], fg[2]); const rs = []
          for (let i = 0; i < d.length; i += 4) { const comp = [0,1,2].map(k => fg[k] * fa + d[i + k] * (1 - fa)); const L1c = L(comp[0], comp[1], comp[2]); const L2 = L(d[i], d[i + 1], d[i + 2]); rs.push((Math.max(L1c, L2) + .05) / (Math.min(L1c, L2) + .05)); continue; rs.push((Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05)) }
          rs.sort((a, b) => a - b); return rs[Math.floor(rs.length * 0.02)]
        }, [b64, o.fg, o.fa ?? 1, o.need])
        let worst = await sample(png)
        if (worst < 1.3) { await page.waitForTimeout(3000); png = (await page.screenshot({ clip })).toString('base64'); worst = await sample(png) }
        o.v = worst.toFixed(2); o.k = worst < o.need ? 'contrast-px' : 'skip'
      }
      await page.evaluate(() => { document.getElementById('a11y-hide')?.remove(); document.querySelectorAll('[data-a11y-op]').forEach(e => { e.style.opacity = e.getAttribute('data-a11y-op'); e.removeAttribute('data-a11y-op') }) })
    }
    res.push({ p, vp: vp.w, banner, axe: ax, own: own.filter(o => o.k !== 'skip') })
  }
  await ctx.close()
}
await browser.close()
fs.writeFileSync('_review/DD3/a11y-raw.json', JSON.stringify(res, null, 1))
// summary: distinct issues
const agg = {}
let total = 0
for (const r of res) {
  if (r.status) { agg[`HTTP ${r.status} ${r.p}`] = 1; continue }
  for (const a of r.axe) { const k = `axe ${a.id} ${a.ex[0]}`; (agg[k] ||= new Set()).add(`${r.p}@${r.vp}`) }
  for (const o of r.own) { const k = `${o.k} ${o.s} "${o.t || ''}" ${o.v ?? ''}`; (agg[k] ||= new Set()).add(`${r.p}@${r.vp}${r.banner ? '+banner' : ''}`) }
}
for (const [k, v] of Object.entries(agg)) { console.log(k, '|', v.size ? v.size + ' pages-vp' : ''); total++ }
console.log('DISTINCT_ISSUES', total)
