import Link from 'next/link'
import Image from 'next/image'
import { getProducts, formatPrice, categoryLabel } from '@/lib/shopify/products'
import NewsletterSignup from '@/components/NewsletterSignup'
import WishlistButton from '@/components/WishlistButton'
import styles from './page.module.css'

const BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

const LIFESTYLE = [
  `${BLOB}/lifestyle/ls-01.jpg`,
  `${BLOB}/lifestyle/ls-04.jpg`,
  `${BLOB}/lifestyle/ls-05.jpg`,
]

export default async function HomePage() {
  const allRecent = await getProducts(60).catch(() => [] as Awaited<ReturnType<typeof getProducts>>)
  const products = allRecent.filter((p) => p.firstImage).slice(0, 8)

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
