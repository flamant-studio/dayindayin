import { getProductsByTitleKeyword } from '@/lib/shopify/products'
import { SERIES, SERIES_KEYWORDS } from '@/lib/series'
import SeriesTile from '@/components/SeriesTile'
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

export const revalidate = 3600

export default async function CollectionsPage() {
  // Fetch up to 12 products per series in parallel, for the live product count only —
  // tile images are static, hand-picked artwork (see lib/series.ts), not product photos.
  const seriesResults = await Promise.all(
    SERIES.map(({ tag }) => getProductsByTitleKeyword(SERIES_KEYWORDS[tag], 12).catch(() => []))
  )

  const seriesData = SERIES.map(({ tag, label, sub, accent, image }, i) => {
    const count = seriesResults[i].filter(p => p.firstImage).length
    return { tag, label, sub, accent, imgUrl: image, count }
  })

  const collectionsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Collections — Day In Day In',
    description: 'Curated series by Stine Weirsøe Flamant — SHERO, NEKO, Sea Monsters, Botanical, Floral, Masks, and Tourism.',
    url: 'https://dayindayin.dk/collections',
    hasPart: SERIES.map(({ tag, label, sub }) => ({
      '@type': 'CreativeWork',
      name: label,
      description: sub,
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
          <SeriesTile
            key={c.tag}
            href={`/shop?filter=${c.tag}`}
            label={c.label}
            sub={c.count > 0 ? `${c.sub} · ${c.count} product${c.count !== 1 ? 's' : ''}` : c.sub}
            accent={c.accent}
            imgUrl={c.imgUrl}
            sizes="(max-width: 768px) 50vw, 25vw"
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
  );
}
