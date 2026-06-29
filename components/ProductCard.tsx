import Link from 'next/link'
import Image from 'next/image'
import {
  categoryLabel,
  seriesLabel,
  isArtworkProduct,
  formatPrice,
  formatPriceLabel,
  type NormalizedProduct,
} from '@/lib/shopify/products'
import { displayTitle } from '@/lib/display'
import WishlistButton from './WishlistButton'
import QuickAddButton from './QuickAddButton'
import styles from './ProductCard.module.css'

/**
 * The one product card (Gelato shop items). White interior, image + title +
 * type + price, wishlist + quick-add. See DESIGN_SYSTEM.md › Cards.
 * NOTE: image crop/aspect (cover vs contain) is the Gelato-genre rule and is
 * intentionally preserved here unchanged pending the Gelato review.
 */
export default function ProductCard({
  product: p,
  priority = false,
  sizes = '(max-width: 768px) 50vw, (max-width: 1100px) 33vw, 25vw',
}: {
  product: NormalizedProduct
  priority?: boolean
  sizes?: string
}) {
  if (!p.firstImage) return null
  const isMockup = categoryLabel(p) === 'Framed Print' || !isArtworkProduct(p)

  return (
    <div className={styles.card}>
      <Link href={`/shop/${p.handle}`} className={styles.cardInner}>
        <div className={`${styles.cardImg} ${isMockup ? styles.cardImgMockup : styles.cardImgArtwork}`}>
          <Image
            src={p.firstImage.url}
            alt={p.firstImage.altText ?? p.title}
            fill
            sizes={sizes}
            className={styles.cardImgEl}
            priority={priority}
          />
          <WishlistButton
            handle={p.handle}
            title={displayTitle(p.title)}
            imageUrl={p.firstImage?.url ?? null}
            price={formatPrice(p.minPrice.amount)}
          />
          {seriesLabel(p) && <span className={styles.cardBadge}>{seriesLabel(p)}</span>}
        </div>
        <div className={styles.cardInfo}>
          <span className={styles.cardTitle}>{displayTitle(p.title)}</span>
          <span className={styles.cardType}>{categoryLabel(p)}</span>
          <span className={styles.cardPrice}>{formatPriceLabel(p)}</span>
        </div>
      </Link>
      <div className={styles.cardCta}>
        {p.variants.length === 1 && p.firstVariant?.availableForSale ? (
          <QuickAddButton merchandiseId={p.firstVariant.id} title={p.title} />
        ) : (
          <Link href={`/shop/${p.handle}`} className={styles.cardViewLink}>View product →</Link>
        )}
      </div>
    </div>
  )
}
