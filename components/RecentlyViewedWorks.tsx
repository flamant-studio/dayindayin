'use client'
import { useEffect, useState } from 'react'
import ArtworkCard from './ArtworkCard'
import type { Work } from '@/lib/data'
import styles from './RecentlyViewed.module.css'

const STORAGE_KEY = 'did_recently_viewed_works'
const MAX_ITEMS = 8

function readStorage(): Work[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Work[]
  } catch {
    return []
  }
}

function writeStorage(items: Work[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

export default function RecentlyViewedWorks({ currentWork }: { currentWork: Work }) {
  const [others, setOthers] = useState<Work[]>([])

  useEffect(() => {
    const existing = readStorage()
    const filtered = existing.filter((item) => item.slug !== currentWork.slug)
    const updated = [currentWork, ...filtered].slice(0, MAX_ITEMS)
    writeStorage(updated)
    setOthers(filtered.slice(0, 4))
  }, [currentWork])

  if (others.length < 2) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Recently viewed</h2>
      <div className={styles.grid}>
        {others.map((work) => (
          <ArtworkCard key={work.slug} work={work} sizes="(max-width: 768px) 50vw, 25vw" showDimensions={false} />
        ))}
      </div>
    </section>
  )
}
