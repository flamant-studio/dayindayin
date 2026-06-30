import { getProductsByTitleKeyword } from '@/lib/shopify/products'
import SeriesCard from '@/components/SeriesCard'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Curated sets by theme — SHERO, NEKO, botanical, and more works by Stine Weirsøe Flamant.',
  alternates: { canonical: '/collections' },
  openGraph: {
    title: 'Collections — Day In Day In',
    description: 'Browse by series — SHERO feminist pop-art, NEKO cat works, Sea Monsters, Botanical, Floral, and more. Prints and originals by Stine Weirsøe Flamant.',
    images: [{ url: 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works/tufting/neko-cat-orange.jpg', width: 1200, height: 900 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collections — Day In Day In',
    description: 'Browse by series — SHERO, NEKO, Sea Monsters, Botanical and more.',
    images: ['https://29kekabbrd49avje.public.blob.vercel-storage.com/works/tufting/neko-cat-orange.jpg'],
  },
}

const BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works'

const SERIES_COLLECTIONS = [
  { title: 'SHERO', description: 'Feminist icons and powerful women, rendered in tufting and embroidery. The series that started it all.', tag: 'shero', accent: '#D94F2C' },
  { title: 'NEKO', description: 'Cats as subjects and symbols. Sleeping, watching, disappearing. Japanese-inflected, always graphic.', tag: 'neko', accent: '#2E5D4B' },
  { title: 'Sea Monsters', description: 'Creatures from old maritime charts and personal mythology. Colourful, strange, made by hand.', tag: 'sea-monsters', accent: '#4A7A9B' },
  { title: 'Botanical', description: 'Plants, growth, and natural form. Quiet works that hold their ground on any wall.', tag: 'botanical', accent: '#5C7A48' },
  { title: 'Floral', description: 'Not decorative — confrontational. Flowers as territory and excess.', tag: 'floral', accent: '#B85C78' },
  { title: 'Faces', description: 'Portraits and fragments. Faces that look back. Photography and digital illustration.', tag: 'faces', accent: '#7A6B8A' },
  { title: 'Sommerby', description: 'Danish summer — light, colour, and the particular stillness of somewhere you return to every year.', tag: 'sommerby', accent: '#C4694F' },
]

const SERIES_TITLE_PATTERNS: Record<string, RegExp> = {
  'shero':        /\bshero\b/i,
  'neko':         /\bneko\b/i,
  'sea-monsters': /sea[\s-]monster/i,
  'botanical':    /botanical/i,
  'floral':       /floral/i,
  'faces':        /\bfaces?\b/i,
  'sommerby':     /sommerby/i,
}

const MOCKUP_KEYWORDS = ['mug', 'tote bag', 'tank top', ' cap', 'water bottle', 'wood print']
const isMockup = (title: string) => { const t = title.toLowerCase(); return MOCKUP_KEYWORDS.some(k => t.includes(k)) }

const FINE_ART_COLLECTIONS = [
  {
    title: 'Hand Tufting',
    description: 'Wool on cotton canvas, worked by hand on a tufting frame. Each piece takes days. The pile height and density chosen entirely by Stine.',
    href: '/fine-art#tufting',
    accent: '#D94F2C',
    image: `${BLOB}/tufting/rainbow-I.jpg`,
    label: 'Original works',
  },
  {
    title: 'Embroidery',
    description: 'Needle and thread on canvas and linen — where the work started and where it keeps returning. Text, form, and image stitched by hand.',
    href: '/fine-art#embroidery',
    accent: '#2E5D4B',
    image: `${BLOB}/embroidery/fuck-alting.jpg`,
    label: 'Original works',
  },
]

type SlideImage = { url: string; alt: string }

// Keyword used for title search per series
const SERIES_KEYWORDS: Record<string, string> = {
  shero: 'shero', neko: 'neko', 'sea-monsters': 'Sea Monsters',
  botanical: 'Botanical', floral: 'Floral', faces: 'Face', sommerby: 'Sommerby',
}

export const revalidate = 3600

export default async function CollectionsPage() {
  // Fetch up to 12 products per series in parallel — much faster than getAllProducts()
  const seriesResults = await Promise.all(
    SERIES_COLLECTIONS.map(({ tag }) =>
      getProductsByTitleKeyword(SERIES_KEYWORDS[tag] ?? tag, 12).catch(() => [])
    )
  )

  const LIGHT_TITLE_KEYWORDS = ['blanc', 'white', 'cream']
  const isLight = (t: string) => { const tl = t.toLowerCase(); return LIGHT_TITLE_KEYWORDS.some(k => tl.includes(k)) }

  const seriesData = SERIES_COLLECTIONS.map(({ title, description, tag, accent }, i) => {
    const products = seriesResults[i].filter(p => p.firstImage)
    // Score each product: mockup=+2, light/blanc variant=+1 (lower is better for slideshow lead)
    const scored = products.map(p => ({
      p,
      score: (isMockup(p.title) ? 2 : 0) + (isLight(p.title) ? 1 : 0),
    }))
    scored.sort((a, b) => a.score - b.score)
    const ordered = scored.map(s => s.p)
    const images = ordered.slice(0, 4).map(p => ({
      url: p.firstImage!.url,
      alt: p.firstImage!.altText ?? p.title,
    }))
    return { title, description, tag, accent, images, count: products.length }
  })

  const collectionsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Collections — Day In Day In',
    description: 'Curated series by Stine Weirsøe Flamant — SHERO, NEKO, Sea Monsters, Botanical, Floral, Faces, and Sommerby.',
    url: 'https://dayindayin.dk/collections',
    hasPart: SERIES_COLLECTIONS.map(({ title, description, tag }) => ({
      '@type': 'CreativeWork',
      name: title,
      description,
      url: `https://dayindayin.dk/shop?filter=${tag}`,
    })),
  }

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionsJsonLd) }} />
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>Browse by series</span>
        <h1 className={styles.title}>Collections</h1>
        <p className={styles.sub}>
          Each series is a different thread running through Stine&apos;s work — a recurring subject, palette, or obsession. Some are years in the making.
        </p>
      </div>
      <div className={styles.grid}>
        {seriesData.map((c) => (
          <SeriesCard
            key={c.tag}
            href={`/shop?filter=${c.tag}`}
            accent={c.accent}
            title={c.title}
            subLabel={c.count > 0 ? `${c.count} product${c.count !== 1 ? 's' : ''}` : undefined}
            description={c.description}
            cta="View products →"
            slides={c.images}
          />
        ))}
      </div>

      <div className={styles.fineArtSection}>
        <h2 className={styles.fineArtTitle}>Original Works</h2>
        <p className={styles.fineArtSub}>
          These aren&apos;t prints. Unique original pieces — hand-tufted textiles and embroidery — available on enquiry.
        </p>
        <div className={styles.fineArtGrid}>
          {FINE_ART_COLLECTIONS.map((c) => (
            <SeriesCard
              key={c.href}
              href={c.href}
              accent={c.accent}
              title={c.title}
              subLabel={c.label}
              description={c.description}
              cta="See originals →"
              image={c.image}
            />
          ))}
        </div>

      </div>
    </div>
    </>
  )
}
