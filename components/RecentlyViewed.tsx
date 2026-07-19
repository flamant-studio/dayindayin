'use client'
import { useEffect, useState } from 'react'
import ProductCard, { type ProductCardData } from './ProductCard'
import styles from './RecentlyViewed.module.css'

type RecentItem = ProductCardData

interface Props {
  currentHandle: string
  currentProduct: RecentItem
}

const STORAGE_KEY = 'did_recently_viewed'
const MAX_ITEMS = 8

// Guards against a heading rendering with blank cards under it — a cached entry from an
// older version of this cache, or a partial write, can satisfy `others.length >= 2` without
// having the fields ProductCard actually needs to render.
function isValidItem(item: unknown): item is RecentItem {
  const i = item as Partial<RecentItem> | null
  return !!i && typeof i.handle === 'string' && typeof i.title === 'string' && !!i.minPrice?.amount
}

function readStorage(): RecentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isValidItem) : []
  } catch {
    return []
  }
}

function writeStorage(items: RecentItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

export default function RecentlyViewed({ currentHandle, currentProduct }: Props) {
  const [others, setOthers] = useState<RecentItem[]>([])

  useEffect(() => {
    const existing = readStorage()
    // Dedup: remove current product if present, add to front
    const filtered = existing.filter((item) => item.handle !== currentHandle)
    const updated = [currentProduct, ...filtered].slice(0, MAX_ITEMS)
    writeStorage(updated)
    // Show up to 4 items that are NOT the current product
    setOthers(filtered.slice(0, 4))
  }, [currentHandle, currentProduct])

  if (others.length < 2) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Recently viewed</h2>
      <div className={styles.grid}>
        {others.map((item) => (
          <ProductCard key={item.handle} product={item} sizes="(max-width: 768px) 50vw, 25vw" />
        ))}
      </div>
    </section>
  )
}
