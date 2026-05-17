import Link from 'next/link'
import styles from './not-found.module.css'

export const metadata = {
  title: '404 — Day In Day In',
}

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Nothing here</h1>
        <p className={styles.text}>
          The page you&apos;re looking for doesn&apos;t exist, or may have moved.
        </p>
        <div className={styles.actions}>
          <Link href="/shop" className={styles.primary}>Browse the shop</Link>
          <Link href="/" className={styles.secondary}>Back to home</Link>
        </div>
      </div>
    </div>
  )
}
