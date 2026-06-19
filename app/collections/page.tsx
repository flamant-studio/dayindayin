import Link from 'next/link'
import Image from 'next/image'
import { getAllProductsByTag } from '@/lib/shopify/products'
import CollectionSlideshow from '@/components/CollectionSlideshow'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Curated sets by theme — SHERO, NEKO, botanical, and more works by Stine Weirsøe Flamant.',
}

const BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works'

// Series collections — sourced from Shopify tags
const SERIES_COLLECTIONS = [
  { title: 'SHERO', description: 'Feminist icons and powerful women, rendered in tufting and embroidery. The series that started it all.', tag: 'shero', accent: '#D94F2C' },
  { title: 'NEKO', description: 'Cats as subjects and symbols. Sleeping, watching, disappearing. Japanese-inflected, always graphic.', tag: 'neko', accent: '#2E5D4B' },
  { title: 'Sea Monsters', description: 'Creatures from old maritime charts and personal mythology. Colourful, strange, made by hand.', tag: 'sea-monsters', accent: '#4A7A9B' },
  { title: 'Botanical', description: 'Plants, growth, and natural form. Quiet works that hold their ground on any wall.', tag: 'botanical', accent: '#5C7A48' },
  { title: 'Floral', description: 'Not decorative — confrontational. Flowers as territory and excess.', tag: 'floral', accent: '#B85C78' },
  { title: 'Faces', description: 'Portraits and fragments. Faces that look back. Photography and digital illustration.', tag: 'faces', accent: '#7A6B8A' },
  { title: 'Sommerby', description: 'Danish summer — light, colour, and the particular stillness of somewhere you return to every year.', tag: 'sommerby', accent: '#C4694F' },
]

// Fine art original collections — link to /fine-art sections, not the shop
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

async function SeriesCard({ title, description, tag, accent }: { title: string; description: string; tag: string; accent: string }) {
  const products = await getAllProductsByTag(tag).catch(() => [])
  const withImages = products.filter((p) => p.firstImage)
  const slideImages = withImages.slice(0, 4).map((p) => ({
    url: p.firstImage!.url,
    alt: p.firstImage!.altText ?? p.title,
  }))
  const count = withImages.length

  return (
    <Link href={`/shop?filter=${tag}`} className={styles.card} style={{ borderLeft: `3px solid ${accent}` }}>
      <CollectionSlideshow images={slideImages} />
      <div className={styles.cardBody}>
        <div className={styles.cardText}>
          <h2 className={styles.cardTitle}>{title}</h2>
          {count > 0 && <p className={styles.cardCount}>{count} product{count !== 1 ? 's' : ''}</p>}
          <p className={styles.cardDesc}>{description}</p>
          <span className={styles.cardCta}>View products →</span>
        </div>
      </div>
    </Link>
  )
}

function FineArtCard({ title, description, href, accent, image, label }: { title: string; description: string; href: string; accent: string; image: string; label: string }) {
  return (
    <Link href={href} className={styles.card} style={{ borderLeft: `3px solid ${accent}` }}>
      <div className={styles.fineArtImg}>
        <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardText}>
          <h2 className={styles.cardTitle}>{title}</h2>
          <p className={styles.cardCount}>{label}</p>
          <p className={styles.cardDesc}>{description}</p>
          <span className={styles.cardCta}>See originals →</span>
        </div>
      </div>
    </Link>
  )
}

export default function CollectionsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Collections</h1>
        <p className={styles.sub}>
          Browse by series — each collection is a different thread running through the same body of work.
        </p>
      </div>
      <div className={styles.grid}>
        {SERIES_COLLECTIONS.map((c) => (
          <SeriesCard key={c.tag} {...c} />
        ))}
      </div>

      <div className={styles.fineArtSection}>
        <h2 className={styles.fineArtTitle}>Original Works</h2>
        <p className={styles.fineArtSub}>
          These aren&apos;t prints. Unique original pieces — hand-tufted textiles and embroidery — available on enquiry.
        </p>
        <div className={styles.fineArtGrid}>
          {FINE_ART_COLLECTIONS.map((c) => (
            <FineArtCard key={c.href} {...c} />
          ))}
        </div>
      </div>
    </div>
  )
}
