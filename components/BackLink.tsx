import Link from 'next/link'
import styles from './BackLink.module.css'

export default function BackLink() {
  return (
    <div className={styles.back}>
      <Link href="/shop" className={styles.backLink}>
        ← Back to shop
      </Link>
    </div>
  )
}
