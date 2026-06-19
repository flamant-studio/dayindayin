import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts, getAllProductsByTag, formatPrice, categoryLabel, seriesLabel } from '@/lib/shopify/products'
import ShopFilterNav from '@/components/ShopFilterNav'
import WishlistButton from '@/components/WishlistButton'
import ShoppingNudge from '@/components/ShoppingNudge'
import FluidTracker from '@/components/FluidTracker'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Shop',
  description: 'Art prints, canvases, and wall hangings by Stine Weirsøe Flamant. Printed by Gelato. Ships to EU, UK, and Norway.',
}

const SERIES_VALUES = ['shero', 'neko', 'sea-monsters', 'botanical', 'floral', 'faces', 'sommerby']

const SERIES_DESCRIPTIONS: Record<string, string> = {
  shero: 'Feminist pop-art in bold textile and print. The SHERO series celebrates strength, resistance, and the power of naming.',
  neko: 'Cats as symbols — of independence, curiosity, and quiet rebellion. The NEKO series began in 2022 and keeps growing.',
  'sea-monsters': 'Imaginary creatures from somewhere beneath the surface. The Sea Monsters series plays with fear, beauty, and the unknown.',
  botanical: 'Plants, growth, and the patient life of natural forms. Observed from the studio and from the edges of roads.',
  floral: 'Bold, close-up florals that push colour and form to the edge of abstraction.',
  faces: 'Portraits, masks, and the human face in all its complexity — from Sri Lanka to the Copenhagen streets.',
  sommerby: 'Work from the Sommerby summer series — warm, loose, and full of Danish light.',
}

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
  'botanical':      'Botanical',
  'floral':         'Floral',
  'faces':          'Faces',
  'sommerby':       'Sommerby',
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

  // Series filters use Shopify tag queries; type filters use title-based categoryLabel matching
  const isTypeFilter = activeTag !== null && !SERIES_VALUES.includes(activeTag)
  const raw = (activeTag && !isTypeFilter)
    ? await getAllProductsByTag(activeTag).catch(() => [])
    : await getAllProducts().catch(() => [])

  // Map filter keys to categoryLabel() return values for title-based matching
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

  let products = raw.filter((p) => {
    if (!p.firstImage) return false
    if (isTypeFilter && activeTag) {
      const targetLabel = TYPE_LABEL_MAP[activeTag]
      return targetLabel ? categoryLabel(p) === targetLabel : true
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

  // Determine series active state: active when tag matches a series value,
  // "All series" active when no tag OR tag doesn't match any series
  const isSeriesFilter = activeTag !== null && SERIES_VALUES.includes(activeTag)

  return (
    <div className={styles.page}>
      <FluidTracker collectionHandle={activeTag ?? 'all'} />
      <ShoppingNudge />
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
          <p className={styles.socialProof}>300+ prints shipped to EU &amp; UK</p>
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

      <ShopFilterNav activeTag={activeTag} />

      {isSeriesFilter && activeTag && SERIES_DESCRIPTIONS[activeTag] && (
        <div className={styles.seriesBanner}>
          <p className={styles.seriesBannerText}>{SERIES_DESCRIPTIONS[activeTag]}</p>
        </div>
      )}

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>{activeTag ? `Nothing in this filter yet — check back soon.` : 'No products yet — check back soon.'}</p>
          {activeTag && <Link href="/shop" className={styles.emptyCta}>Browse all products</Link>}
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {displayed.map((p, i) => (
              <Link key={p.id} href={`/shop/${p.handle}`} className={styles.card}>
                <div className={styles.cardImg}>
                  <Image
                    src={p.firstImage!.url}
                    alt={p.firstImage!.altText ?? p.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1100px) 33vw, 25vw"
                    className={styles.cardImgEl}
                    priority={i < 4}
                  />
                  <WishlistButton
                    handle={p.handle}
                    title={p.title}
                    imageUrl={p.firstImage?.url ?? null}
                    price={formatPrice(p.minPrice.amount)}
                  />
                  {seriesLabel(p) && (
                    <span className={styles.cardBadge}>{seriesLabel(p)}</span>
                  )}
                  <div className={styles.cardHoverOverlay}>
                    <span className={styles.cardViewHint}>View product →</span>
                  </div>
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
                Show all {totalCount} products →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
