import Link from 'next/link'
import Image from 'next/image'
import styles from './SeriesTile.module.css'

/**
 * The one series tile — uniform square crop, image fills edge to edge, no
 * matting. Shared by the homepage "Browse by Series" strip and /collections
 * so the two don't drift into separate bespoke card styles. See Task 2/14.
 */
export default function SeriesTile({
  href,
  label,
  sub,
  accent,
  imgUrl,
  sizes = '(max-width: 768px) 50vw, 16vw',
}: {
  href: string
  label: string
  sub: string
  accent: string
  imgUrl?: string
  sizes?: string
}) {
  return (
    <Link href={href} className={styles.tile}>
      <div className={styles.tileImg}>
        {imgUrl ? (
          <Image src={imgUrl} alt={label} fill sizes={sizes} className={styles.tileImgEl} />
        ) : (
          <div className={styles.tilePlaceholder} style={{ background: accent + '22' }} />
        )}
      </div>
      <div className={styles.tileInfo}>
        <span className={styles.tileLabel} style={{ color: accent }}>{label}</span>
        <span className={styles.tileSub}>{sub}</span>
      </div>
    </Link>
  )
}
