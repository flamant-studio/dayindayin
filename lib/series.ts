// Canonical series list — single source of truth for tag/label/sub/accent,
// shared by the homepage "Browse by Series" strip and the /collections page.
// Kept separate from shop/page.tsx's SERIES_TITLE_PATTERNS (those are regex
// matchers for filtering products, a different concern from display metadata).
export interface SeriesMeta {
  tag: string
  label: string
  sub: string
  accent: string
}

export const SERIES: SeriesMeta[] = [
  { tag: 'shero',        label: 'SHERO',       sub: 'Power, resistance, naming',      accent: '#D94F2C' },
  { tag: 'neko',         label: 'NEKO',        sub: 'Watching without watching back', accent: '#2E5D4B' },
  { tag: 'sea-monsters', label: 'Sea Monsters', sub: 'Creatures from old charts',      accent: '#4A7A9B' },
  { tag: 'botanical',    label: 'Botanical',   sub: 'Leaves, roots, natural form',     accent: '#5C7A48' },
  { tag: 'floral',       label: 'Floral',      sub: 'Colour at the edge of excess',    accent: '#B85C78' },
  { tag: 'masks',        label: 'Masks',       sub: 'The ones that look back',         accent: '#7A6B8A' },
  { tag: 'tourism',      label: 'Tourism',     sub: 'Postcards from elsewhere',        accent: '#9B6A3C' },
]

// Keyword used to fetch a representative product image per series (title search)
export const SERIES_KEYWORDS: Record<string, string> = {
  shero: 'shero', neko: 'neko', 'sea-monsters': 'Sea Monsters',
  botanical: 'Botanical', floral: 'Floral', masks: 'Mask', tourism: 'Tourism',
}
