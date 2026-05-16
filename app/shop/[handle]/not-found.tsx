import Link from 'next/link'
import styles from './not-found.module.css'

export default function ProductNotFound() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Product not found</h1>
      <p className={styles.text}>
        This product doesn&apos;t exist or may have been removed.
      </p>
      <Link href="/shop" className={styles.cta}>
        Back to shop
      </Link>
    </div>
  )
}
