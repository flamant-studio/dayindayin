import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts, formatPrice, categoryLabel } from '@/lib/shopify/products'
import { displayTitle } from '@/lib/display'
import { works } from '@/lib/data'
import styles from './page.module.css'
import shopStyles from '../shop/page.module.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Search',
  description: 'Search art prints and works by Stine Weirsøe Flamant.',
  robots: { index: false, follow: true },
}

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  let results: Awaited<ReturnType<typeof getAllProducts>> = []
  let workResults: typeof works = []

  if (query) {
    const all = await getAllProducts().catch(() => [])
    const lower = query.toLowerCase()
    results = all.filter((p) => {
      if (p.title.toLowerCase().includes(lower)) return true
      if (p.description.toLowerCase().includes(lower)) return true
      if (p.tags.some((t) => t.toLowerCase().includes(lower))) return true
      return false
    }).filter((p) => p.firstImage)

    workResults = works.filter(w => {
      if (w.title.toLowerCase().includes(lower)) return true
      if (w.description.toLowerCase().includes(lower)) return true
      if (w.category.toLowerCase().includes(lower)) return true
      return false
    })
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Search</h1>
        {query && (results.length > 0 || workResults.length > 0) && (
          <p className={styles.resultCount}>{results.length + workResults.length} result{(results.length + workResults.length) !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</p>
        )}
        {query && results.length === 0 && workResults.length === 0 && (
          <p className={styles.resultCount}>No results for &ldquo;{query}&rdquo;</p>
        )}
      </header>

      <div className={styles.searchBar}>
        <form method="GET" action="/search" className={styles.form}>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search products, series, tags…"
            className={styles.input}
            autoFocus
          />
          <button type="submit" className={styles.button}>Search</button>
        </form>
      </div>

      {!query && (
        <div className={styles.suggestions}>
          <p className={styles.suggestionsLabel}>Try searching for</p>
          <div className={styles.suggestionsList}>
            {['SHERO', 'NEKO', 'Sea Monsters', 'Botanical', 'Floral', 'Faces', 'Sommerby', 'mug', 'poster', 'tote', 'postcard', 'framed'].map((term) => (
              <a key={term} href={`/search?q=${encodeURIComponent(term)}`} className={styles.suggestionChip}>{term}</a>
            ))}
          </div>
        </div>
      )}

      {query && results.length === 0 && workResults.length === 0 && (
        <div className={styles.noResults}>
          <p className={styles.noResultsText}>Nothing matched &ldquo;{query}&rdquo;.</p>
          <p className={styles.noResultsHint}>Try a series name (SHERO, NEKO, Botanical) or product type (mug, poster, tote).</p>
          <div className={styles.noResultsLinks}>
            <Link href="/shop" className={styles.noResultsCta}>Browse all products</Link>
            <Link href="/archive" className={styles.noResultsAlt}>View original works →</Link>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <>
          {workResults.length > 0 && <p className={styles.suggestionsLabel} style={{ padding: 'var(--sp-4) var(--sp-6) 0' }}>Prints ({results.length})</p>}
          <div className={shopStyles.grid}>
            {results.map((p) => (
              <Link key={p.id} href={`/shop/${p.handle}`} className={shopStyles.card}>
                <div className={shopStyles.cardImg}>
                  <Image
                    src={p.firstImage!.url}
                    alt={p.firstImage!.altText ?? p.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1100px) 33vw, 25vw"
                    className={shopStyles.cardImgEl}
                  />
                </div>
                <div className={shopStyles.cardInfo}>
                  <span className={shopStyles.cardTitle}>{displayTitle(p.title)}</span>
                  <span className={shopStyles.cardType}>{categoryLabel(p)}</span>
                  <span className={shopStyles.cardPrice}>{formatPrice(p.minPrice.amount)}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {workResults.length > 0 && (
        <>
          <p className={styles.suggestionsLabel} style={{ padding: 'var(--sp-6) var(--sp-6) var(--sp-3)' }}>
            Original works ({workResults.length})
          </p>
          <div className={shopStyles.grid}>
            {workResults.map((w) => (
              <Link key={w.slug} href={`/works/${w.slug}`} className={shopStyles.card}>
                <div className={shopStyles.cardImg}>
                  <Image
                    src={w.image}
                    alt={w.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1100px) 33vw, 25vw"
                    className={shopStyles.cardImgEl}
                  />
                </div>
                <div className={shopStyles.cardInfo}>
                  <span className={shopStyles.cardTitle}>{w.title}</span>
                  <span className={shopStyles.cardType}>{w.category.charAt(0).toUpperCase() + w.category.slice(1)} · {w.year}</span>
                  <span className={shopStyles.cardPrice}>Original — enquire</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
