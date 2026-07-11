'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useProduct } from '@/contexts/ProductContext'
import styles from './ImageGallery.module.css'

interface GalleryImage {
  url: string
  alt: string
  width?: number
  height?: number
}

interface Props {
  images: GalleryImage[]
  colorwaySiblings?: { href: string; url: string; alt: string }[]
  objectFit?: 'cover' | 'contain'
}

export default function ImageGallery({ images, colorwaySiblings, objectFit = 'cover' }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { selectedImage } = useProduct()
  const containerRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)

  // A fresh variant selection should jump the gallery to that photo — but once the visitor
  // is manually browsing with the arrows/thumbs, that has to win, or the arrows go dead the
  // moment any variant has published an image (which is almost immediately, on mount).
  const [followVariant, setFollowVariant] = useState(true)
  const prevSelectedImage = useRef(selectedImage)
  useEffect(() => {
    if (selectedImage !== prevSelectedImage.current) {
      prevSelectedImage.current = selectedImage
      setFollowVariant(true)
      const idx = images.findIndex((img) => img.url === selectedImage)
      if (idx >= 0) setActiveIndex(idx)
      // Picking a variant (e.g. color) is easy to do while scrolled down past the image —
      // bring the photo back into view so the change is actually visible, not just the counter.
      if (mounted.current) {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    mounted.current = true
  }, [selectedImage, images])

  const baseActive = images[activeIndex] ?? images[0]
  const mainImage = followVariant && selectedImage
    ? { url: selectedImage, alt: baseActive?.alt ?? '' }
    : baseActive

  const goPrev = () => { setFollowVariant(false); setActiveIndex((i) => (i - 1 + images.length) % images.length) }
  const goNext = () => { setFollowVariant(false); setActiveIndex((i) => (i + 1) % images.length) }

  // Fixed frame, not per-image — matches the site-wide locked card rule (one box, `contain`,
  // never crop; see DESIGN_SYSTEM.md § Cards). Sizing the box to each image's own dimensions
  // made the whole page reflow every time the active image changed.
  const thumbImages = images.slice(1)

  return (
    <div className={styles.images} ref={containerRef}>
      <div
        className={styles.mainImage}
        style={{ background: objectFit === 'contain' ? '#fff' : undefined }}
      >
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className={styles.mainImageEl}
            style={{ objectFit }}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
        {images.length > 1 && (
          <>
            <button type="button" className={`${styles.mainArrow} ${styles.mainArrowLeft}`} onClick={goPrev} aria-label="Previous image">‹</button>
            <button type="button" className={`${styles.mainArrow} ${styles.mainArrowRight}`} onClick={goNext} aria-label="Next image">›</button>
            <span className={styles.imageCounter}>{activeIndex + 1} / {images.length}</span>
          </>
        )}
      </div>

      {thumbImages.length > 0 && (
        <div className={styles.thumbGrid}>
          {thumbImages.map((img, i) => {
            const realIndex = i + 1
            return (
              <div
                key={realIndex}
                className={`${styles.thumb} ${realIndex === activeIndex ? styles.thumbActive : ''}`}
                onClick={() => { setFollowVariant(false); setActiveIndex(realIndex) }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && (setFollowVariant(false), setActiveIndex(realIndex))}
                aria-label={`View image ${realIndex + 1}`}
                aria-current={realIndex === activeIndex ? 'true' : undefined}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="20vw"
                  className={styles.thumbImage}
                />
              </div>
            )
          })}
        </div>
      )}

      {colorwaySiblings && colorwaySiblings.length > 0 && (
        <div className={styles.colorways}>
          <p className={styles.colorwayLabel}>Also in this series:</p>
          <div className={styles.colorwayRow}>
            {colorwaySiblings.map((s) => (
              <a key={s.href} href={s.href} className={styles.colorwayThumb} title={s.alt}>
                <Image src={s.url} alt={s.alt} fill sizes="48px" style={{ objectFit: 'cover' }} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
