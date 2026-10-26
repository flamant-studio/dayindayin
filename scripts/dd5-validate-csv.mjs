// DD5: validates the DD2 art-print CSV against Gelato's import format + live template + image URLs. Read-only.
import fs from 'fs'
const csvPath = 'DayInDayIn Images/gelato_dd2_new_art_prints_export.csv'
const refHdr = fs.readFileSync('DayInDayIn Images/export template.csv', 'utf8').split('\n')[0].trim()
const key = (fs.readFileSync('/Users/flamant-mini/Projects/FLAMANT/dayindayin-site/.env.local', 'utf8').match(/^GELATO_API_KEY=(.*)$/m) || [])[1]?.replace(/^["']|["']$/g, '')
function parse(t) { const rows = []; let r = [], f = '', q = false
  for (let i = 0; i < t.length; i++) { const c = t[i]
    if (q) { if (c === '"' && t[i+1] === '"') { f += '"'; i++ } else if (c === '"') q = false; else f += c }
    else if (c === '"') q = true; else if (c === ',') { r.push(f); f = '' }
    else if (c === '\n') { r.push(f); rows.push(r); r = []; f = '' } else if (c !== '\r') f += c }
  if (f || r.length) { r.push(f); rows.push(r) } return rows }
const raw = fs.readFileSync(csvPath, 'utf8'); const rows = parse(raw); const hdr = rows.shift()
let fail = 0; const ok = (b, m) => { console.log((b ? 'PASS ' : 'FAIL ') + m); if (!b) fail++ }
ok(raw.split('\n')[0].trim() === refHdr, 'header identical to Gelato "export template.csv"')
ok(!raw.startsWith('﻿'), 'no BOM (matches existing working exports)')
ok(rows.every(r => r.length === hdr.length), `${rows.length} data rows, all ${hdr.length} columns`)
const titles = rows.map(r => r[0]); ok(new Set(titles).size === titles.length, 'titles unique')
const live = await (await fetch('https://ecommerce.gelatoapis.com/v1/templates/18600284-2b9d-433a-af02-d728dc81e83b', { headers: { 'X-API-KEY': key } })).json()
const uids = new Set((live.variants || []).flatMap(v => [v.productUid]).filter(Boolean))
console.log(`template 18600284 (Art Print Horizontal) live variants: ${[...uids].length}`); for (const u of uids) console.log('  ' + u)
const existing = fs.readFileSync('DayInDayIn Images/gelato_fap_horizontal_export.csv', 'utf8')
for (const r of rows) {
  const [title, desc, uid, url, pub] = r
  ok(uids.has(uid), `${title}: UID in live horizontal template`)
  ok(existing.includes(uid), `${title}: UID same as the 31 already-live horizontal art prints`)
  ok(/^(Yes|No)$/.test(pub), `${title}: Should Publish = ${pub}`)
  ok(desc.length > 20, `${title}: description present`)
  const res = await fetch(url, { method: 'HEAD' })
  const local = decodeURIComponent(url.split('/main/')[1])
  const lsz = fs.statSync(local).size
  ok(res.status === 200 && /image\/png/.test(res.headers.get('content-type') || ''), `${title}: URL 200 image/png (origin now serves ${res.headers.get('content-length')} B; local upscale ${lsz} B)`)
}
console.log(fail ? `\n${fail} FAILED` : '\nALL PASS'); process.exit(fail ? 1 : 0)
