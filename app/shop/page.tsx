import Link from 'next/link'
import { getProducts, formatPrice } from '@/lib/shopify/products'
import styles from './page.module.css'

export const metadata = {
  title: 'Shop',
  description: 'Art prints, canvases, and wall hangings by Stine Weirsøe Flamant. Printed by Gelato. Ships to EU, UK, and Norway.',
}

const FILTERS = [
  { label: 'All',         href: '/shop' },
  { label: 'Tufted',     href: '/shop/collections/tufted-works' },
  { label: 'Embroidery', href: '/shop/collections/embroidery' },
  { label: 'Paintings',  href: '/shop/collections/paintings' },
  { label: 'Photography',href: '/shop/collections/photography' },
  { label: 'Mixed',      href: '/shop/collections/mixed' },
  { label: 'Archive',    href: '/shop/collections/archive' },
]

export default async function ShopPage() {
  const products = await getProducts(96).catch(() => [] as Awaited<ReturnType<typeof getProducts>>)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Shop</h1>
        <p className={styles.subtitle}>
          {products.length > 0
            ? `${products.length} prints available`
            : 'Art prints by Stine Weirsøe Flamant. Printed by Gelato on demand.'}
        </p>
      </header>

      <div className={styles.filterBar}>
        {FILTERS.map((f) => (
          <Link key={f.href} href={f.href} className={styles.filter}>
            {f.label}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>Products are being set up. Check back shortly.</p>
          <Link href="/about" className={styles.emptyCta}>About the artist</Link>
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
