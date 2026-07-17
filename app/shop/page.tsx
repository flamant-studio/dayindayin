import Link from 'next/link'
import { getAllProducts, categoryLabel } from '@/lib/shopify/products'
import ShopFilterNav from '@/components/ShopFilterNav'
import FluidTracker from '@/components/FluidTracker'
import ProductCard from '@/components/ProductCard'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Shop',
  description: 'Art prints, canvases, and wall hangings by Stine Weirsøe Flamant. Printed by Gelato. Ships to EU, UK, and Norway.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop — Day In Day In',
    description: 'Art prints by Stine Weirsøe Flamant. Printed by Gelato. Ships across EU, UK, and Norway from 56 kr.',
    images: [{ url: 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works/tufting/neko-cat-orange.jpg', width: 1200, height: 900 }],
  },
}

const SERIES_VALUES = ['shero', 'neko', 'sea-monsters', 'floral', 'masks', 'tourism']

const FILTER_LABELS: Record<string, string> = {
  'art-print':      'Art Prints',
  'framed':         'Framed Prints',
  'poster':         'Posters',
  'mug':            'Mugs',
  'apparel':        'Apparel',
  'tote':           'Tote Bags',
  'postcard':       'Postcards',
  'greeting-card':  'Greeting Cards',
  'water-bottle':   'Water Bottles',
  'wood-print':     'Wood Prints',
  'shero':          'SHERO',
  'neko':           'NEKO',
  'sea-monsters':   'Sea Monsters',
  'floral':         'Floral',
  'masks':          'Masks',
  'tourism':        'Tourism',
}

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

  // All filters use getAllProducts() — type filters use categoryLabel(), series use title regex
  const isTypeFilter = activeTag !== null && !SERIES_VALUES.includes(activeTag)
  const raw = await getAllProducts().catch(() => [])

  const TYPE_LABEL_MAP: Record<string, string> = {
    'art-print':     'Art Print',
    'framed':        'Framed Print',
    'poster':        'Poster',
    'mug':           'Mug',
    'apparel':       'Apparel',
    'tote':          'Tote Bag',
    'postcard':      'Postcard',
    'greeting-card': 'Greeting Card',
    'water-bottle':  'Water Bottle',
    'wood-print':    'Wood Print',
  }

  const SERIES_TITLE_PATTERNS: Record<string, RegExp> = {
    'shero':        /\bshero\b/i,
    'neko':         /\bneko\b/i,
    'sea-monsters': /sea[\s-]monster/i,
    'floral':       /floral/i,
    'masks':        /\bmasks?\b|\bfaces?\b/i,
    'tourism':      /\btourism\b/i,
  }

  let products = raw.filter((p) => {
    if (!p.firstImage) return false
    if (activeTag) {
      if (isTypeFilter) {
        const targetLabel = TYPE_LABEL_MAP[activeTag]
        return targetLabel ? categoryLabel(p) === targetLabel : false
      }
      const pattern = SERIES_TITLE_PATTERNS[activeTag]
      return pattern ? pattern.test(p.title) : false
    }
    return true
  })

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

  // Compute per-type and per-series counts for filter nav (from raw, ignoring active filter)
  const allWithImages = raw.filter(p => p.firstImage)
  const typeCounts: Record<string, number> = {}
  const seriesCounts: Record<string, number> = {}
  for (const p of allWithImages) {
    const label = categoryLabel(p)
    const typeKey = Object.entries(TYPE_LABEL_MAP).find(([, v]) => v === label)?.[0]
    if (typeKey) typeCounts[typeKey] = (typeCounts[typeKey] ?? 0) + 1
    for (const [series, pattern] of Object.entries(SERIES_TITLE_PATTERNS)) {
      if (pattern.test(p.title)) seriesCounts[series] = (seriesCounts[series] ?? 0) + 1
    }
  }

  // Build sort link href helper
  function sortHref(sortVal: string) {
    const params = new URLSearchParams()
    if (activeTag) params.set('filter', activeTag)
    if (sortVal !== 'newest') params.set('sort', sortVal)
    const qs = params.toString()
    return qs ? `/shop?${qs}` : '/shop'
  }

  function clearFilterHref() {
    const params = new URLSearchParams()
    if (activeSort !== 'newest') params.set('sort', activeSort)
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

  return (
    <div className={styles.page}>
      <FluidTracker collectionHandle={activeTag ?? 'all'} />
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Shop</h1>
          {products.length > 0 && (
            <p className={styles.subtitle}>
              {showAll
                ? `${totalCount} products`
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
          {activeTag && FILTER_LABELS[activeTag] && (
            <span className={styles.filterChip}>
              {FILTER_LABELS[activeTag]}
              <Link href={clearFilterHref()} className={styles.filterChipClear} aria-label="Clear filter">×</Link>
            </span>
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

      <ShopFilterNav activeTag={activeTag} typeCounts={typeCounts} seriesCounts={seriesCounts} totalCount={allWithImages.length} />

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>{activeTag ? `Nothing in this filter yet — check back soon.` : 'No products yet — check back soon.'}</p>
          {activeTag && <Link href="/shop" className={styles.emptyCta}>Browse all products</Link>}
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {displayed.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
          {hasMore && (
            <div className={styles.loadMore}>
              <Link href={showAllHref()} className={styles.loadMoreLink}>
                Show all {totalCount} products →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
