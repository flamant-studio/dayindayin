import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductByHandle, getProductsByTag, formatPrice, checkoutUrl, categoryLabel } from '@/lib/shopify/products'
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
    title: product.title,
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
  const otherImages = product.images.slice(1).filter(img => img.url)
  const firstVariant = product.firstVariant

  // Find the most specific category tag to query related products
  const CATEGORY_TAGS = ['tufting', 'embroidery', 'painting', 'photography', 'tote', 'greeting-card']
  const categoryTag = product.tags.find(t => CATEGORY_TAGS.includes(t.toLowerCase()))
  const related = categoryTag
    ? await getProductsByTag(categoryTag, 5).catch(() => [])
    : []
  const relatedFiltered = related.filter(p => p.handle !== handle).slice(0, 4)

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
            <p className={styles.productType}>{categoryLabel(product)}</p>

            <h1 className={styles.title}>{product.title}</h1>

            <p className={styles.price}>
              {formatPrice(product.minPrice.amount)}
            </p>

            {product.descriptionHtml && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
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
      {relatedFiltered.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>More like this</h2>
          <div className={styles.relatedGrid}>
            {relatedFiltered.map((p) => (
              <Link key={p.id} href={`/shop/${p.handle}`} className={styles.relatedCard}>
                <div className={styles.relatedImg}>
                  {p.firstImage ? (
                    <Image
                      src={p.firstImage.url}
                      alt={p.firstImage.altText ?? p.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder} />
                  )}
                </div>
                <div className={styles.relatedInfo}>
                  <span className={styles.relatedName}>{p.title}</span>
                  <span className={styles.relatedPrice}>{formatPrice(p.minPrice.amount)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
