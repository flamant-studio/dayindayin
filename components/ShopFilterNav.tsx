'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './ShopFilterNav.module.css'

const TYPE_NAV = [
  { label: 'All', value: null },
  { label: 'Art Prints', value: 'art-print' },
  { label: 'Framed Prints', value: 'framed' },
  { label: 'Posters', value: 'poster' },
  { label: 'Mugs', value: 'mug' },
  { label: 'Apparel', value: 'apparel' },
  { label: 'Tote Bags', value: 'tote' },
  { label: 'Postcards', value: 'postcard' },
  { label: 'Greeting Cards', value: 'greeting-card' },
  { label: 'Water Bottles', value: 'water-bottle' },
  { label: 'Wood Prints', value: 'wood-print' },
]

const SERIES_VALUES = ['shero', 'neko', 'sea-monsters', 'botanical', 'floral', 'masks', 'tourism']

const SERIES_NAV = [
  { label: 'All series', value: null },
  { label: 'SHERO', value: 'shero' },
  { label: 'NEKO', value: 'neko' },
  { label: 'Sea Monsters', value: 'sea-monsters' },
  { label: 'Botanical', value: 'botanical' },
  { label: 'Floral', value: 'floral' },
  { label: 'Masks', value: 'masks' },
  { label: 'Tourism', value: 'tourism' },
]

const ALL_NAV = [...TYPE_NAV.filter(n => n.value), ...SERIES_NAV.filter(n => n.value)]

function getActiveLabel(tag: string | null): string | null {
  if (!tag) return null
  return ALL_NAV.find(n => n.value === tag)?.label ?? tag
}

interface Props {
  activeTag: string | null
  typeCounts?: Record<string, number>
  seriesCounts?: Record<string, number>
  totalCount?: number
}

export default function ShopFilterNav({ activeTag, typeCounts, seriesCounts, totalCount }: Props) {
  const isSeriesFilter = activeTag !== null && SERIES_VALUES.includes(activeTag)
  const [open, setOpen] = useState(false)
  const activeLabel = getActiveLabel(activeTag)

  return (
    <nav className={styles.subnav}>
      <button
        type="button"
        className={styles.mobileToggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="shop-filters"
      >
        <span>Filter &amp; Sort{activeLabel ? ` — ${activeLabel}` : ''}</span>
        <span className={`${styles.mobileToggleIcon} ${open ? styles.mobileToggleIconOpen : ''}`} aria-hidden="true">▾</span>
      </button>
      <div id="shop-filters" className={`${styles.rows} ${open ? styles.rowsOpen : ''}`}>
        <div className={styles.subnavRow}>
          <span className={styles.subnavLabel}>Type</span>
          {TYPE_NAV.map((item) => {
            const isActive = item.value === activeTag || (item.value === null && !activeTag)
            const href = item.value ? `/shop?filter=${item.value}` : '/shop'
            const count = item.value ? typeCounts?.[item.value] : totalCount
            return (
              <Link
                key={item.label}
                href={href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {count !== undefined && count > 0 && <span className={styles.navCount}>{count}</span>}
              </Link>
            )
          })}
        </div>
        <div className={styles.subnavRow}>
          <span className={styles.subnavLabel}>Series</span>
          {SERIES_NAV.map((item) => {
            const isActive = item.value === null ? !isSeriesFilter : item.value === activeTag
            const href = item.value ? `/shop?filter=${item.value}` : '/shop'
            const count = item.value ? seriesCounts?.[item.value] : totalCount
            return (
              <Link
                key={item.label}
                href={href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {count !== undefined && count > 0 && <span className={styles.navCount}>{count}</span>}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
