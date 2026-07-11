import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { works } from '@/lib/data'
import { getProductByHandle, getProductsByTag, getProductsByTitleKeyword, formatPrice, categoryLabel, seriesLabel, fallbackDescription } from '@/lib/shopify/products'
import ProductOptions from '@/components/ProductOptions'
import SizeGuide from '@/components/SizeGuide'
import ImageGallery from '@/components/ImageGallery'
import RecentlyViewed from '@/components/RecentlyViewed'
import StickyATC from '@/components/StickyATC'
import ShareButtons from '@/components/ShareButtons'
import SelectedPrice from '@/components/SelectedPrice'
import ArtworkCard from '@/components/ArtworkCard'
import ProductCard from '@/components/ProductCard'
import SectionHeading from '@/components/SectionHeading'
import { ProductProvider } from '@/contexts/ProductContext'
import FluidTracker from '@/components/FluidTracker'
import { displayTitle } from '@/lib/display'
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

  const cleanTitle = displayTitle(product.title)
  return {
    title: cleanTitle,
    description: product.description || `${cleanTitle} by Stine Weirsøe Flamant. Art print, fulfilled by Gelato.`,
    alternates: { canonical: `/shop/${handle}` },
    openGraph: {
      title: `${cleanTitle} — Day In Day In`,
      description: product.description || `${cleanTitle} by Stine Weirsøe Flamant. Art print, fulfilled by Gelato.`,
      images: product.firstImage ? [{ url: product.firstImage.url }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: product.description || `${cleanTitle} by Stine Weirsøe Flamant.`,
      images: product.firstImage ? [product.firstImage.url] : [],
    },
  }
}

type SpecItem = { label: string; value: string }

// Returns material/finish specs — invariant across all variants of a product.
// Size/format specs are omitted here when there are multiple sizes (the variant picker handles those).
function getProductSpecs(
  catLabel: string,
  variantTitle: string | null | undefined,
  productTitle?: string,
  allVariants?: Array<{ title: string }>,
): SpecItem[] {
  const multiSize = (allVariants?.length ?? 0) > 1
  switch (catLabel) {
    case 'Art Print':
      return [
        ...(!multiSize ? [{ label: 'Format', value: 'A4 (21×29.7 cm)' }] : []),
        { label: 'Paper', value: '250 gsm — fine art' },
        { label: 'Finish', value: 'Matte' },
      ]
    case 'Poster':
      return [
        ...(!multiSize ? [{ label: 'Format', value: 'A3 (29.7×42 cm)' }] : []),
        { label: 'Paper', value: '200 gsm — semi-gloss' },
        { label: 'Finish', value: 'Silk coated' },
      ]
    case 'Framed Print':
      if (multiSize) {
        return [{ label: 'Glazing', value: 'Acrylic' }]
      }
      return [
        { label: 'Frame', value: 'Acrylic glazed, 20 mm' },
        { label: 'Sizes', value: 'A4 · A3 · A2 · A1' },
        { label: 'Frames', value: 'White · Wood · Black' },
      ]
    case 'Mug':
      return [
        { label: 'Size', value: '11 oz (325 ml)' },
        { label: 'Material', value: 'Ceramic' },
        { label: 'Print', value: 'Full wrap' },
      ]
    case 'Tote Bag':
      return [
        { label: 'Size', value: '38×42 cm' },
        { label: 'Material', value: 'Natural cotton' },
        { label: 'Print', value: 'One side' },
      ]
    case 'Apparel': {
      const isCap = productTitle?.toLowerCase().includes('cap') ?? false
      if (isCap) {
        return [
          { label: 'Style', value: 'Embroidered dad cap' },
          { label: 'Size', value: 'One size' },
          { label: 'Material', value: 'Organic cotton' },
        ]
      }
      const isDefaultTitle = !variantTitle || variantTitle === 'Default Title'
      const sizeStr = isDefaultTitle ? 'Unisex M'
        : variantTitle.includes('XS') ? 'XS–2XL available'
        : variantTitle.toLowerCase().includes('- m -') ? 'Unisex M'
        : variantTitle
      return [
        { label: 'Size', value: sizeStr },
        { label: 'Style', value: 'Tank top' },
        { label: 'Material', value: '100% cotton' },
      ]
    }
    case 'Greeting Card':
      return [
        { label: 'Qty', value: 'Pack of 10' },
        { label: 'Format', value: 'A6 folded' },
        { label: 'Paper', value: '350 gsm, glossy' },
      ]
    case 'Postcard':
      return [
        { label: 'Qty', value: 'Pack of 10' },
        { label: 'Format', value: 'A6 (148×105 mm)' },
        { label: 'Paper', value: '350 gsm' },
      ]
    case 'Water Bottle':
      return [
        { label: 'Size', value: '17 oz (500 ml)' },
        { label: 'Material', value: 'Stainless steel' },
        { label: 'Colour', value: 'White' },
      ]
    case 'Wood Print':
      return [
        { label: 'Size', value: '200×200 mm' },
        { label: 'Material', value: 'Birch plywood' },
        { label: 'Thickness', value: '20 mm' },
      ]
    default:
      return []
  }
}


