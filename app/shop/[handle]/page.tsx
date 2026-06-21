import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { works } from '@/lib/data'
import { getProductByHandle, getProductsByTag, getProductsByTitleKeyword, formatPrice, categoryLabel, seriesLabel } from '@/lib/shopify/products'
import ProductOptions from '@/components/ProductOptions'
import SizeGuide from '@/components/SizeGuide'
import ImageGallery from '@/components/ImageGallery'
import RecentlyViewed from '@/components/RecentlyViewed'
import StickyATC from '@/components/StickyATC'
import ShareButtons from '@/components/ShareButtons'
import SelectedPrice from '@/components/SelectedPrice'
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

  // Colorway siblings — products with same title prefix (before last " — ")
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

      <div className={styles.layout}>
        {/* Image column */}
        <ImageGallery
          images={galleryImages}
          colorwaySiblings={colorwaySiblings.length > 0 ? colorwaySiblings : undefined}
          objectFit="contain"
        />

        {/* Info column */}
        <ProductProvider>
        <div className={styles.info}>
          <div className={styles.infoInner}>
            {/* Breadcrumb — inside info column so on mobile it appears below the image */}
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
              <span className={styles.breadcrumbCurrent}>{displayTitle(product.title)}</span>
            </nav>

            {/* 1. Type + title + edition */}
            <div className={styles.titleBlock}>
              <p className={styles.productType}>{catLabel}</p>
              <h1 className={styles.title}>{displayTitle(product.title)}</h1>
              {(catLabel === 'Art Print' || catLabel === 'Framed Print' || catLabel === 'Poster') && (
                <p className={styles.editionNote}>Open edition · Printed on demand</p>
              )}
              {catLabel === 'Photo Print' && (
                <p className={styles.editionNote}>Limited edition · Archival inkjet</p>
              )}
            </div>

            {/* 1b. Format alternatives — same artwork, other product types */}
            {formatSiblings.length > 0 && (
              <div className={styles.formatRow}>
                <span className={styles.formatRowLabel}>Also as:</span>
                <span className={`${styles.formatChip} ${styles.formatChipActive}`}>{catLabel}</span>
                {formatSiblings.map(s => (
                  <a key={s.href} href={s.href} className={styles.formatChip}>
                    {s.type}
                  </a>
                ))}
              </div>
            )}

            {/* 2. Price */}
            <SelectedPrice initialPrice={formatPrice(product.minPrice.amount)} className={styles.price} />

            {/* 3. Material/finish specs — always shown; size specs omitted for multi-variant (picker handles those) */}
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

            {/* 4. Description */}
            {product.descriptionHtml && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}

            {/* 5. Variant picker + ATC (multi-variant) */}
            <ProductOptions
              variants={product.variants}
              handle={handle}
              productTitle={product.title}
              productType={product.productType}
            />
            {/* Sentinel: StickyATC watches this to know when ATC scrolls out of view */}
            <div id="atc-sentinel" />

            {product.variants.length > 1 && (
              <SizeGuide variants={product.variants} />
            )}

            {/* 6. Trust signals — compact single block */}
            <div className={styles.trustBlock}>
              <div className={styles.deliveryEstimate}>
                <span className={styles.deliveryDot} />
                <span>Ships in 3–7 business days · EU, UK & Norway</span>
              </div>
              <p className={styles.gelatoLine}>
                Printed &amp; shipped by{' '}
                <a href="https://gelato.com" target="_blank" rel="noopener noreferrer">Gelato</a>
              </p>
            </div>

            {/* 7. Shipping accordion */}
            <details className={styles.fulfillmentAccordion}>
              <summary className={styles.fulfillmentSummary}>Shipping &amp; Returns</summary>
              <div className={styles.fulfillmentNote}>
                <p>Printed on demand by Gelato and shipped directly to you.</p>
                <p>Production: 1–3 business days. Delivery: 2–5 days within EU. <strong>Estimated total: 3–7 days from order.</strong></p>
                <p>Ships to EU, UK, and Norway. International shipping available at checkout.</p>
                <p>If anything arrives damaged or wrong, let us know within 14 days with a photo — we&apos;ll sort it.</p>
              </div>
            </details>

            {/* 8. Artist credit — minimal */}
            <div className={styles.artistStrip}>
              <Link href="/about" className={styles.artistLink}>
                Work by Stine Weirsøe Flamant &rarr;
              </Link>
            </div>

            {/* 9. Share — lowest priority */}
            <ShareButtons
              url={`https://dayindayin.dk/shop/${handle}`}
              title={product.title}
              imageUrl={mainImage?.url ?? null}
            />
          </div>
        </div>
        <StickyATC title={displayTitle(product.title)} imageUrl={mainImage?.url ?? null} />
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
            <Link href={seriesFilterValue ? `/shop?filter=${seriesFilterValue}` : '/shop'} className={styles.relatedViewAll}>
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
                  <span className={styles.relatedName}>{displayTitle(p.title)}</span>
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
                  <span className={styles.relatedName}>{displayTitle(p.title)}</span>
                  <span className={styles.relatedPrice}>{formatPrice(p.minPrice.amount)}</span>
                </div>
              </Link>
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
            <div className={styles.originalsSectionHead}>
              <div>
                <h2 className={styles.originalsSectionTitle}>Original {mediumLabel} works</h2>
                <p className={styles.originalsSectionSub}>These are the unique originals this print is based on — available on enquiry.</p>
              </div>
              <Link href={`/archive?category=${mediumTag.toLowerCase()}`} className={styles.originalsViewAll}>See all originals →</Link>
            </div>
            <div className={styles.originalsGrid}>
              {originals.map(w => (
                <Link key={w.slug} href={`/works/${w.slug}`} className={styles.originalCard}>
                  <div className={styles.originalCardImg}>
                    <Image src={w.image} alt={w.title} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
                    <div className={styles.originalCardOverlay}>
                      <span className={styles.originalCardEnquire}>Enquire →</span>
                    </div>
                  </div>
                  <span className={styles.originalCardTitle}>{w.title}</span>
                  <span className={styles.originalCardYear}>{w.year}</span>
                </Link>
              ))}
            </div>
          </section>
        )
      })()}

      <RecentlyViewed
        currentHandle={handle}
        currentProduct={{
          handle,
          title: displayTitle(product.title),
          imageUrl: mainImage?.url ?? null,
          price: formatPrice(product.minPrice.amount),
          category: categoryLabel(product),
        }}
      />
    </div>
  )
}
