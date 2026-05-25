import Link from 'next/link'
import Image from 'next/image'
import { getProductsByTag, formatPrice } from '@/lib/shopify/products'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Curated sets by theme — SHERO, NEKO, botanical, and more works by Stine Weirsøe Flamant.',
}

const COLLECTIONS = [
  {
    title: 'SHERO',
    description: 'Feminist icons and powerful women, rendered in tufting and embroidery. The series that started it all.',
    tag: 'shero',
    accent: '#D94F2C',
  },
  {
    title: 'NEKO',
    description: 'Cats as subjects and symbols. Sleeping, watching, disappearing. Japanese-inflected, always graphic.',
    tag: 'neko',
    accent: '#2E5D4B',
  },
  {
    title: 'Sea Monsters',
    description: 'Creatures from old maritime charts and personal mythology. Colourful, strange, made by hand.',
    tag: 'sea-monsters',
    accent: '#4A7A9B',
  },
  {
    title: 'Botanical',
    description: 'Plants, growth, and natural form. Quiet works that hold their ground on any wall.',
    tag: 'botanical',
    accent: '#5C7A48',
  },
  {
    title: 'Floral',
    description: 'Not decorative — confrontational. Flowers as territory and excess.',
    tag: 'floral',
    accent: '#B85C78',
  },
  {
    title: 'Faces',
    description: 'Portraits and fragments. Faces that look back. Photography and digital illustration.',
    tag: 'faces',
    accent: '#7A6B8A',
  },
  {
    title: 'Sommerby',
    description: 'Light and shadow from the summer house. A quieter, more personal side of the archive.',
    tag: 'sommerby',
    accent: '#8A7B5C',
  },
  {
    title: 'Tufted Works',
    description: 'Handmade tufted textiles — the most labour-intensive of the media, and the most physical.',
    tag: 'tufting',
    accent: '#D94F2C',
  },
  {
    title: 'Embroidery',
    description: 'Thread on canvas. Text, form, and image stitched by hand over hours.',
    tag: 'embroidery',
    accent: '#2E5D4B',
  },
]

async function CollectionCard({
  title, description, tag, accent,
}: { title: string; description: string; tag: string; accent: string }) {
  const products = await getProductsByTag(tag, 50).catch(() => [])
  const withImages = products.filter((p) => p.firstImage)
  const previews = withImages.slice(0, 4)
  const count = withImages.length

  return (
    <Link href={`/shop?filter=${tag}`} className={styles.card}>
      <div className={styles.cardGrid}>
        {previews.map((p) => (
          <div key={p.id} className={styles.cardThumb}>
            <Image
              src={p.firstImage!.url}
              alt={p.firstImage!.altText ?? p.title}
              fill
              sizes="(max-width: 768px) 25vw, 12vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
        {Array.from({ length: 4 - previews.length }).map((_, i) => (
          <div key={`ph-${i}`} className={`${styles.cardThumb} ${styles.cardThumbEmpty}`} />
        ))}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardAccent} style={{ background: accent }} />
        <div className={styles.cardText}>
          <h2 className={styles.cardTitle}>{title}</h2>
          {count > 0 && <p className={styles.cardCount}>{count} work{count !== 1 ? 's' : ''}</p>}
          <p className={styles.cardDesc}>{description}</p>
          <span className={styles.cardCta}>View works →</span>
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
          Browse by series or medium — each collection is a different facet of the same body of work.
        </p>
      </div>
      <div className={styles.grid}>
        {COLLECTIONS.map((c) => (
          <CollectionCard key={c.tag} {...c} />
        ))}
      </div>
    </div>
  )
}
