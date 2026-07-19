// Canonical motif list — finer-grained than lib/series.ts's SERIES (e.g. NEKO
// splits into paw-print colourways vs. the Neko Human figure; Masks splits into
// its five named pieces). Where a motif has no live Shopify products yet
// (fineArtOnly), it links to the fine-art work page instead of a shop grid.
// Hero images are flat source artwork from the public `dayindayin` repo — the
// same convention as lib/series.ts's SERIES tiles, not product mockup photos.

const ART_BLOB = 'https://raw.githubusercontent.com/flamant-studio/dayindayin/main/DayInDayIn%20Images'

export interface Motif {
  slug: string
  name: string
  accent: string
  image: string
  /** Broad Shopify title search term used to fetch candidates server-side. */
  keyword?: string
  /** Precise client-side filter over the keyword search results. */
  match?: (title: string) => boolean
  fineArtOnly?: boolean
  fineArtHref?: string
}

export const MOTIFS: Motif[] = [
  {
    slug: 'neko-paw-bw',
    name: 'Neko Paw — Black & White',
    accent: '#55524C',
    image: `${ART_BLOB}/neko/neko_paw_bw_transparent.png`,
    keyword: 'Neko Paw',
    match: (t) => t.includes('Black & White') && !t.includes('Cap'),
  },
  {
    slug: 'neko-paw-colour',
    name: 'Neko Paw — Colour',
    accent: '#2E5D4B',
    image: `${ART_BLOB}/neko/neko_paw_blue.png`,
    keyword: 'Neko Paw',
    match: (t) => !t.includes('Black & White') && !t.includes('Cap'),
  },
  {
    slug: 'neko-human',
    name: 'Neko Human',
    accent: '#2E5D4B',
    image: `${ART_BLOB}/neko/Neko Human II.png`,
    keyword: 'Neko Human',
    match: (t) => t.includes('Neko Human'),
  },
  {
    slug: 'shero',
    name: 'SHERO',
    accent: '#D94F2C',
    image: `${ART_BLOB}/shero/SHERO — Purple.png`,
    keyword: 'SHERO',
    match: (t) => t.startsWith('SHERO'),
  },
  {
    slug: 'elephant',
    name: 'Elephant',
    accent: '#7D8C5C',
    image: `${ART_BLOB}/elephants/Elephant — Yellow.png`,
    keyword: 'Elephant',
    match: (t) => t.includes('Elephant'),
  },
  {
    slug: 'gangster-rabbit',
    name: 'Gangster Rabbit',
    accent: '#A2456B',
    image: `${ART_BLOB}/rabbit/Rabbit.png`,
    keyword: 'Rabbit',
    match: (t) => t.includes('Rabbit'),
  },
  {
    slug: 'mask-phone-calls',
    name: 'Mask against Unsolicited Phone Calls',
    accent: '#7A6B8A',
    image: `${ART_BLOB}/masks/Mask — Calling.png`,
    keyword: 'Mask',
    match: (t) => t.includes('Calling'),
  },
  {
    slug: 'mask-conformism',
    name: 'Mask against Conformism',
    accent: '#7A6B8A',
    image: `${ART_BLOB}/masks/Mask — Conformist.png`,
    keyword: 'Mask',
    match: (t) => t.includes('Conformist'),
  },
  {
    slug: 'mask-indifference',
    name: 'Mask against Indifference',
    accent: '#7A6B8A',
    image: `${ART_BLOB}/masks/Mask — Blasé.png`,
    keyword: 'Mask',
    match: (t) => t.includes('Blasé'),
  },
  {
    slug: 'mask-boredom',
    name: 'Mask against Boredom',
    accent: '#C98A2E',
    image: `${ART_BLOB}/masks/Solar Face.png`,
    keyword: 'Solar Face',
    match: (t) => t.includes('Solar Face'),
  },
  {
    slug: 'mask-binary-expectations',
    name: 'Mask against Binary Expectations',
    accent: '#3D5A80',
    image: `${ART_BLOB}/masks/Moon Face.png`,
    keyword: 'Moon Face',
    match: (t) => t.includes('Moon Face'),
  },
  {
    slug: 'sea-monsters',
    name: 'Greek Sea Monsters',
    accent: '#4A7A9B',
    image: `${ART_BLOB}/patterns/Sea Monsters — Blue.png`,
    keyword: 'Sea Monsters',
    match: (t) => t.includes('Sea Monsters'),
  },
  {
    slug: 'tourism-i',
    name: 'Tourism I',
    accent: '#9B6A3C',
    image: `${ART_BLOB}/tourism/Tourism — I.jpg`,
    keyword: 'Tourism',
    match: (t) => t.split(' — ')[1] === 'I',
  },
  {
    slug: 'tourism-ii',
    name: 'Tourism II',
    accent: '#9B6A3C',
    image: `${ART_BLOB}/tourism/Tourism — II.jpg`,
    keyword: 'Tourism',
    match: (t) => t.split(' — ')[1] === 'II',
  },
  {
    slug: 'tourism-iii',
    name: 'Tourism III',
    accent: '#9B6A3C',
    image: `${ART_BLOB}/tourism/Tourism — III.jpg`,
    keyword: 'Tourism',
    match: (t) => t.split(' — ')[1] === 'III',
  },
  {
    slug: 'tourism-iv',
    name: 'Tourism IV',
    accent: '#9B6A3C',
    image: `${ART_BLOB}/tourism/Tourism — IV.jpg`,
    keyword: 'Tourism',
    match: (t) => t.split(' — ')[1] === 'IV',
  },
  {
    slug: 'poppy-field',
    name: 'Poppy Field',
    accent: '#B23A3A',
    image: `${ART_BLOB}/botanical/Poppy Field.png`,
    keyword: 'Poppy',
    match: (t) => t.includes('Poppy Field'),
  },
  {
    slug: 'night-poppies',
    name: 'Night Poppies',
    accent: '#5B3A5C',
    image: `${ART_BLOB}/botanical/Night Poppies.png`,
    keyword: 'Poppies',
    match: (t) => t.includes('Night Poppies'),
  },
  {
    slug: 'bird-man',
    name: 'Bird Man',
    accent: '#6B5B3E',
    image: 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works/painting/bird-man.jpg',
    fineArtOnly: true,
    fineArtHref: '/works/bird-man',
  },
  {
    slug: 'vaginals',
    name: 'Vaginals',
    accent: '#8C5D92',
    image: 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works/painting/vaginals.jpg',
    fineArtOnly: true,
    fineArtHref: '/works/vaginals',
  },
]
