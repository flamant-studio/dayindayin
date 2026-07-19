import Link from 'next/link'
import Image from 'next/image'
import CollectionSlideshow from './CollectionSlideshow'
import styles from './SeriesCard.module.css'

type SlideImage = { url: string; alt: string }

/**
 * The one series / collection preview card (collections directory). Accent
 * left-border, rotating slideshow OR a single image, title + sub-line +
 * description + CTA. See DESIGN_SYSTEM.md › Cards.
 */
export default function SeriesCard({
  href,
  accent,
  title,
  subLabel,
  description,
  cta,
  slides,
  image,
}: {
  href: string
  accent: string
  title: string
  subLabel?: string
  description: string
  cta: string
  /** Provide slides for a rotating slideshow, or image for a single still. */
  slides?: SlideImage[]
  image?: string
}) {
  return (
    <Link href={href} className={styles.card} style={{ borderLeft: `3px solid ${accent}` }}>
      {slides ? (
        <CollectionSlideshow images={slides} />
      ) : image ? (
        <div className={styles.media}>
          <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
        </div>
      ) : null}
      <div className={styles.cardText}>
        <h2 className={styles.cardTitle}>{title}</h2>
        {subLabel && <p className={styles.cardSub}>{subLabel}</p>}
        <p className={styles.cardDesc}>{description}</p>
        <span className={styles.cardCta}>{cta}</span>
      </div>
    </Link>
  )
}
