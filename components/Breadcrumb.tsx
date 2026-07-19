import Link from 'next/link'
import styles from './Breadcrumb.module.css'

export interface Crumb {
  label: string
  /** Omit href on the last (current) item. */
  href?: string
}

/**
 * The one breadcrumb. Always rendered at the top of detail pages.
 * Last item is the current page (no link). See DESIGN_SYSTEM.md › Breadcrumb.
 */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <span key={`${item.label}-${i}`} className={styles.item}>
            {item.href && !last ? (
              <Link href={item.href} className={styles.link}>{item.label}</Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
            {!last && <span className={styles.sep} aria-hidden="true">/</span>}
          </span>
        )
      })}
    </nav>
  )
}
