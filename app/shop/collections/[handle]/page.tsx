import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductsByTag, formatPrice } from '@/lib/shopify/products'
import { COLLECTIONS } from '@/lib/catalog/collections'
import type { Metadata } from 'next'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ handle: string }>
}

// Each collection has one primary tag that maps to Shopify product tags
const PRIMARY_TAG: Record<string, string> = {
  'tufted-works': 'tufting',
  'embroidery':   'embroidery',
  'paintings':    'painting',
  'photography':  'photography',
  'shero':        'shero',
  'mixed':        'mixed',
  'archive':      'archive',
  'new-in':       'new',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params
  const col = COLLECTIONS.find((c) => c.handle === handle)
  if (!col) return { title: 'Collection not found' }
  return {
    title: col.title,
    description: col.description,
  }
}

export default async function CollectionPage({ params }: PageProps) {
  const { handle } = await params
  const col = COLLECTIONS.find((c) => c.handle === handle)
  if (!col) notFound()

  const tag = PRIMARY_TAG[handle] ?? handle
  const products = await getProductsByTag(tag).catch(() => [])

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/collections" className={styles.breadcrumbLink}>Collections</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{col.title}</span>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.title}>{col.title}</h1>
        <p className={styles.description}>{col.description}</p>
      </header>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>No products in this collection yet. Check back soon.</p>
          <Link href="/shop" className={styles.emptyLink}>Browse all products</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((p) => (
            <Link key={p.id} href={`/shop/${p.handle}`} className={styles.card}>
              <div className={styles.imageWrap}>
                {p.firstImage ? (
                  <Image
                    src={p.firstImage.url}
                    alt={p.firstImage.altText ?? p.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.imagePlaceholder} />
                )}
              </div>
              <div className={styles.info}>
                <span className={styles.productTitle}>{p.title}</span>
                <span className={styles.price}>{formatPrice(p.minPrice.amount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
