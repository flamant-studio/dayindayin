import Link from 'next/link'
import styles from './not-found.module.css'

export const metadata = {
  title: '404 — Page not found',
  description: 'This page does not exist.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Nothing here</h1>
        <p className={styles.text}>
          The page you&apos;re looking for doesn&apos;t exist, or may have moved. Some works get retired, some links evolve.
        </p>
        <form method="GET" action="/search" className={styles.searchForm}>
          <input
            type="search"
            name="q"
            placeholder="Search prints, series, works…"
            className={styles.searchInput}
            autoComplete="off"
          />
          <button type="submit" className={styles.searchBtn} aria-label="Search">→</button>
        </form>
        <div className={styles.actions}>
          <Link href="/shop" className={styles.primary}>Browse the shop</Link>
          <Link href="/" className={styles.secondary}>Back to home</Link>
        </div>
        <div className={styles.also}>
          <Link href="/fine-art" className={styles.alsoLink}>Fine Art</Link>
          <span className={styles.alsoDot}>·</span>
          <Link href="/fine-art?view=grid" className={styles.alsoLink}>All Works</Link>
        </div>
      </div>
    </div>
  )
}
