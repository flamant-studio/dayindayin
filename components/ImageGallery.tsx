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
    }
  }, [selectedImage, images])

  const baseActive = images[activeIndex] ?? images[0]
  const mainImage = followVariant && selectedImage
    ? { url: selectedImage, alt: baseActive?.alt ?? '' }
    : baseActive

  const goPrev = () => { setFollowVariant(false); setActiveIndex((i) => (i - 1 + images.length) % images.length) }
  const goNext = () => { setFollowVariant(false); setActiveIndex((i) => (i + 1) % images.length) }

  const mainAspectRatio = mainImage?.width && mainImage?.height
    ? `${mainImage.width}/${mainImage.height}`
    : '3/4'

  return (
    <div className={styles.images}>
      <div
        className={styles.mainImage}
        style={{ aspectRatio: mainAspectRatio, background: objectFit === 'contain' ? '#fff' : undefined }}
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

      {images.length > 1 && (
        <div className={styles.thumbGrid}>
          {images.map((img, i) => (
            <div
              key={i}
              className={`${styles.thumb} ${i === activeIndex ? styles.thumbActive : ''}`}
              onClick={() => { setFollowVariant(false); setActiveIndex(i) }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && (setFollowVariant(false), setActiveIndex(i))}
              aria-label={`View image ${i + 1}`}
              aria-current={i === activeIndex ? 'true' : undefined}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="20vw"
                className={styles.thumbImage}
              />
            </div>
          ))}
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
