import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductByHandle, formatPrice, checkoutUrl } from '@/lib/shopify/products'
import AddToCartButton from '@/components/AddToCartButton'
import type { Metadata } from 'next'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle).catch(() => null)

  if (!product) {
    return { title: 'Product not found — Day In Day In' }
  }

  return {
    title: `${product.title} — Day In Day In`,
    description: product.description || `${product.title} by Stine Weirsøe Flamant. Art print, fulfilled by Gelato.`,
    openGraph: {
      title: product.title,
      description: product.description || '',
      images: product.firstImage ? [{ url: product.firstImage.url }] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params
  const product = await getProductByHandle(handle).catch(() => null)

  if (!product) {
    notFound()
  }

  const mainImage = product.firstImage
  const otherImages = product.images.slice(1)
  const firstVariant = product.firstVariant

  return (
    <div className={styles.page}>
      <div className={styles.back}>
        <Link href="/shop" className={styles.backLink}>
          &larr; Back to shop
        </Link>
      </div>

      <div className={styles.layout}>
        {/* Image column */}
        <div className={styles.images}>
          <div className={styles.mainImage}>
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.altText ?? product.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
                className={styles.mainImageEl}
              />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}
          </div>
          {otherImages.length > 0 && (
            <div className={styles.thumbGrid}>
              {otherImages.map((img, i) => (
                <div key={i} className={styles.thumb}>
                  <Image
                    src={img.url}
                    alt={img.altText ?? `${product.title} — image ${i + 2}`}
                    fill
                    sizes="20vw"
                    className={styles.thumbImage}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info column */}
        <div className={styles.info}>
          <div className={styles.infoInner}>
            {product.productType && (
              <p className={styles.productType}>{product.productType}</p>
            )}

            <h1 className={styles.title}>{product.title}</h1>

            <p className={styles.price}>
              {formatPrice(product.minPrice.amount)}
            </p>

            {product.description && (
              <p className={styles.description}>{product.description}</p>
            )}

            {/* Variant list — shown if multiple variants */}
            {product.variants.length > 1 && (
              <div className={styles.variants}>
                <p className={styles.variantLabel}>Options</p>
                <div className={styles.variantList}>
                  {product.variants.map((v) => (
                    <a
                      key={v.id}
                      href={v.availableForSale ? checkoutUrl(v.id) : undefined}
                      className={`${styles.variantBtn} ${!v.availableForSale ? styles.variantSoldOut : ''}`}
                      aria-disabled={!v.availableForSale}
                    >
                      {v.title}
                      {!v.availableForSale && <span className={styles.soldOutBadge}>Sold out</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Buy button — uses first available variant */}
            {firstVariant ? (
              <AddToCartButton
                variantId={firstVariant.id}
                price={formatPrice(product.minPrice.amount)}
                available={firstVariant.availableForSale}
              />
            ) : (
              <div className={styles.soldOut}>Currently sold out</div>
            )}

            <div className={styles.fulfillmentNote}>
              <p>Fulfilled by Gelato. Printed on demand and shipped directly to you.</p>
              <p>Ships within 3–7 business days to EU, UK, and Norway.</p>
              <p>No returns on print-on-demand unless the product arrives defective or damaged.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
