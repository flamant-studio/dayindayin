const TYPE_SUFFIXES = [
  'Fine Art Print', 'Art Print', 'Framed Print', 'Poster', 'Mug',
  'Tote Bag', 'Tank Top', 'Greeting Card', 'Postcard', 'Water Bottle',
  'Wood Print', 'Dad Cap', 'Crewneck', 'Apparel',
]

export function displayTitle(title: string): string {
  for (const suffix of TYPE_SUFFIXES) {
    const idx = title.lastIndexOf(` — ${suffix}`)
    if (idx !== -1) return title.slice(0, idx)
  }
  return title
}
