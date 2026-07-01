import Link from 'next/link'
import Image from 'next/image'
import type { Work } from '@/lib/data'
import styles from './ArtworkCard.module.css'

/**
 * The one artwork card (original works). 3:4 image (art fills), title + year,
 * optional SOLD badge, enquire-on-hover overlay. See DESIGN_SYSTEM.md › Cards.
 */
export default function ArtworkCard({
  work,
  sizes = '(max-width: 768px) 50vw, 33vw',
  showDimensions = true,
  metaLabel,
}: {
  work: Work
  sizes?: string
  showDimensions?: boolean
  /** Overrides the year/dimensions line (e.g. archive uses "Category · Year"). */
  metaLabel?: string
}) {
  return (
    <Link href={`/works/${work.slug}`} className={styles.card}>
      <div className={styles.cardImage}>
        <Image src={work.image} alt={work.title} fill sizes={sizes} className={styles.cardImg} />
        {work.sold && <span className={styles.soldBadge}>Sold</span>}
        <div className={styles.cardOverlay}>
          <span className={styles.cardEnquire}>Discover →</span>
        </div>
      </div>
      <div className={styles.cardMeta}>
        <p className={styles.cardTitle}>{work.title}</p>
        <p className={styles.cardYear}>
          {metaLabel ?? (showDimensions && work.dimensions ? `${work.year} · ${work.dimensions}` : work.year)}
        </p>
      </div>
    </Link>
  )
}
