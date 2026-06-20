import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts, formatPrice, formatPriceLabel, categoryLabel, seriesLabel, isArtworkProduct } from '@/lib/shopify/products'
import { displayTitle } from '@/lib/display'
import ShopFilterNav from '@/components/ShopFilterNav'
import WishlistButton from '@/components/WishlistButton'
import ShoppingNudge from '@/components/ShoppingNudge'
import FluidTracker from '@/components/FluidTracker'
import QuickAddButton from '@/components/QuickAddButton'
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

const SERIES_VALUES = ['shero', 'neko', 'sea-monsters', 'botanical', 'floral', 'faces', 'sommerby']

const SERIES_DESCRIPTIONS: Record<string, string> = {
  shero: 'Feminist pop-art in bold textile and print. The SHERO series celebrates strength, resistance, and the power of naming.',
  neko: 'Cats as symbols — of independence, curiosity, and quiet rebellion. The NEKO series began in 2022 and keeps growing.',
  'sea-monsters': 'Imaginary creatures from somewhere beneath the surface. The Sea Monsters series plays with fear, beauty, and the unknown.',
  botanical: 'Plants, growth, and the patient life of natural forms. Observed from the studio and from the edges of roads.',
  floral: 'Bold, close-up florals that push colour and form to the edge of abstraction.',
  faces: 'Portraits, masks, and the human face in all its complexity — from Sri Lanka to the Copenhagen streets.',
  sommerby: 'A Danish summer in paint — long evenings, pale light, the particular peace of a place you return to every year. Stine has been painting Sommerby since 2021.',
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
    'botanical':    /botanical/i,
    'floral':       /floral/i,
    'faces':        /\bfaces?\b/i,
    'sommerby':     /sommerby/i,
  }

  let products = raw.filter((p) => {
    if (!p.firstImage) return false
    if (activeTag) {
      if (isTypeFilter) {
        const targetLabel = TYPE_LABEL_MAP[activeTag]
        return targetLabel ? categoryLabel(p) === targetLabel : true
      }
      const pattern = SERIES_TITLE_PATTERNS[activeTag]
      return pattern ? pattern.test(p.title) : true
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
          <p className={styles.socialProof}>300+ products · Printed by Gelato · Ships to EU, UK &amp; Norway</p>
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
                <div className={`${styles.cardImg} ${categoryLabel(p) === 'Framed Print' ? styles.cardImgMockup : isArtworkProduct(p) ? styles.cardImgArtwork : styles.cardImgMockup}`}>
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
                    title={displayTitle(p.title)}
                    imageUrl={p.firstImage?.url ?? null}
                    price={formatPrice(p.minPrice.amount)}
                  />
                  {seriesLabel(p) && (
                    <span className={styles.cardBadge}>{seriesLabel(p)}</span>
                  )}
                  <div className={styles.cardHoverOverlay}>
                    {p.variants.length === 1 && p.firstVariant?.title === 'Default Title' && p.firstVariant.availableForSale ? (
                      <QuickAddButton merchandiseId={p.firstVariant.id} title={p.title} />
                    ) : (
                      <span className={styles.cardViewHint}>View product →</span>
                    )}
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{displayTitle(p.title)}</span>
                  <span className={styles.cardType}>{categoryLabel(p)}</span>
                  <span className={styles.cardPrice}>{formatPriceLabel(p)}</span>
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

      <div className={styles.podBanner}>
        <div className={styles.podItem}>
          <svg className={styles.podIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
          </svg>
          <span className={styles.podLabel}>Printed to order</span>
          <span className={styles.podText}>Every print is made when you order it — no bulk inventory.</span>
        </div>
        <div className={styles.podItem}>
          <svg className={styles.podIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          <span className={styles.podLabel}>Ships in 5–10 days</span>
          <span className={styles.podText}>Printed by Gelato and shipped directly to your door across Europe.</span>
        </div>
        <div className={styles.podItem}>
          <svg className={styles.podIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>
          </svg>
          <span className={styles.podLabel}>Original artwork</span>
          <span className={styles.podText}>Every print comes from Stine&apos;s original art — nothing is generated or licensed in.</span>
        </div>
      </div>
    </div>
  )
}
