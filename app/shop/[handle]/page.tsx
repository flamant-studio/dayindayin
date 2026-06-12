import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductByHandle, getProductsByTag, formatPrice, categoryLabel, seriesLabel } from '@/lib/shopify/products'
import BackLink from '@/components/BackLink'
import ProductOptions from '@/components/ProductOptions'
import SizeGuide from '@/components/SizeGuide'
import ImageGallery from '@/components/ImageGallery'
import RecentlyViewed from '@/components/RecentlyViewed'
import StickyATC from '@/components/StickyATC'
import ShareButtons from '@/components/ShareButtons'
import SelectedPrice from '@/components/SelectedPrice'
import { ProductProvider } from '@/contexts/ProductContext'
import type { Metadata } from 'next'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle).catch(() => null)

  if (!product) {
    return { title: 'Product not found' }
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

function getStudioNote(tags: string[]): { medium: string; note: string } | null {
  const t = tags.map(x => x.toLowerCase())
  if (t.includes('tufting')) return {
    medium: 'Tufted Work',
    note: 'Made on a tufting frame, hand-cut and finished. Tufting is a slow process — each piece takes days. The pile height and density are chosen by hand, giving each work a texture that doesn\'t come through in photos.',
  }
  if (t.includes('embroidery')) return {
    medium: 'Embroidery',
    note: 'Worked by hand on canvas or linen. Embroidery is where Stine\'s work started — needle and thread before everything else. Most pieces take weeks, worked in short sessions between other things.',
  }
  if (t.includes('shero')) return {
    medium: 'SHERO Series',
    note: 'SHERO is Stine\'s long-running feminist pop-art series. Bold lettering, bright palettes, direct messages. The series started in 2018 and is still evolving — each piece a new variation on the same insistence.',
  }
  if (t.includes('neko')) return {
    medium: 'NEKO Series',
    note: 'NEKO (猫 — Japanese for cat) is Stine\'s most graphic series. Flat shapes, high-contrast palettes, icon-like simplicity. The paw motif appears in dozens of variations across print, textile, and digital.',
  }
  if (t.includes('sea-monsters')) return {
    medium: 'Sea Monsters',
    note: 'An ongoing bestiary of imaginary sea creatures. Part folklore, part biology textbook, part pattern design. Each monster is invented from scratch — drawn first in the studio, then refined into a repeating print.',
  }
  if (t.includes('photography')) return {
    medium: 'Photography',
    note: 'Shot on location — Denmark, Sri Lanka, across Europe. Stine\'s photography is about stillness: the moment just before or just after something happened. Printed in limited editions on fine art paper.',
  }
  if (t.includes('painting')) return {
    medium: 'Painting',
    note: 'Studio paintings in acrylic and oil stick, worked on canvas on the floor. Layers built up and scraped back over multiple sessions. Each painting is a unique original — the prints are faithful reproductions.',
  }
  if (t.includes('botanical') || t.includes('floral')) return {
    medium: 'Botanical',
    note: 'Plants collected, pressed, and redrawn. The botanical series is obsessively detailed — each leaf and stem traced from life. A quieter thread running through the studio alongside the louder, bolder work.',
  }
  if (t.includes('faces')) return {
    medium: 'Faces',
    note: 'Portrait studies — some recognisable, some invented. The Faces series is about looking directly at someone and letting them look back. Worked in mixed media on canvas and paper.',
  }
  return null
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

  // Series cross-sell — same series, all product types, cheapest first
  const SERIES_TAGS_LIST = ['shero', 'neko', 'sea-monsters', 'botanical', 'floral', 'faces']
  const productSeriesTag = product.tags.find(t => SERIES_TAGS_LIST.includes(t.toLowerCase()))
  const seriesProducts = productSeriesTag
    ? (await getProductsByTag(productSeriesTag, 20).catch(() => []))
        .filter(p => p.handle !== handle && p.firstImage && p.firstImage.url)
        .sort((a, b) => parseFloat(a.minPrice.amount) - parseFloat(b.minPrice.amount))
        .slice(0, 6)
    : []
  const seriesHandles = new Set(seriesProducts.map(p => p.handle))

  // Category related — same medium, different designs, excluding series dupes
  const CATEGORY_TAGS = ['tufting', 'embroidery', 'painting', 'photography', 'tote', 'greeting-card', 'mug', 'apparel']
  const categoryTag = product.tags.find(t => CATEGORY_TAGS.includes(t.toLowerCase()))
  const relatedFiltered = categoryTag
    ? (await getProductsByTag(categoryTag, 10).catch(() => []))
        .filter(p => p.handle !== handle && p.firstImage && p.firstImage.url && !seriesHandles.has(p.handle))
        .slice(0, 4)
    : []

  const productSeries = seriesLabel(product)

  // Task 7: colorway siblings — products with same title prefix (before last " — ")
  const titleParts = product.title.split(' — ')
  const titlePrefix = titleParts.length > 1 ? titleParts.slice(0, -1).join(' — ') : null
  const colorwaySiblings = titlePrefix
    ? seriesProducts
        .filter(p => p.title.startsWith(titlePrefix) && p.firstImage)
        .map(p => ({
          href: `/shop/${p.handle}`,
          url: p.firstImage!.url,
          alt: p.title,
        }))
    : []

  // Build gallery images array
  const galleryImages = [
    mainImage ? { url: mainImage.url, alt: mainImage.altText ?? product.title } : null,
    ...otherImages.map(img => ({ url: img.url, alt: img.altText ?? product.title })),
  ].filter((img): img is { url: string; alt: string } => img !== null)

  // Task 8: breadcrumbs + JSON-LD
  const catLabel = categoryLabel(product)
  const catFilter = categoryTag ?? null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: mainImage?.url,
    description: product.description ? product.description.slice(0, 160) : undefined,
    brand: { '@type': 'Brand', name: 'Day In Day In' },
    offers: {
      '@type': 'Offer',
      price: parseFloat(product.minPrice.amount).toFixed(2),
      priceCurrency: product.minPrice.currencyCode,
      availability: firstVariant?.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://dayindayin.dk/shop/${handle}`,
    },
  }

  return (
    <div className={styles.page}>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BackLink />

      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/shop" className={styles.breadcrumbLink}>Shop</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link
          href={catFilter ? `/shop?filter=${catFilter}` : '/shop'}
          className={styles.breadcrumbLink}
        >
          {catLabel}
        </Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{product.title}</span>
      </nav>

      <div className={styles.layout}>
        {/* Image column */}
        <ImageGallery
          images={galleryImages}
          colorwaySiblings={colorwaySiblings.length > 0 ? colorwaySiblings : undefined}
        />

        {/* Info column */}
        <ProductProvider>
        <div className={styles.info}>
          <div className={styles.infoInner}>
            <p className={styles.productType}>{catLabel}</p>
            <h1 className={styles.title}>{product.title}</h1>
            <SelectedPrice initialPrice={formatPrice(product.minPrice.amount)} className={styles.price} />

            {/* Series / category tags */}
            {product.tags.filter(t => [...['tufting','embroidery','painting','photography','tote','greeting-card','shero','neko','sea-monsters','botanical','floral','faces','sommerby']].includes(t.toLowerCase())).length > 0 && (
              <div className={styles.tagRow}>
                {product.tags
                  .filter(t => ['tufting','embroidery','painting','photography','tote','greeting-card','shero','neko','sea-monsters','botanical','floral','faces','sommerby'].includes(t.toLowerCase()))
                  .map(tag => (
                    <Link key={tag} href={`/shop?filter=${tag.toLowerCase()}`} className={styles.tagLink}>
                      {tag}
                    </Link>
                  ))}
              </div>
            )}

            {product.descriptionHtml && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}

            <ProductOptions
              variants={product.variants}
              handle={handle}
              productTitle={product.title}
            />
            {/* Sentinel: StickyATC watches this to know when ATC scrolls out of view */}
            <div id="atc-sentinel" />

            {product.variants.length > 1 && (
              <SizeGuide variants={product.variants} />
            )}

            <details className={styles.fulfillmentAccordion}>
              <summary className={styles.fulfillmentSummary}>Shipping &amp; Returns</summary>
              <div className={styles.fulfillmentNote}>
                <p>Fulfilled by Gelato. Printed on demand and shipped directly to you.</p>
                <p>Ships within 3–7 business days to EU, UK, and Norway.</p>
                <p>No returns on print-on-demand unless the product arrives defective or damaged.</p>
              </div>
            </details>

            {/* Artist context strip */}
            <div className={styles.artistStrip}>
              <p className={styles.artistName}>Original work by Stine Weirsøe Flamant</p>
              <p className={styles.artistBio}>
                Copenhagen-based artist working in tufting, embroidery, digital illustration, and photography.
              </p>
              <Link href="/about" className={styles.artistLink}>About the artist &rarr;</Link>
            </div>

            <ShareButtons
              url={`https://dayindayin.dk/shop/${handle}`}
              title={product.title}
              imageUrl={mainImage?.url ?? null}
            />
          </div>
        </div>
        <StickyATC title={product.title} imageUrl={mainImage?.url ?? null} />
        </ProductProvider>
      </div>

      {(() => {
        const note = getStudioNote(product.tags)
        return note ? (
          <section className={styles.studioNote}>
            <span className={styles.studioNoteMedium}>{note.medium}</span>
            <p className={styles.studioNoteText}>{note.note}</p>
          </section>
        ) : null
      })()}

      {seriesProducts.length >= 2 && (
        <section className={styles.related}>
          <div className={styles.relatedHeader}>
            <h2 className={styles.relatedTitle}>More from {productSeries}</h2>
            <Link href={`/shop?filter=${productSeriesTag}`} className={styles.relatedViewAll}>
              View all &rarr;
            </Link>
          </div>
          <p className={styles.relatedSub}>Same series — all sizes and price points</p>
          <div className={styles.relatedGrid}>
            {seriesProducts.map((p) => (
              <Link key={p.id} href={`/shop/${p.handle}`} className={styles.relatedCard}>
                <div className={styles.relatedImg}>
                  <Image src={p.firstImage!.url} alt={p.firstImage!.altText ?? p.title}
                    fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
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

      {relatedFiltered.length >= 2 && (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>You might also like</h2>
          <div className={styles.relatedGrid}>
            {relatedFiltered.map((p) => (
              <Link key={p.id} href={`/shop/${p.handle}`} className={styles.relatedCard}>
                <div className={styles.relatedImg}>
                  <Image src={p.firstImage!.url} alt={p.firstImage!.altText ?? p.title}
                    fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
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

      <RecentlyViewed
        currentHandle={handle}
        currentProduct={{
          handle,
          title: product.title,
          imageUrl: mainImage?.url ?? null,
          price: formatPrice(product.minPrice.amount),
        }}
      />
    </div>
  )
}
