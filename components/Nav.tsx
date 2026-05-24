'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from './CartProvider'
import CurrencyToggle from './CurrencyToggle'
import styles from './Nav.module.css'

const ARTIST_LINKS = [
  { href: '/about',       label: 'About Stine' },
  { href: '/fine-art',    label: 'Fine Art' },
  { href: '/archive',     label: 'Archive' },
  { href: '/art-journal', label: 'Art Journal' },
]

type DropdownName = 'artist'

export default function Nav() {
  const [dropdown, setDropdown] = useState<DropdownName | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, openCart } = useCart()
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDropdown(null)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function toggle(name: DropdownName) {
    setDropdown(prev => (prev === name ? null : name))
  }

  function closeAll() {
    setDropdown(null)
    setMobileOpen(false)
  }

  return (
    <>
      <nav ref={navRef} className={styles.nav}>
        <Link href="/" className={styles.logo} onClick={closeAll}>
          Day In Day In
        </Link>

        <ul className={`${styles.links} ${mobileOpen ? styles.mobileOpen : ''}`}>
          <li>
            <Link href="/shop" onClick={closeAll}>Shop</Link>
          </li>

          <li className={styles.hasDropdown}>
            <button
              className={`${styles.dropTrigger} ${dropdown === 'artist' ? styles.triggerActive : ''}`}
              onClick={() => toggle('artist')}
              aria-expanded={dropdown === 'artist'}
            >
              Artist
            </button>
            {dropdown === 'artist' && (
              <ul className={styles.dropdown}>
                {ARTIST_LINKS.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={closeAll}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <Link href="/collections" onClick={closeAll}>Collections</Link>
          </li>
          <li>
            <Link href="/practical" onClick={closeAll}>Shipping &amp; FAQ</Link>
          </li>
        </ul>

        <div className={styles.actions}>
          <CurrencyToggle />
          <button
            onClick={openCart}
            className={styles.cartBtn}
            aria-label={`Cart${count > 0 ? ` (${count})` : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span className={styles.cartCount}>{count}</span>}
          </button>

          <button
            className={styles.burger}
            onClick={() => { setMobileOpen(o => !o); setDropdown(null) }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className={mobileOpen ? styles.burgerTop : ''} />
            <span className={mobileOpen ? styles.burgerMid : ''} />
            <span className={mobileOpen ? styles.burgerBot : ''} />
          </button>
        </div>
      </nav>

      {mobileOpen && <div className={styles.overlay} onClick={closeAll} />}

      {/* ── Mobile bottom tab bar ──────────────────────────── */}
      <nav className={styles.mobileTabBar} aria-label="Mobile navigation">
        <Link href="/" className={`${styles.mobileTab} ${pathname === '/' ? styles.mobileTabActive : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            <path d="M9 21V12h6v9"/>
          </svg>
          <span>Home</span>
        </Link>
        <Link href="/shop" className={`${styles.mobileTab} ${pathname.startsWith('/shop') ? styles.mobileTabActive : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
          </svg>
          <span>Shop</span>
        </Link>
        <Link href="/about" className={`${styles.mobileTab} ${pathname === '/about' ? styles.mobileTabActive : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
          <span>Artist</span>
        </Link>
        <button className={`${styles.mobileTab} ${styles.mobileTabBtn}`} onClick={openCart} aria-label={`Cart${count > 0 ? ` (${count})` : ''}`}>
          <span className={styles.mobileTabCartWrap}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span className={styles.mobileTabCount}>{count}</span>}
          </span>
          <span>Cart</span>
        </button>
      </nav>

      {/* Spacer so content isn't hidden behind the tab bar on mobile */}
      <div className={styles.mobileNavSpacer} aria-hidden="true" />
    </>
  )
}
