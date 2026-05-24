'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './RecentlyViewed.module.css'

interface RecentItem {
  handle: string
  title: string
  imageUrl: string | null
  price: string
}

interface Props {
  currentHandle: string
  currentProduct: RecentItem
}

const STORAGE_KEY = 'did_recently_viewed'
const MAX_ITEMS = 8

function readStorage(): RecentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as RecentItem[]
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
          <Link key={item.handle} href={`/shop/${item.handle}`} className={styles.card}>
            <div className={styles.imgWrap}>
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className={styles.imgPlaceholder} />
              )}
            </div>
            <div className={styles.info}>
              <span className={styles.name}>{item.title}</span>
              <span className={styles.price}>{item.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
