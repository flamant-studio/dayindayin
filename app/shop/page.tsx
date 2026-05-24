import Link from 'next/link'
import Image from 'next/image'
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

const SERIES_VALUES = ['shero', 'neko', 'sea-monsters', 'botanical', 'floral', 'faces', 'sommerby']

const SERIES_NAV = [
  { label: 'All series', value: null },
  { label: 'SHERO', value: 'shero' },
  { label: 'NEKO', value: 'neko' },
  { label: 'Sea Monsters', value: 'sea-monsters' },
  { label: 'Botanical', value: 'botanical' },
  { label: 'Floral', value: 'floral' },
  { label: 'Faces', value: 'faces' },
  { label: 'Sommerby', value: 'sommerby' },
]

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price ↑', value: 'price-asc' },
  { label: 'Price ↓', value: 'price-desc' },
]

const PAGE_SIZE = 48

interface PageProps {
  searchParams: Promise<{ filter?: string; sort?: string; limit?: string }>
}

export default async function ShopPage({ searchParams }: PageProps) {
  const { filter, sort, limit } = await searchParams
  const activeTag = filter ?? null
  const activeSort = sort ?? 'newest'
  const showAll = limit === 'all'

  const raw = activeTag
    ? await getProductsByTag(activeTag, 200).catch(() => [])
    : await getProducts(200).catch(() => [] as Awaited<ReturnType<typeof getProducts>>)

  let products = raw.filter((p) => p.firstImage)

  // Apply sort
  if (activeSort === 'price-asc') {
    products = [...products].sort((a, b) => parseFloat(a.minPrice.amount) - parseFloat(b.minPrice.amount))
  } else if (activeSort === 'price-desc') {
    products = [...products].sort((a, b) => parseFloat(b.minPrice.amount) - parseFloat(a.minPrice.amount))
  }
  // 'newest' keeps API order

  const totalCount = products.length
  const displayed = showAll ? products : products.slice(0, PAGE_SIZE)
  const hasMore = !showAll && totalCount > PAGE_SIZE

  // Build sort link href helper
  function sortHref(sortVal: string) {
    const params = new URLSearchParams()
    if (activeTag) params.set('filter', activeTag)
    if (sortVal !== 'newest') params.set('sort', sortVal)
    const qs = params.toString()
    return qs ? `/shop?${qs}` : '/shop'
  }

  // Build show-all href (preserve filter + sort)
  function showAllHref() {
    const params = new URLSearchParams()
    if (activeTag) params.set('filter', activeTag)
    if (activeSort !== 'newest') params.set('sort', activeSort)
    params.set('limit', 'all')
    return `/shop?${params.toString()}`
  }

  // Determine series active state: active when tag matches a series value,
  // "All series" active when no tag OR tag doesn't match any series
  const isSeriesFilter = activeTag !== null && SERIES_VALUES.includes(activeTag)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Shop</h1>
          {products.length > 0 && (
            <p className={styles.subtitle}>
              {showAll
                ? `${totalCount} works available`
                : `Showing ${Math.min(PAGE_SIZE, totalCount)} of ${totalCount}`}
            </p>
          )}
        </div>
        <div className={styles.sortRow}>
          {SORT_OPTIONS.map((opt) => {
            const isActive = activeSort === opt.value
            return (
              <Link
                key={opt.value}
                href={sortHref(opt.value)}
                className={`${styles.sortLink} ${isActive ? styles.sortLinkActive : ''}`}
              >
                {opt.label}
              </Link>
            )
          })}
        </div>
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
            const isActive =
              item.value === null
                ? !isSeriesFilter
                : item.value === activeTag
            const href = item.value ? `/shop?filter=${item.value}` : '/shop'
            return (
              <Link key={item.label} href={href}
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
        <>
          <div className={styles.grid}>
            {displayed.map((p) => (
              <Link key={p.id} href={`/shop/${p.handle}`} className={styles.card}>
                <div className={styles.cardImg}>
                  <Image
                    src={p.firstImage!.url}
                    alt={p.firstImage!.altText ?? p.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1100px) 33vw, 25vw"
                    className={styles.cardImgEl}
                  />
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{p.title}</span>
                  <span className={styles.cardType}>{categoryLabel(p)}</span>
                  <span className={styles.cardPrice}>{formatPrice(p.minPrice.amount)}</span>
                </div>
              </Link>
            ))}
          </div>
          {hasMore && (
            <div className={styles.loadMore}>
              <Link href={showAllHref()} className={styles.loadMoreLink}>
                Show all {totalCount} works →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
