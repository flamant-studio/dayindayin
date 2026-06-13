import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts, formatPrice, categoryLabel } from '@/lib/shopify/products'
import NewsletterSignup from '@/components/NewsletterSignup'
import WishlistButton from '@/components/WishlistButton'
import styles from './page.module.css'

const BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

const LIFESTYLE = [
  `${BLOB}/lifestyle/ls-01.jpg`,
  `${BLOB}/lifestyle/ls-04.jpg`,
  `${BLOB}/lifestyle/ls-05.jpg`,
]

const SERIES_CARDS = [
  { tag: 'shero',       label: 'SHERO',        sub: 'Feminist pop-art',     accent: '#D94F2C' },
  { tag: 'neko',        label: 'NEKO',          sub: 'Cats and symbols',     accent: '#2E5D4B' },
  { tag: 'sea-monsters',label: 'Sea Monsters',  sub: 'Imaginary creatures',  accent: '#4A7A9B' },
  { tag: 'botanical',   label: 'Botanical',     sub: 'Plants and growth',    accent: '#5C7A48' },
  { tag: 'floral',      label: 'Floral',        sub: 'Bold florals',         accent: '#B85C78' },
  { tag: 'faces',       label: 'Faces',         sub: 'Portraits and masks',  accent: '#7A6B8A' },
]

export default async function HomePage() {
  const allRecent = await getAllProducts().catch(() => [])
  const products = allRecent.filter((p) => p.firstImage).slice(0, 8)

  // Build series image map from already-fetched products
  const seriesImageMap: Record<string, string> = {}
  for (const p of allRecent) {
    if (!p.firstImage) continue
    for (const tag of p.tags) {
      const t = tag.toLowerCase()
      if (!seriesImageMap[t]) seriesImageMap[t] = p.firstImage.url
    }
  }

  return (
    <>
      {/* ── Hero — full-bleed ────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src={`${BLOB}/lifestyle/ls-01.jpg`}
            alt="Art by Stine Weirsøe Flamant"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
          />
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Copenhagen, Denmark</span>
          <h1 className={styles.heroTitle}>Art made<br />by hand.</h1>
          <p className={styles.heroSub}>
            Original works by Stine Weirsøe Flamant — tufted textiles, embroidery, painting, photography. Every print made on demand.
          </p>
          <Link href="/shop" className={styles.heroCta}>Shop all prints</Link>
        </div>
      </section>

      {/* ── New In ───────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>New In</h2>
          <Link href="/shop" className={styles.viewAll}>All products →</Link>
        </div>

        {products.length > 0 ? (
          <div className={styles.productGrid}>
            {products.map((p) => (
              <Link key={p.id} href={`/shop/${p.handle}`} className={styles.card}>
                <div className={styles.cardImg}>
                  {p.firstImage
                    ? <Image src={p.firstImage.url} alt={p.firstImage.altText ?? p.title} fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImgEl} />
                    : <div className={styles.cardPlaceholder} />
                  }
                  <WishlistButton
                    handle={p.handle}
                    title={p.title}
                    imageUrl={p.firstImage?.url ?? null}
                    price={formatPrice(p.minPrice.amount)}
                  />
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{p.title}</span>
                  <span className={styles.cardType}>{categoryLabel(p)}</span>
                  <span className={styles.cardPrice}>{formatPrice(p.minPrice.amount)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.comingSoon}>
            <p>Products are being added. Check back shortly.</p>
            <Link href="/shop" className={styles.heroCta}>Go to shop</Link>
          </div>
        )}
      </section>

      {/* ── Series strip ─────────────────────────────────────── */}
      <section className={styles.seriesSection}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Browse by Series</h2>
          <Link href="/collections" className={styles.viewAll}>All collections →</Link>
        </div>
        <div className={styles.seriesStrip}>
          {SERIES_CARDS.map(({ tag, label, sub, accent }) => {
            const imgUrl = seriesImageMap[tag]
            return (
              <Link key={tag} href={`/shop?filter=${tag}`} className={styles.seriesCard}>
                <div className={styles.seriesCardImg} style={{ borderBottom: `3px solid ${accent}` }}>
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={label}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className={styles.seriesCardPlaceholder} style={{ background: accent + '22' }} />
                  )}
                </div>
                <div className={styles.seriesCardInfo}>
                  <span className={styles.seriesCardLabel}>{label}</span>
                  <span className={styles.seriesCardSub}>{sub}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Editorial — featured work ─────────────────────────── */}
      <section className={styles.editorial}>
        <div className={styles.editorialImage}>
          <Image
            src={`${BLOB}/works/painting/universe-1.jpg`}
            alt="Universe I — painting by Stine Weirsøe Flamant"
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
        <div className={styles.editorialBody}>
          <span className={styles.editorialSeries}>Painting — from the studio</span>
          <h2 className={styles.editorialTitle}>Universe I</h2>
          <p className={styles.editorialNote}>
            Started on the floor of the studio. Acrylic and oil stick, built up over several sessions — layers added and scraped back until the colour felt right. The Universe series is Stine&apos;s oldest ongoing body of work: each canvas a different attempt to paint something without edges.
          </p>
          <Link href="/shop?filter=painting" className={styles.editorialLink}>
            Shop paintings →
          </Link>
        </div>
      </section>

      {/* ── Artist statement ─────────────────────────────────── */}
      <section className={styles.artistStrip}>
        <p className={styles.artistText}>
          Stine makes art with her hands — tufted textiles, embroidered canvas, photography, digital illustration. Each piece starts in the studio and ends on your wall.
        </p>
        <Link href="/about" className={styles.artistLink}>About the artist →</Link>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <NewsletterSignup />

      {/* ── Lifestyle strip ──────────────────────────────────── */}
      <Link href="/shop" className={styles.lifestyleStripLink}>
        <section className={styles.lifestyleStrip}>
          {LIFESTYLE.map((src, i) => (
            <div key={i} className={styles.lifestyleImg}>
              <Image src={src} alt="Studio" fill sizes="33vw" style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </section>
        <p className={styles.lifestyleCaption}>See all products in the shop →</p>
      </Link>
    </>
  )
}
