import Link from 'next/link'
import styles from './SectionHeading.module.css'

interface Props {
  /** Small uppercase eyebrow above the title */
  label?: string
  title: string
  /** Tagline / subtitle below the title */
  subtitle?: string
  /** Right-aligned "view all" link (arrow appended automatically) */
  viewAll?: { href: string; label: string }
  align?: 'left' | 'center'
  className?: string
}

/**
 * The one section heading: optional eyebrow + H2 + optional subtitle,
 * with an optional right-aligned "view all →" link. Opens grids/sections
 * across the site. See DESIGN_SYSTEM.md › Section heading.
 */
export default function SectionHeading({
  label,
  title,
  subtitle,
  viewAll,
  align = 'left',
  className = '',
}: Props) {
  return (
    <div
      className={[styles.head, align === 'center' ? styles.center : '', className].filter(Boolean).join(' ')}
    >
      <div className={styles.titleBlock}>
        {label && <span className={styles.label}>{label}</span>}
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {viewAll && (
        <Link href={viewAll.href} className={styles.viewAll}>
          {viewAll.label} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  )
}
