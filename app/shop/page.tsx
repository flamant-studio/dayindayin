import Link from 'next/link'
import { getProducts, getProductsByTag, formatPrice, categoryLabel } from '@/lib/shopify/products'
import styles from './page.module.css'

export const metadata = {
  title: 'Shop',
  description: 'Art prints, canvases, and wall hangings by Stine Weirsøe Flamant. Printed by Gelato. Ships to EU, UK, and Norway.',
}

const SUBNAV = [
  { label: 'All', value: null },
  { label: 'Tufted Works', value: 'tufting' },
  { label: 'Embroidery', value: 'embroidery' },
  { label: 'Painting', value: 'painting' },
  { label: 'Photography', value: 'photography' },
  { label: 'Tote Bags', value: 'tote' },
  { label: 'Greeting Cards', value: 'greeting-card' },
]

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ShopPage({ searchParams }: PageProps) {
  const { category } = await searchParams
  const activeTag = SUBNAV.find((i) => i.value === category)?.value ?? null

  const raw = activeTag
    ? await getProductsByTag(activeTag, 200).catch(() => [])
    : await getProducts(200).catch(() => [] as Awaited<ReturnType<typeof getProducts>>)

  // Hide products with no image yet (Gelato previews generate async)
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
        {SUBNAV.map((item) => {
          const isActive = item.value === activeTag
          const href = item.value ? `/shop?category=${item.value}` : '/shop'
          return (
            <Link
              key={item.label}
              href={href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              {item.label}
            </Link>
          )
        })}
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
