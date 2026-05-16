import Link from 'next/link'
import { getProducts, formatPrice } from '@/lib/shopify/products'
import styles from './page.module.css'

const COLLECTIONS = [
  { handle: 'tufted-works',  label: 'Tufted Works',  color: '#E8D5C4', desc: 'Wool & colour. Hand-tufted originals as prints.' },
  { handle: 'embroidery',    label: 'Embroidery',    color: '#C4D5C8', desc: 'Thread, fabric, and something to say.' },
  { handle: 'paintings',     label: 'Paintings',     color: '#C4C8D5', desc: 'Instinctive, colourful, without apology.' },
  { handle: 'photography',   label: 'Photography',   color: '#D5C4C8', desc: 'Studio still lifes and found moments.' },
  { handle: 'mixed',         label: 'Mixed Works',   color: '#D5D0C4', desc: 'Collage and experiment.' },
  { handle: 'archive',       label: 'Archive',       color: '#D0C4D5', desc: 'Early works. Available for the first time.' },
]

export default async function HomePage() {
  const products = await getProducts(8).catch(() => [] as Awaited<ReturnType<typeof getProducts>>)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Copenhagen, Denmark</span>
          <h1 className={styles.heroTitle}>Art made by hand.<br />Printed for your wall.</h1>
          <p className={styles.heroSub}>
            Tufting, embroidery, paintings and photography by Stine Weirsøe Flamant.
            Printed on demand by Gelato. Ships to EU, UK &amp; Norway.
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

      {/* ── Collections ──────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Collections</h2>
        </div>
        <div className={styles.collectionGrid}>
          {COLLECTIONS.map((c) => (
            <Link key={c.handle} href={`/shop/collections/${c.handle}`} className={styles.collectionCard}>
              <div className={styles.collectionSwatch} style={{ background: c.color }} />
              <div className={styles.collectionInfo}>
                <span className={styles.collectionLabel}>{c.label}</span>
                <span className={styles.collectionDesc}>{c.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Artist strip ─────────────────────────────────────── */}
      <section className={styles.artistStrip}>
        <p className={styles.artistText}>
          Stine Weirsøe Flamant is a Copenhagen artist working in tufting, embroidery, painting, and photography.
          Every print is a reproduction of an original work, made by hand in her studio.
        </p>
        <Link href="/about" className={styles.artistLink}>About Stine →</Link>
      </section>
    </>
  )
}
