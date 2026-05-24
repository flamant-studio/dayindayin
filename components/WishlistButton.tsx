'use client'
import { useState, useEffect } from 'react'
import styles from './WishlistButton.module.css'

interface Props {
  handle: string
  title: string
  imageUrl: string | null
  price: string
}

export type WishlistItem = { handle: string; title: string; imageUrl: string | null; price: string }

const KEY = 'did_wishlist'

export function getSaved(): WishlistItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}

export function setSaved(items: WishlistItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('wishlist-change'))
}

export default function WishlistButton({ handle, title, imageUrl, price }: Props) {
  const [saved, setSavedState] = useState(false)

  useEffect(() => {
    const sync = () => setSavedState(getSaved().some((i) => i.handle === handle))
    sync()
    window.addEventListener('wishlist-change', sync)
    return () => window.removeEventListener('wishlist-change', sync)
  }, [handle])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const current = getSaved()
    const isSaved = current.some((i) => i.handle === handle)
    setSaved(isSaved ? current.filter((i) => i.handle !== handle) : [...current, { handle, title, imageUrl, price }])
  }

  return (
    <button
      className={`${styles.btn} ${saved ? styles.saved : ''}`}
      onClick={toggle}
      aria-label={saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      aria-pressed={saved}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}
