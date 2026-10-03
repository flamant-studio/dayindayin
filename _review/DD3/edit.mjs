import fs from 'fs'
let L = fs.readFileSync('lib/data.ts','utf8').split('\n')
const B='${BLOB}'
const find = s => { const i = L.findIndex(l => l.includes(`{ slug: '${s}',`)); if (i<0) throw new Error(s); return i }
const sub = (s, a, b) => { const i = find(s); if (!L[i].includes(a)) throw new Error(s+' missing '+a); L[i] = L[i].replace(a, b) }
const setImgGal = (s, img, gal) => { const i = find(s); L[i] = L[i].replace(/image: `[^`]*`,\s*gallery: .*\},\s*$/, m => { const tail = m.match(/(,\s*(sold|availabilityNote)[^\n]*)?\},\s*$/); return `image: ${img}, gallery: ${gal} },` }) }
// 38 homes
sub('38-homes', ' Only some of the parts are shown here.', ' All 15 parts are shown here.')
setImgGal('38-homes', '`'+B+'/embroidery/38-homes/part-01.jpg`', "Array.from({ length: 15 }, (_, i) => `"+B+"/embroidery/38-homes/part-${String(i + 1).padStart(2, '0')}.jpg`)")
// ingenting
sub('ingenting', 'A detail of an embroidery reading', 'The whole cloth of an embroidery reading')
sub('ingenting', 'in Danish.', 'in Danish. Two close-ups follow.')
setImgGal('ingenting', '`'+B+'/embroidery/ingenting/whole.jpg`', '[`'+B+'/embroidery/ingenting/whole.jpg`, `'+B+'/embroidery/ingenting/detail-1.jpg`, `'+B+'/embroidery/ingenting/detail-2.jpg`]')
// universe
for (const n of ['1','2','3','collection']) {
  const s = 'universe-'+n
  const i = find(s)
  L[i] = L[i].replace(' The photograph is a process photograph.', '')
  L[i] = L[i].replace(/(image: `[^`]*`,\s*)gallery: /, `image: \`${B}/painting/${s}/finished.jpg\`,   gallery: [\`${B}/painting/${s}/finished.jpg\`, ...`)
  L[i] = L[i].replace(/(gallery: \[`[^`]*finished\.jpg`, \.\.\.)(.*?)\s*\},\s*$/, '$1$2] },')
}
// buddha
sub('buddha', 'Wrapped in plastic. The photograph is a process/detail photograph — no finished photograph of the work exists yet.', 'Wrapped in plastic, leaning on the studio wall.')
{ const i=find('buddha'); L[i]=L[i].replace(/image: `[^`]*`,\s*gallery: (g\([^)]*\))/, `image: \`${B}/painting/buddha/finished.jpg\`, gallery: [\`${B}/painting/buddha/finished.jpg\`, ...$1]`) }
// vaginals
{ const i=find('vaginals'); L[i]=L[i].replace(/image: `[^`]*`,\s*gallery: (g\([^)]*\))/, `image: \`${B}/painting/vaginals/finished.jpg\`, gallery: [\`${B}/painting/vaginals/finished.jpg\`, ...$1]`) }
// dead flowers, moss
sub('dead-flowers', ' More photographs exist.', '')
{ const i=find('dead-flowers'); L[i]=L[i].replace(/gallery: (g\([^)]*\))/, `gallery: [...$1, ${[1,2,3,4].map(n=>`\`${B}/photography/dead-flowers/more-${n}.jpg\``).join(', ')}]`) }
{ const i=find('red-and-green-moss'); L[i]=L[i].replace(/gallery: (g\([^)]*\))/, `gallery: [...$1, ${[1,2].map(n=>`\`${B}/photography/red-and-green-moss/more-${n}.jpg\``).join(', ')}]`) }
// laundry, cat doll
sub('laundry-bags', ' No finished photograph yet.', '')
setImgGal('laundry-bags', '`'+B+'/mixed/laundry-bags/finished-1.jpg`', '['+[1,2,3,4].map(n=>'`'+B+'/mixed/laundry-bags/finished-'+n+'.jpg`').join(', ')+']')
sub('cat-doll', ' The photograph is a process shot.', '')
setImgGal('cat-doll', '`'+B+'/mixed/cat-doll/finished-1.jpg`', '['+[1,2].map(n=>'`'+B+'/mixed/cat-doll/finished-'+n+'.jpg`').join(', ')+']')
// bather
const bi = find('buddha')
L.splice(bi+1, 0, "  { slug: 'the-bather', title: 'The Bather', category: 'painting', year: '2022', description: 'A woman in a red swimsuit by the sea, hair blowing, one arm out over the waves under a yellow sky. Painted on a stretched canvas.', materials: 'Painting on stretched canvas', image: `${BLOB}/painting/the-bather.jpg`, gallery: g('painting/the-bather', 3) },")
fs.writeFileSync('lib/data.ts', L.join('\n'))