export const revalidate = 300

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params
  const product = await getProductByHandle(handle).catch(() => null)

  if (!product) {
    notFound()
  }

  const mainImage = product.firstImage
  const otherImages = product.images.slice(1).filter(img => img.url)
  const firstVariant = product.firstVariant

  // Series cross-sell — detect series from title (products don't carry series tags in Shopify)
  const SERIES_KEYWORDS: Array<[RegExp, string]> = [
    [/\bshero\b/i, 'shero'],
    [/\bneko\b/i, 'neko'],
    [/sea[\s-]monster/i, 'sea monster'],
    [/botanical/i, 'botanical'],
    [/floral/i, 'floral'],
    [/\bfaces?\b/i, 'faces'],
  ]
  // Map detectedSeriesKeyword → shop filter param (sea monster ≠ sea-monsters)
  const KEYWORD_TO_FILTER: Record<string, string> = {
    'shero': 'shero', 'neko': 'neko', 'sea monster': 'sea-monsters',
    'botanical': 'botanical', 'floral': 'floral', 'faces': 'faces',
  }
  let detectedSeriesKeyword: string | null = null
  for (const [pattern, kw] of SERIES_KEYWORDS) {
    if (pattern.test(product.title)) { detectedSeriesKeyword = kw; break }
  }
  const SERIES_TAGS_LIST = ['shero', 'neko', 'sea-monsters', 'botanical', 'floral', 'faces']
  const productSeriesTag = product.tags.find(t => SERIES_TAGS_LIST.includes(t.toLowerCase()))
  // Resolve the shop filter value used for "View all" links
  const seriesFilterValue = productSeriesTag ?? (detectedSeriesKeyword ? KEYWORD_TO_FILTER[detectedSeriesKeyword] : null) ?? null

  const seriesProducts = (detectedSeriesKeyword ?? productSeriesTag)
    ? (await (detectedSeriesKeyword
        ? getProductsByTitleKeyword(detectedSeriesKeyword, 20)
        : getProductsByTag(productSeriesTag!, 20)
      ).catch(() => []))
        .filter(p => p.handle !== handle && p.firstImage && p.firstImage.url)
        .sort((a, b) => parseFloat(a.minPrice.amount) - parseFloat(b.minPrice.amount))
        .slice(0, 6)
    : []
  const seriesHandles = new Set(seriesProducts.map(p => p.handle))

  // Category related — same medium, different designs, excluding series dupes
  const CATEGORY_TAGS = ['tufting', 'embroidery', 'painting', 'photography', 'tote', 'greeting-card', 'postcard', 'mug', 'apparel', 'water-bottle', 'wood-print']
  const categoryTag = product.tags.find(t => CATEGORY_TAGS.includes(t.toLowerCase()))
  const relatedFiltered = categoryTag
    ? (await getProductsByTag(categoryTag, 10).catch(() => []))
        .filter(p => p.handle !== handle && p.firstImage && p.firstImage.url && !seriesHandles.has(p.handle))
        .slice(0, 4)
    : []

  const productSeries = seriesLabel(product)

  // Title prefix (before last " — ") — used below to find format siblings (same artwork,
  // different product type). The "Also in this series" colorway-sibling thumbnails that used
  // to be derived from this were removed 2026-07-11 per Sebastian's request.
  const titleParts = product.title.split(' — ')
  const titlePrefix = titleParts.length > 1 ? titleParts.slice(0, -1).join(' — ') : null

  // Format siblings — same artwork (by displayTitle match), different product type
  // Only add fetch if we have a meaningful artwork name
  const artworkName = displayTitle(product.title)
  const formatSiblings: Array<{ href: string; type: string; price: string }> = []
  if (artworkName && artworkName !== product.title && titlePrefix) {
    const formatCandidates = await getProductsByTitleKeyword(artworkName.split(' — ')[0], 50).catch(() => [])
    const seen = new Set<string>()
    for (const p of formatCandidates) {
      if (p.handle === handle) continue
      if (!p.firstImage) continue
      // Must share the same artwork name (exact, or with orientation suffix like "(Portrait)")
      const pArtwork = displayTitle(p.title)
      if (pArtwork !== artworkName && !pArtwork.startsWith(artworkName + ' (')) continue
      const pType = categoryLabel(p)
      if (seen.has(pType)) continue
      if (pType === categoryLabel(product)) continue
      seen.add(pType)
      formatSiblings.push({
        href: `/shop/${p.handle}`,
        type: pType,
        price: formatPrice(p.minPrice.amount),
      })
    }
    // Sort by price ascending
    formatSiblings.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')))
  }

  // Build gallery images array — include dimensions for natural aspect ratio rendering
  const galleryImagesRaw = [
    mainImage ? { url: mainImage.url, alt: mainImage.altText ?? product.title, width: mainImage.width, height: mainImage.height } : null,
    ...otherImages.map(img => ({ url: img.url, alt: img.altText ?? product.title, width: img.width, height: img.height })),
  ]
  const galleryImages = galleryImagesRaw.filter(Boolean) as Array<{ url: string; alt: string; width?: number; height?: number }>

  // Task 8: breadcrumbs + JSON-LD
  const catLabel = categoryLabel(product)
  // Map label → filter value so breadcrumb links work even when product has no tags
  const CAT_LABEL_TO_FILTER: Record<string, string> = {
    'Art Print': 'art-print', 'Framed Print': 'framed', 'Poster': 'poster',
    'Mug': 'mug', 'Apparel': 'apparel', 'Tote Bag': 'tote',
    'Postcard': 'postcard', 'Greeting Card': 'greeting-card',
    'Water Bottle': 'water-bottle', 'Wood Print': 'wood-print',
  }
  const catFilter = categoryTag ?? CAT_LABEL_TO_FILTER[catLabel] ?? null

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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dayindayin.dk' },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://dayindayin.dk/shop' },
      { '@type': 'ListItem', position: 3, name: catLabel, item: `https://dayindayin.dk/shop?filter=${catFilter ?? ''}` },
      { '@type': 'ListItem', position: 4, name: product.title, item: `https://dayindayin.dk/shop/${handle}` },
    ],
  }

  return (
    <div className={styles.page}>
      <FluidTracker
        productData={{
          handle,
          price: product.minPrice.amount,
          productType: catLabel,
          tags: product.tags,
        }}
      />

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <ProductProvider>
        <div className={styles.layout}>
          {/* Image column — inside ProductProvider so variant images can update it */}
          <ImageGallery
            images={galleryImages}
            objectFit="contain"
          />

          {/* Info column */}
          <div className={styles.info}>
            <div className={styles.infoInner}>
              {/* 1. Title */}
              <div className={styles.titleBlock}>
                <div className={styles.titleMeta}>
                  {productSeries && <span className={styles.seriesBadge}>{productSeries}</span>}
                  <p className={styles.productType}>{catLabel === 'Postcard' ? 'Postcard · Pack of 10' : catLabel === 'Greeting Card' ? 'Greeting Card · Pack of 10' : catLabel}</p>
                </div>
                <h1 className={styles.title}>{displayTitle(product.title)}</h1>
              </div>

              {/* 2. Price */}
              <SelectedPrice initialPrice={formatPrice(product.minPrice.amount)} className={styles.price} />

              {/* 3. Variants + ATC */}
              <ProductOptions
                variants={product.variants}
                handle={handle}
                productTitle={product.title}
                productType={product.productType}
              />
              <div id="atc-sentinel" />

              {/* 4. Description */}
              {product.descriptionHtml ? (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              ) : (
                <p className={styles.description}>{fallbackDescription(product)}</p>
              )}

              {/* Trust line — deliberately always visible, not tucked inside a collapsed
                  accordion (see ISSUES.md FB-2b). Was nested inside the "Materials &
                  Production" accordion body, which just happens to default open — reads as
                  "why is shipping info under Materials?" once you actually read the labels. */}
              <div className={styles.trustBlock}>
                <div className={styles.deliveryEstimate}>
                  <span className={styles.deliveryDot} />
                  <span>Ships in 3–7 business days · EU, UK &amp; Norway</span>
                </div>
                <p className={styles.gelatoLine}>
                  Printed &amp; shipped by{' '}
                  <a href="https://gelato.com" target="_blank" rel="noopener noreferrer">Gelato</a>
                </p>
              </div>

              {/* 5. Secondary info — accordions */}
              <div className={styles.accordionGroup}>
                <details className={styles.accordion} open>
                  <summary className={styles.accordionSummary}>Materials &amp; Production</summary>
                  <div className={styles.accordionBody}>
                    {(() => {
                      const specs = getProductSpecs(catLabel, product.firstVariant?.title, product.title, product.variants)
                      return specs.length > 0 ? (
                        <dl className={styles.specsRow}>
                          {specs.map(s => (
                            <div key={s.label} className={styles.specItem}>
                              <dt className={styles.specLabel}>{s.label}</dt>
                              <dd className={styles.specValue}>{s.value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null
                    })()}
                    {product.variants.length > 1 && (
                      <SizeGuide variants={product.variants} productType={catLabel} />
                    )}
                  </div>
                </details>

                <details className={styles.accordion}>
                  <summary className={styles.accordionSummary}>Shipping &amp; Returns</summary>
                  <div className={styles.accordionBody}>
                    <p className={styles.accordionText}>International shipping outside EU, UK &amp; Norway is available at checkout.</p>
                    <p className={styles.accordionText}>If anything arrives damaged or wrong, let us know within 14 days with a photo — we&apos;ll sort it.</p>
                  </div>
                </details>

                {formatSiblings.length > 0 && (
                  <details className={styles.accordion}>
                    <summary className={styles.accordionSummary}>Also available as</summary>
                    <div className={styles.accordionBody}>
                      <div className={styles.formatRow}>
                        <span className={`${styles.formatChip} ${styles.formatChipActive}`}>{catLabel}</span>
                        {formatSiblings.map(s => (
                          <a key={s.href} href={s.href} className={styles.formatChip}>
                            {s.type}
                          </a>
                        ))}
                      </div>
                    </div>
                  </details>
                )}

                <details className={styles.accordion}>
                  <summary className={styles.accordionSummary}>Share</summary>
                  <div className={styles.accordionBody}>
                    <ShareButtons
                      url={`https://dayindayin.dk/shop/${handle}`}
                      title={product.title}
                      imageUrl={mainImage?.url ?? null}
                    />
                  </div>
                </details>
              </div>

            </div>
          </div>
        </div>
        <StickyATC title={displayTitle(product.title)} imageUrl={mainImage?.url ?? null} />
      </ProductProvider>

      {seriesProducts.length >= 2 && (
        <section className={styles.related}>
          <SectionHeading
            title={`More from ${productSeries}`}
            subtitle="Same series — all sizes and price points"
            viewAll={{ href: seriesFilterValue ? `/shop?filter=${seriesFilterValue}` : '/shop', label: 'View all' }}
          />
          <div className={styles.relatedGrid}>
            {seriesProducts.map((p) => (
              <ProductCard key={p.id} product={p} sizes="(max-width: 768px) 50vw, 25vw" />
            ))}
          </div>
        </section>
      )}

      {relatedFiltered.length >= 2 && (
        <section className={styles.related}>
          <SectionHeading title="You might also like" />
          <div className={styles.relatedGrid}>
            {relatedFiltered.map((p) => (
              <ProductCard key={p.id} product={p} sizes="(max-width: 768px) 50vw, 25vw" />
            ))}
          </div>
        </section>
      )}

      {(() => {
        // Cross-sell: show originals from the same medium (tufting/embroidery/painting/photography)
        const mediumTag = product.tags.find(t => ['tufting','embroidery','painting','photography'].includes(t.toLowerCase()))
        if (!mediumTag) return null
        const originals = works.filter(w => w.category === mediumTag.toLowerCase() as 'tufting' | 'embroidery' | 'painting' | 'photography').slice(0, 4)
        if (originals.length === 0) return null
        const mediumLabel = mediumTag.charAt(0).toUpperCase() + mediumTag.slice(1)
        return (
          <section className={styles.originalsSection}>
            <SectionHeading
              title={`Original ${mediumLabel} works`}
              subtitle="These are the unique originals this print is based on — available on enquiry."
              viewAll={{ href: `/fine-art?view=grid&category=${mediumTag.toLowerCase()}`, label: 'See all originals' }}
            />
            <div className={styles.originalsGrid}>
              {originals.map(w => (
                <ArtworkCard key={w.slug} work={w} sizes="(max-width: 768px) 50vw, 25vw" showDimensions={false} />
              ))}
            </div>
          </section>
        )
      })()}

      <RecentlyViewed
        currentHandle={handle}
        currentProduct={{
          handle,
          title: product.title,
          tags: product.tags,
          firstImage: product.firstImage,
          priceRangeV2: product.priceRangeV2,
          minPrice: product.minPrice,
        }}
      />
    </div>
  )
}
