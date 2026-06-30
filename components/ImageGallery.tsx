'use client'
import Image from 'next/image'
import ImageLightbox from './ImageLightbox'
import { useLightbox } from './useLightbox'
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
  const { index: lightboxIndex, open: openAt, close: closeLightbox, prev, next } = useLightbox(images.length)
  const { selectedImage } = useProduct()

  const baseMain = images[0]
  const mainImage = selectedImage
    ? { url: selectedImage, alt: baseMain?.alt ?? '' }
    : baseMain
  const thumbImages = images.slice(1)

  const mainAspectRatio = mainImage?.width && mainImage?.height
    ? `${mainImage.width}/${mainImage.height}`
    : '3/4'

  return (
    <div className={styles.images}>
      <div
        className={styles.mainImage}
        style={{ aspectRatio: mainAspectRatio, cursor: mainImage ? 'zoom-in' : 'default', background: objectFit === 'contain' ? '#fff' : undefined }}
        onClick={() => mainImage && openAt(0)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && mainImage && openAt(0)}
        aria-label="View full image"
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
          <span className={styles.imageCounter}>{images.length} photos</span>
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
