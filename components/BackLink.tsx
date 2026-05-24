'use client'
import styles from './BackLink.module.css'

export default function BackLink() {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (
      typeof document !== 'undefined' &&
      document.referrer &&
      document.referrer.startsWith(window.location.origin) &&
      document.referrer.includes('/shop')
    ) {
      e.preventDefault()
      window.history.back()
    }
  }

  return (
    <div className={styles.back}>
      <a href="/shop" className={styles.backLink} onClick={handleClick}>
        &larr; Back to shop
      </a>
    </div>
  )
}
