'use client'
import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from './ImageLightbox.module.css'

interface LightboxImage {
  url: string
  alt: string
}

interface Props {
  images: LightboxImage[]
  initialIndex: number
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  const img = images[currentIndex]
  if (!img) return null

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Image viewer">
      <div className={styles.inner} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>

        {images.length > 1 && (
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={onPrev} aria-label="Previous image">
            ‹
          </button>
        )}

        <div className={styles.imageWrap}>
          <Image
            src={img.url}
            alt={img.alt}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {images.length > 1 && (
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={onNext} aria-label="Next image">
            ›
          </button>
        )}

        {images.length > 1 && (
          <div className={styles.dots}>
            {images.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
