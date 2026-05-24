'use client'
import { useState } from 'react'
import Image from 'next/image'
import ImageLightbox from './ImageLightbox'
import styles from './ImageGallery.module.css'

interface GalleryImage {
  url: string
  alt: string
}

interface Props {
  images: GalleryImage[]
  colorwaySiblings?: { href: string; url: string; alt: string }[]
}

export default function ImageGallery({ images, colorwaySiblings }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const mainImage = images[0]
  const thumbImages = images.slice(1)

  function openAt(index: number) {
    setLightboxIndex(index)
  }

  function closeLightbox() {
    setLightboxIndex(null)
  }

  function prev() {
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + images.length) % images.length))
  }

  function next() {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % images.length))
  }

  return (
    <div className={styles.images}>
      <div
        className={styles.mainImage}
        onClick={() => mainImage && openAt(0)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && mainImage && openAt(0)}
        aria-label="View full image"
        style={{ cursor: mainImage ? 'zoom-in' : 'default' }}
      >
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className={styles.mainImageEl}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>

      {thumbImages.length > 0 && (
        <div className={styles.thumbGrid}>
          {thumbImages.map((img, i) => (
            <div
              key={i}
              className={styles.thumb}
              onClick={() => openAt(i + 1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openAt(i + 1)}
              aria-label={`View image ${i + 2}`}
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

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  )
}
