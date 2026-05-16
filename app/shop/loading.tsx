import styles from './loading.module.css'

export default function ShopLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleSkeleton} />
        <div className={styles.subtitleSkeleton} />
      </div>
      <div className={styles.grid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.imageSkeleton} />
            <div className={styles.info}>
              <div className={styles.titleLineSkeleton} />
              <div className={styles.priceSkeleton} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
