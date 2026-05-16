import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProducts, formatPrice } from '@/lib/shopify/products'
import type { Metadata } from 'next'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ handle: string }>
}

const COLLECTION_META: Record<string, { title: string; description: string; color: string }> = {
  'tufted-works':  { title: 'Tufted Works',  color: '#E8D5C4', description: 'Hand-tufted originals reproduced on fine art paper and canvas. Wool, colour, a tufting gun, and hundreds of hours.' },
  'embroidery':    { title: 'Embroidery',    color: '#C4D5C8', description: 'Embroidery on fabric. Text, flowers, figures — sometimes political, always honest.' },
  'paintings':     { title: 'Paintings',     color: '#C4C8D5', description: 'Paintings on canvas and board. Instinctive, colourful, without apology.' },
  'photography':   { title: 'Photography',   color: '#D5C4C8', description: 'Studio photography. Still lifes, found objects, moments from the workspace.' },
  'shero':         { title: 'Shero',         color: '#D5C4D5', description: 'Feminine strength. Portraits and declarations. Not delicate — powerful.' },
  'mixed':         { title: 'Mixed Works',   color: '#D5D0C4', description: 'Collage, objects, experiments. Work that does not fit anywhere else.' },
  'archive':       { title: 'Archive',       color: '#D0C4D5', description: 'Early works. The beginning of everything. Available as prints for the first time.' },
  'new-in':        { title: 'New In',        color: '#C4D5D0', description: 'The latest from the studio.' },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params
  const meta = COLLECTION_META[handle]
  if (!meta) return { title: 'Collection not found' }
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function CollectionPage({ params }: PageProps) {
  const { handle } = await params
  const meta = COLLECTION_META[handle]
  if (!meta) notFound()

  // Fetch all products and filter by collection tag client-side
  // (Shopify Storefront API collection query requires Storefront token)
  const allProducts = await getProducts(250).catch(() => [] as Awaited<ReturnType<typeof getProducts>>)
  const products = allProducts.filter(p =>
    p.tags.some(t => t === handle || t === handle.replace('-works', '') || t === handle.replace('-', ''))
  )

  return (
    <div className={styles.page}>
      <div className={styles.hero} style={{ '--swatch': meta.color } as React.CSSProperties}>
        <div className={styles.heroInner}>
          <Link href="/shop" className={styles.back}>← All prints</Link>
          <h1 className={styles.title}>{meta.title}</h1>
          <p className={styles.desc}>{meta.description}</p>
          {products.length > 0 && (
            <span className={styles.count}>{products.length} prints</span>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>No active products in this collection yet. Check back soon.</p>
          <Link href="/shop" className={styles.emptyCta}>Browse all prints</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((p) => (
            <Link key={p.id} href={`/shop/${p.handle}`} className={styles.card}>
              <div className={styles.cardImg}>
                {p.firstImage
                  ? <img src={p.firstImage.url} alt={p.firstImage.altText ?? p.title} />
                  : <div className={styles.cardPlaceholder} />
                }
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.cardTitle}>{p.title}</span>
                <span className={styles.cardPrice}>{formatPrice(p.minPrice.amount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
