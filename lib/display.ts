const TYPE_SUFFIXES = [
  'Fine Art Print', 'Art Print', 'Framed Print', 'Poster', 'Mug',
  'Tote Bag', 'Tank Top', 'Greeting Card', 'Postcard', 'Water Bottle',
  'Wood Print', 'Dad Cap', 'Crewneck', 'Apparel',
]

export function displayTitle(title: string): string {
  for (const suffix of TYPE_SUFFIXES) {
    const pattern = ` — ${suffix}`
    const idx = title.lastIndexOf(pattern)
    if (idx !== -1) {
      // Preserve orientation disambiguation e.g. "Postcard (Portrait)" → keep "(Portrait)"
      const remainder = title.slice(idx + pattern.length)
      const orient = remainder.match(/^ \((Portrait|Landscape)\)/)
      return title.slice(0, idx) + (orient ? ` ${orient[0].trim()}` : '')
    }
  }
  return title
}
