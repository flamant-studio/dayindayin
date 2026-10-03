import { put } from '@vercel/blob'
import fs from 'fs'
const D = '/Users/flamant-mini/Projects/FLAMANT/dayindayin-site/_memo/dropbox_finds/'
const jobs = []
for (let i = 1; i <= 15; i++) { const n = String(i).padStart(2,'0'); jobs.push([`38-homes/${n}_doodles_${i}.jpg`, `embroidery/38-homes/part-${n}.jpg`]) }
jobs.push(
 ['ingenting/01_2020-08-01_12.03.35_rotated.jpg','embroidery/ingenting/whole.jpg'],
 ['ingenting/02_2020-08-01_12.04.11.jpg','embroidery/ingenting/detail-1.jpg'],
 ['ingenting/03_2020-08-01_12.03.57.jpg','embroidery/ingenting/detail-2.jpg'],
 ['universe/01_universe-1_2021-04-27_10.27.27.jpg','painting/universe-1/finished.jpg'],
 ['universe/02_universe-2_2021-04-27_10.20.49.jpg','painting/universe-2/finished.jpg'],
 ['universe/03_universe-3_2021-04-27_10.23.49.jpg','painting/universe-3/finished.jpg'],
 ['universe/04_universe-collection_2021-04-27_10.30.29.jpg','painting/universe-collection/finished.jpg'],
 ['buddha/01_buddha_2021-07-18_13.03.48.jpg','painting/buddha/finished.jpg'],
 ['tufted-vagina-wood/02_vaginals-watercolour_2020-08-31_13.21.07-3.jpg','painting/vaginals/finished.jpg'],
 ['dead-flowers/01_Blomstersorg-5.jpg','photography/dead-flowers/more-1.jpg'],
 ['dead-flowers/02_Blomstersorg-1.jpg','photography/dead-flowers/more-2.jpg'],
 ['dead-flowers/03_2020-06-09_13.51.31.jpg','photography/dead-flowers/more-3.jpg'],
 ['dead-flowers/04_2020-06-09_13.51.40.jpg','photography/dead-flowers/more-4.jpg'],
 ['red-green-moss/01_2021-04-15_15.12.29.jpg','photography/red-and-green-moss/more-1.jpg'],
 ['red-green-moss/02_2021-04-15_14.57.00.jpg','photography/red-and-green-moss/more-2.jpg'],
 ['laundry-bags/01_2020-11-28_11.07.24.jpg','mixed/laundry-bags/finished-1.jpg'],
 ['laundry-bags/02_2020-11-28_11.07.39.jpg','mixed/laundry-bags/finished-2.jpg'],
 ['laundry-bags/03_2020-11-28_11.08.31.jpg','mixed/laundry-bags/finished-3.jpg'],
 ['laundry-bags/04_2020-11-28_11.08.44.jpg','mixed/laundry-bags/finished-4.jpg'],
 ['cat-doll/02_2020-07-18_18.31.45.jpg','mixed/cat-doll/finished-1.jpg'],
 ['cat-doll/01_2020-07-18_15.43.11.jpg','mixed/cat-doll/finished-2.jpg'],
 ['bather/01_2022-01-27_16.21.49.jpg','painting/the-bather.jpg'],
 ['bather/02_2022-01-27_16.21.34.jpg','painting/the-bather/gallery/1.jpg'],
 ['bather/03_2022-01-27_16.22.15.jpg','painting/the-bather/gallery/2.jpg'],
 ['bather/06_2022-09-15_14.11.56.jpg','painting/the-bather/gallery/3.jpg'],
)
const out = {}
for (const [src, dst] of jobs) {
  const r = await put(`works/${dst}`, fs.readFileSync(D+src), { access: 'public', addRandomSuffix: false, allowOverwrite: false, contentType: 'image/jpeg' })
  out[dst] = r.url
}
fs.writeFileSync('_review/DD3/upload-map.json', JSON.stringify(out, null, 1))
console.log(Object.keys(out).length, 'uploaded')
