import Link from 'next/link'
import Image from 'next/image'
import { getProducts, formatPrice } from '@/lib/shopify/products'
import NewsletterSignup from '@/components/NewsletterSignup'
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
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* Left panel — desktop only */}
        <div className={styles.heroLeft}>
          <span className={styles.heroLabel}>Copenhagen, Denmark</span>
          <h1 className={styles.heroTitle}>Art made by hand.<br />Printed for your wall.</h1>
          <p className={styles.heroSub}>Original works by Copenhagen artist Stine Weirsøe Flamant. Every print made on demand — no mass production.</p>
          <Link href="/shop" className={styles.heroCta}>Shop all works</Link>
        </div>

        {/* Right panel — lifestyle image (full-bleed on mobile) */}
        <div className={styles.heroRight}>
          <Image
            src={`${BLOB}/lifestyle/ls-01.jpg`}
            alt="Art by Stine Weirsøe Flamant"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 45vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Overlay only on mobile */}
          <div className={styles.heroOverlayMobile} />
          {/* Mobile content — overlaid on image */}
          <div className={styles.heroContentMobile}>
            <span className={styles.heroLabel}>Copenhagen, Denmark</span>
            <h1 className={styles.heroTitle}>Art made by hand.<br />Printed for your wall.</h1>
            <p className={styles.heroSub}>Original works by Copenhagen artist Stine Weirsøe Flamant. Every print made on demand — no mass production.</p>
            <Link href="/shop" className={styles.heroCta}>Shop all works</Link>
          </div>
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
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{p.title}</span>
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
        <p className={styles.lifestyleCaption}>See all works in the shop →</p>
      </Link>
    </>
  )
}
