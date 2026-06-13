import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts, formatPrice, categoryLabel } from '@/lib/shopify/products'
import styles from './page.module.css'
import shopStyles from '../shop/page.module.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Search',
  description: 'Search art prints and works by Stine Weirsøe Flamant.',
}

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  let results: Awaited<ReturnType<typeof getAllProducts>> = []

  if (query) {
    const all = await getAllProducts().catch(() => [])
    const lower = query.toLowerCase()
    results = all.filter((p) => {
      if (p.title.toLowerCase().includes(lower)) return true
      if (p.description.toLowerCase().includes(lower)) return true
      if (p.tags.some((t) => t.toLowerCase().includes(lower))) return true
      return false
    }).filter((p) => p.firstImage)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Search</h1>
        {query && results.length > 0 && (
          <p className={styles.resultCount}>{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</p>
        )}
        {query && results.length === 0 && (
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

      {query && results.length === 0 && (
        <div className={shopStyles.empty}>
          <p>No products matched your search.</p>
          <Link href="/shop" className={shopStyles.emptyCta}>Browse all products</Link>
        </div>
      )}

      {results.length > 0 && (
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
                <span className={shopStyles.cardTitle}>{p.title}</span>
                <span className={shopStyles.cardType}>{categoryLabel(p)}</span>
                <span className={shopStyles.cardPrice}>{formatPrice(p.minPrice.amount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
