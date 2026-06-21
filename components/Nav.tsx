'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from './CartProvider'
import CurrencyToggle from './CurrencyToggle'
import styles from './Nav.module.css'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, openCart } = useCart()
  const pathname = usePathname()

  function closeAll() {
    setMobileOpen(false)
  }

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo} onClick={closeAll}>
          Day In Day In
        </Link>

        <ul className={`${styles.links} ${mobileOpen ? styles.mobileOpen : ''}`}>
          <li>
            <Link href="/shop" onClick={closeAll} className={pathname.startsWith('/shop') ? styles.linkActive : ''}>Shop</Link>
          </li>
          <li>
            <Link href="/fine-art" onClick={closeAll} className={pathname === '/fine-art' || pathname.startsWith('/works') ? styles.linkActive : ''}>Fine Art</Link>
          </li>
          <li>
            <Link href="/commissions" onClick={closeAll} className={pathname === '/commissions' ? styles.linkActive : ''}>Commissions</Link>
          </li>
          <li>
            <Link href="/about" onClick={closeAll} className={`${pathname === '/about' || pathname === '/practical' || pathname.startsWith('/collections') ? styles.linkActive : ''}`}>About</Link>
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
            onClick={() => setMobileOpen(o => !o)}
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
