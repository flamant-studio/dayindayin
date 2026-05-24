'use client'
import Link from 'next/link'
import { useState } from 'react'
import styles from './ShopFilterNav.module.css'

const TYPE_NAV = [
  { label: 'All', value: null },
  { label: 'Tufted Works', value: 'tufting' },
  { label: 'Embroidery', value: 'embroidery' },
  { label: 'Painting', value: 'painting' },
  { label: 'Photography', value: 'photography' },
  { label: 'Tote Bags', value: 'tote' },
  { label: 'Greeting Cards', value: 'greeting-card' },
]

const SERIES_VALUES = ['shero', 'neko', 'sea-monsters', 'botanical', 'floral', 'faces', 'sommerby']

const SERIES_NAV = [
  { label: 'All series', value: null },
  { label: 'SHERO', value: 'shero' },
  { label: 'NEKO', value: 'neko' },
  { label: 'Sea Monsters', value: 'sea-monsters' },
  { label: 'Botanical', value: 'botanical' },
  { label: 'Floral', value: 'floral' },
  { label: 'Faces', value: 'faces' },
  { label: 'Sommerby', value: 'sommerby' },
]

interface Props {
  activeTag: string | null
}

export default function ShopFilterNav({ activeTag }: Props) {
  const [open, setOpen] = useState(false)
  const isSeriesFilter = activeTag !== null && SERIES_VALUES.includes(activeTag)

  return (
    <nav className={styles.subnav}>
      {/* Mobile toggle */}
      <button
        className={styles.mobileToggle}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="shop-filters"
      >
        <span>Filter{activeTag ? `: ${activeTag}` : ''}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Filter rows — always visible on desktop, collapsible on mobile */}
      <div id="shop-filters" className={`${styles.rows} ${open ? styles.rowsOpen : ''}`}>
        <div className={styles.subnavRow}>
          <span className={styles.subnavLabel}>Type</span>
          {TYPE_NAV.map((item) => {
            const isActive = item.value === activeTag || (item.value === null && !activeTag)
            const href = item.value ? `/shop?filter=${item.value}` : '/shop'
            return (
              <Link
                key={item.label}
                href={href}
                onClick={() => setOpen(false)}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
        <div className={styles.subnavRow}>
          <span className={styles.subnavLabel}>Series</span>
          {SERIES_NAV.map((item) => {
            const isActive = item.value === null ? !isSeriesFilter : item.value === activeTag
            const href = item.value ? `/shop?filter=${item.value}` : '/shop'
            return (
              <Link
                key={item.label}
                href={href}
                onClick={() => setOpen(false)}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
