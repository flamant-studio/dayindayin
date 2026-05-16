'use client'
import Link from 'next/link'
import { useState } from 'react'
import styles from './Nav.module.css'

const COLLECTIONS = [
  { href: '/shop/collections/tufted-works', label: 'Tufted Works' },
  { href: '/shop/collections/embroidery',   label: 'Embroidery' },
  { href: '/shop/collections/paintings',    label: 'Paintings' },
  { href: '/shop/collections/photography',  label: 'Photography' },
  { href: '/shop/collections/mixed',        label: 'Mixed Works' },
  { href: '/shop/collections/archive',      label: 'Archive' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
          Day In Day In
        </Link>

        <ul className={`${styles.links} ${open ? styles.open : ''}`}>
          <li>
            <Link href="/shop" className={styles.primary} onClick={() => setOpen(false)}>
              Shop
            </Link>
          </li>
          <li className={styles.hasDropdown}>
            <span className={styles.dropTrigger}>Collections</span>
            <ul className={styles.dropdown}>
              {COLLECTIONS.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} onClick={() => setOpen(false)}>{c.label}</Link>
                </li>
              ))}
              <li className={styles.dropDivider}>
                <Link href="/shop" onClick={() => setOpen(false)}>All products →</Link>
              </li>
            </ul>
          </li>
          <li className={styles.hasDropdown}>
            <span className={styles.dropTrigger}>Artist</span>
            <ul className={styles.dropdown}>
              <li><Link href="/about" onClick={() => setOpen(false)}>About Stine</Link></li>
              <li><Link href="/fine-art" onClick={() => setOpen(false)}>Fine Art</Link></li>
              <li><Link href="/archive" onClick={() => setOpen(false)}>Archive</Link></li>
              <li><Link href="/art-journal" onClick={() => setOpen(false)}>Art Journal</Link></li>
            </ul>
          </li>
          <li><Link href="/practical" onClick={() => setOpen(false)}>Shipping & FAQ</Link></li>
        </ul>

        <div className={styles.actions}>
          <Link href="/shop" className={styles.cartBtn} aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </Link>
          <button
            className={styles.burger}
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={open ? styles.burgerLineTop : ''} />
            <span className={open ? styles.burgerLineMid : ''} />
            <span className={open ? styles.burgerLineBot : ''} />
          </button>
        </div>
      </nav>
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}
    </>
  )
}
