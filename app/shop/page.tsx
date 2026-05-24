import Link from 'next/link'
import { getProducts, getProductsByTag, formatPrice, categoryLabel } from '@/lib/shopify/products'
import styles from './page.module.css'

export const metadata = {
  title: 'Shop',
  description: 'Art prints, canvases, and wall hangings by Stine Weirsøe Flamant. Printed by Gelato. Ships to EU, UK, and Norway.',
}

const TYPE_NAV = [
  { label: 'All', value: null },
  { label: 'Tufted Works', value: 'tufting' },
  { label: 'Embroidery', value: 'embroidery' },
  { label: 'Painting', value: 'painting' },
  { label: 'Photography', value: 'photography' },
  { label: 'Tote Bags', value: 'tote' },
  { label: 'Greeting Cards', value: 'greeting-card' },
]

const SERIES_NAV = [
  { label: 'SHERO', value: 'shero' },
  { label: 'NEKO', value: 'neko' },
  { label: 'Sea Monsters', value: 'sea-monsters' },
  { label: 'Botanical', value: 'botanical' },
  { label: 'Floral', value: 'floral' },
  { label: 'Faces', value: 'faces' },
  { label: 'Sommerby', value: 'sommerby' },
]

interface PageProps {
  searchParams: Promise<{ filter?: string }>
}

export default async function ShopPage({ searchParams }: PageProps) {
  const { filter } = await searchParams
  const activeTag = filter ?? null

  const raw = activeTag
    ? await getProductsByTag(activeTag, 200).catch(() => [])
    : await getProducts(200).catch(() => [] as Awaited<ReturnType<typeof getProducts>>)

  const products = raw.filter((p) => p.firstImage)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Shop</h1>
        {products.length > 0 && (
          <p className={styles.subtitle}>{products.length} works available</p>
        )}
      </header>

      <nav className={styles.subnav}>
        <div className={styles.subnavRow}>
          <span className={styles.subnavLabel}>Type</span>
          {TYPE_NAV.map((item) => {
            const isActive = item.value === activeTag || (item.value === null && !activeTag)
            const href = item.value ? `/shop?filter=${item.value}` : '/shop'
            return (
              <Link key={item.label} href={href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
                {item.label}
              </Link>
            )
          })}
        </div>
        <div className={styles.subnavRow}>
          <span className={styles.subnavLabel}>Series</span>
          {SERIES_NAV.map((item) => {
            const isActive = item.value === activeTag
            return (
              <Link key={item.label} href={`/shop?filter=${item.value}`}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>No works in this category yet. Check back soon.</p>
          <Link href="/shop" className={styles.emptyCta}>Browse all works</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((p) => (
            <Link key={p.id} href={`/shop/${p.handle}`} className={styles.card}>
              <div className={styles.cardImg}>
                <img src={p.firstImage!.url} alt={p.firstImage!.altText ?? p.title} />
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.cardTitle}>{p.title}</span>
                <span className={styles.cardType}>{categoryLabel(p)}</span>
                <span className={styles.cardPrice}>{formatPrice(p.minPrice.amount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
