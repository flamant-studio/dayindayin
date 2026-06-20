'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSaved, setSaved, type WishlistItem } from '@/components/WishlistButton'
import styles from '@/app/saved/page.module.css'

interface ProductData {
  handle: string
  title: string
  imageUrl: string | null
  price: string
}

export default function SavedContent() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = getSaved()
    setItems(saved)

    if (saved.length === 0) {
      setLoading(false)
      return
    }

    const handles = saved.map((i) => i.handle).join(',')
    fetch(`/api/products?handles=${encodeURIComponent(handles)}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))

    const sync = () => setItems(getSaved())
    window.addEventListener('wishlist-change', sync)
    return () => window.removeEventListener('wishlist-change', sync)
  }, [])

  function remove(handle: string) {
    setSaved(getSaved().filter((i) => i.handle !== handle))
    setProducts((prev) => prev.filter((p) => p.handle !== handle))
  }

  const displayed = products.length > 0 ? products : items.map((i) => ({
    handle: i.handle,
    title: i.title,
    imageUrl: i.imageUrl,
    price: i.price,
  }))

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Saved</h1>
        {!loading && <p className={styles.count}>{items.length} {items.length === 1 ? 'item' : 'items'}</p>}
      </div>

      {loading ? (
        <div className={styles.loading}><p>Loading…</p></div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: 0.3 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p>Nothing saved yet.</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--c-muted)', marginTop: '-0.5rem' }}>Tap the ♡ on any product to save it here for later.</p>
          <Link href="/shop" className={styles.cta}>Start browsing →</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {displayed.map((p) => (
            <div key={p.handle} className={styles.card}>
              <Link href={`/shop/${p.handle}`} className={styles.cardLink}>
                <div className={styles.cardImg}>
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt={p.title} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className={styles.cardPlaceholder} />
                  )}
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{p.title}</span>
                  <span className={styles.cardPrice}>{p.price}</span>
                </div>
              </Link>
              <button
                className={styles.removeBtn}
                onClick={() => remove(p.handle)}
                aria-label={`Remove ${p.title} from saved`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
