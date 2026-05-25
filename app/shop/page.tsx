import Link from 'next/link'
import Image from 'next/image'
import { getProducts, getProductsByTag, formatPrice, categoryLabel } from '@/lib/shopify/products'
import ShopFilterNav from '@/components/ShopFilterNav'
import WishlistButton from '@/components/WishlistButton'
import styles from './page.module.css'

export const metadata = {
  title: 'Shop',
  description: 'Art prints, canvases, and wall hangings by Stine Weirsøe Flamant. Printed by Gelato. Ships to EU, UK, and Norway.',
}

const SERIES_VALUES = ['shero', 'neko', 'sea-monsters', 'botanical', 'floral', 'faces', 'sommerby']

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

  const NON_PRINT_TAGS = ['tote', 'greeting-card']

  const raw = activeTag === 'art-print'
    ? (await getProducts(200).catch(() => [] as Awaited<ReturnType<typeof getProducts>>)).filter(
        p => !p.tags.some(t => NON_PRINT_TAGS.includes(t.toLowerCase()))
      )
    : activeTag
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
                : (
                  <>
                    Showing {Math.min(PAGE_SIZE, totalCount)} of {totalCount}
                    {totalCount > PAGE_SIZE && (
                      <Link href={showAllHref()} className={styles.showAllInline}>— show all</Link>
                    )}
                  </>
                )
              }
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

      <ShopFilterNav activeTag={activeTag} />

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>{activeTag ? `Nothing in this filter yet — check back soon.` : 'No products yet — check back soon.'}</p>
          {activeTag && <Link href="/shop" className={styles.emptyCta}>Browse all works</Link>}
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
                  <WishlistButton
                    handle={p.handle}
                    title={p.title}
                    imageUrl={p.firstImage?.url ?? null}
                    price={formatPrice(p.minPrice.amount)}
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
