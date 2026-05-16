import styles from './loading.module.css'

export default function ProductLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.back}>
        <div className={styles.backSkeleton} />
      </div>
      <div className={styles.layout}>
        <div className={styles.imageSkeleton} />
        <div className={styles.info}>
          <div className={styles.typeSkeleton} />
          <div className={styles.titleSkeleton} />
          <div className={styles.priceSkeleton} />
          <div className={styles.descSkeleton} />
          <div className={styles.descSkeleton} style={{ width: '80%' }} />
          <div className={styles.btnSkeleton} />
        </div>
      </div>
    </div>
  )
}
