'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from './CollectionSlideshow.module.css'

interface Props {
  images: { url: string; alt: string }[]
}

export default function CollectionSlideshow({ images }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % images.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [images.length])

  if (images.length === 0) {
    return <div className={styles.slideshow} />
  }

  return (
    <div className={styles.slideshow}>
      {images.map((img, i) => (
        <div key={img.url} className={`${styles.slide} ${i === current ? styles.slideActive : ''}`}>
          <Image
            src={img.url}
            alt={img.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  )
}
