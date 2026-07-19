'use client'
import Image from 'next/image'
import ImageLightbox from './ImageLightbox'
import { useLightbox } from './useLightbox'
import styles from './WorksGallery.module.css'

interface Props {
  images: string[]
  title: string
}

export default function WorksGallery({ images, title }: Props) {
  const { index: lightboxIndex, open, close, prev, next } = useLightbox(images.length)

  const lightboxImages = images.map((url, i) => ({ url, alt: `${title} — view ${i + 1}` }))

  return (
    <>
      <div className={styles.galleryGrid}>
        {images.map((src, i) => (
          <button
            key={i}
            className={`${styles.galleryItem} ${i === 0 ? styles.galleryItemFirst : ''}`}
            onClick={() => open(i)}
            aria-label={`View ${title} — image ${i + 1} of ${images.length} fullscreen`}
          >
            <Image
              src={src}
              alt={`${title} — view ${i + 1}`}
              fill
              priority={i < 3}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.hoverHint} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9"/>
                <polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </div>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          currentIndex={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  )
}
