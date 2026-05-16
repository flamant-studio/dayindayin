import styles from './page.module.css'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      {children}
    </div>
  )
}
