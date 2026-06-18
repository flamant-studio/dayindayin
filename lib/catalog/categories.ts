/**
 * Handle → category mapping for Fluid signal extraction.
 * Order matters: first match wins. Put more specific keywords first.
 */
export const HANDLE_CATEGORY_MAP: { keywords: string[]; category: string }[] = [
  // Product types — specific first
  { keywords: ['framed'],        category: 'framed-prints' },
  { keywords: ['wood-print'],    category: 'wood-prints' },
  { keywords: ['art-print'],     category: 'art-prints' },
  { keywords: ['poster'],        category: 'posters' },
  { keywords: ['greeting-card'], category: 'greeting-cards' },
  { keywords: ['postcard'],      category: 'postcards' },
  { keywords: ['water-bottle'],  category: 'water-bottles' },
  { keywords: ['tote'],          category: 'tote-bags' },
  { keywords: ['tank', 'apparel', 't-shirt', 'hoodie'], category: 'apparel' },
  { keywords: ['mug'],           category: 'mugs' },
  // Series — after product types so type-signal lands first
  { keywords: ['neko'],          category: 'neko' },
  { keywords: ['shero'],         category: 'shero' },
  { keywords: ['sea-monster'],   category: 'sea-monsters' },
  { keywords: ['botanical'],     category: 'botanical' },
  { keywords: ['floral'],        category: 'floral' },
  { keywords: ['faces', 'face'], category: 'faces' },
  { keywords: ['sommerby'],      category: 'sommerby' },
  { keywords: ['tourism'],       category: 'tourism' },
]

export function handleToCategory(handle: string): string | null {
  const lower = handle.toLowerCase()
  for (const { keywords, category } of HANDLE_CATEGORY_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) return category
  }
  return null
}
