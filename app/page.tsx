import Link from 'next/link'
import Image from 'next/image'
import { getProducts, formatPrice } from '@/lib/shopify/products'
import styles from './page.module.css'

const BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

const LIFESTYLE = [
  `${BLOB}/lifestyle/ls-01.jpg`,
  `${BLOB}/lifestyle/ls-04.jpg`,
  `${BLOB}/lifestyle/ls-05.jpg`,
  `${BLOB}/lifestyle/ls-07.jpg`,
  `${BLOB}/lifestyle/ls-03.jpg`,
  `${BLOB}/lifestyle/ls-09.jpg`,
]

export default async function HomePage() {
  const products = await getProducts(8).catch(() => [] as Awaited<ReturnType<typeof getProducts>>)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image
            src={`${BLOB}/lifestyle/ls-01.jpg`}
            alt="Art by Stine Weirsøe Flamant"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Copenhagen, Denmark</span>
          <h1 className={styles.heroTitle}>Art made by hand.<br />Printed for your wall.</h1>
          <Link href="/shop" className={styles.heroCta}>Shop all works</Link>
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
                    ? <img src={p.firstImage.url} alt={p.firstImage.altText ?? p.title} />
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

      {/* ── Lifestyle strip ──────────────────────────────────── */}
      <section className={styles.lifestyleStrip}>
        {LIFESTYLE.map((src, i) => (
          <div key={i} className={styles.lifestyleImg}>
            <Image src={src} alt="Studio" fill sizes="33vw" style={{ objectFit: 'cover' }} />
          </div>
        ))}
      </section>
    </>
  )
}
