'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useCart } from './CartProvider'
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
            <Link href="/practical" onClick={closeAll}>Shipping &amp; FAQ</Link>
          </li>
        </ul>

        <div className={styles.actions}>
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
    </>
  )
}
