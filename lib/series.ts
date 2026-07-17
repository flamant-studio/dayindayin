// Canonical series list — single source of truth for tag/label/sub/accent,
// shared by the homepage "Browse by Series" strip and the /collections page.
// Kept separate from shop/page.tsx's SERIES_TITLE_PATTERNS (those are regex
// matchers for filtering products, a different concern from display metadata).
export interface SeriesMeta {
  tag: string
  label: string
  sub: string
  accent: string
  image: string
}

const SERIES_BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works/series'

// Tile images are hand-picked, hand-cropped flat artwork — NOT product photos.
// Sourced directly from the public `dayindayin` artwork repo (DayInDayIn Images/),
// cropped to fill a square with no dead space. This replaced a "search Shopify
// by title keyword, pick the least-mockup-y result" mechanism that regularly
// surfaced framed-print product photos here (Floral, Masks) — wrong for a
// category nav. See scripts/upload-series-tile-images.ts and LOG.md 2026-07-17.
export const SERIES: SeriesMeta[] = [
  { tag: 'shero',        label: 'SHERO',       sub: 'Power, resistance, naming',      accent: '#D94F2C', image: `${SERIES_BLOB}/shero.png` },
  { tag: 'neko',         label: 'NEKO',        sub: 'Watching without watching back', accent: '#2E5D4B', image: `${SERIES_BLOB}/neko.jpg` },
  { tag: 'sea-monsters', label: 'Sea Monsters', sub: 'Creatures from old charts',      accent: '#4A7A9B', image: `${SERIES_BLOB}/sea-monsters.jpg` },
  { tag: 'floral',       label: 'Floral',      sub: 'Colour at the edge of excess',    accent: '#B85C78', image: `${SERIES_BLOB}/floral.jpg` },
  { tag: 'masks',        label: 'Masks',       sub: 'The ones that look back',         accent: '#7A6B8A', image: `${SERIES_BLOB}/masks.jpg` },
  { tag: 'tourism',      label: 'Tourism',     sub: 'Postcards from elsewhere',        accent: '#9B6A3C', image: `${SERIES_BLOB}/tourism.jpg` },
]

// Keyword used to fetch a representative product image per series (title search)
export const SERIES_KEYWORDS: Record<string, string> = {
  shero: 'shero', neko: 'neko', 'sea-monsters': 'Sea Monsters',
  floral: 'Floral', masks: 'Mask', tourism: 'Tourism',
}
