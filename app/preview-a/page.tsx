import Image from 'next/image'
import Link from 'next/link'
import { getProducts, formatPrice } from '@/lib/shopify/products'
import styles from './page.module.css'

const BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

export default async function PreviewA() {
  const all = await getProducts(60).catch(() => [])
  const products = all.filter((p) => p.firstImage).slice(0, 9)
  const heroProduct = products[0]

  return (
    <div className={styles.page}>
      <div className={styles.previewBanner}>DESIGN PREVIEW A — Magazine / Editorial</div>

      {/* ── Hero: full-bleed image + centered text below ── */}
      <section className={styles.hero}>
        <div className={styles.heroImg}>
          <Image
            src={`${BLOB}/lifestyle/ls-01.jpg`}
            alt="Art by Stine Weirsøe Flamant"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        </div>
        <div className={styles.heroText}>
          <p className={styles.heroIssue}>Copenhagen — 2025</p>
          <h1 className={styles.heroTitle}>Art made<br />by hand.</h1>
          <p className={styles.heroSub}>Original works by Stine Weirsøe Flamant.<br />Printed on demand — no mass production.</p>
          <div><Link href="/shop" className={styles.heroCta}>View the collection</Link></div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className={styles.works}>
        <div className={styles.worksHead}>
          <span className={styles.worksLabel}>New In</span>
          <Link href="/shop" className={styles.worksAll}>All works →</Link>
        </div>
        <div className={styles.grid}>
          {products.map((p) => (
            <Link key={p.id} href={`/shop/${p.handle}`} className={styles.card}>
              <div className={styles.cardImg}>
                <Image
                  src={p.firstImage!.url}
                  alt={p.firstImage!.altText ?? p.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className={styles.cardImgEl}
                />
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.cardTitle}>{p.title}</span>
                <span className={styles.cardPrice}>{formatPrice(p.minPrice.amount)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Artist quote ── */}
      <section className={styles.quote}>
        <p className={styles.quoteText}>
          "Every piece begins as something in the room — a cat, a shadow, a face overheard.
          The work is the record of looking."
        </p>
        <cite className={styles.quoteCite}>— Stine Weirsøe Flamant</cite>
        <Link href="/about" className={styles.quoteLink}>About the artist</Link>
      </section>

      {/* ── Three-up lifestyle ── */}
      <section className={styles.strip}>
        {[
          `${BLOB}/lifestyle/ls-01.jpg`,
          `${BLOB}/lifestyle/ls-04.jpg`,
          `${BLOB}/lifestyle/ls-05.jpg`,
        ].map((src, i) => (
          <div key={i} className={styles.stripImg}>
            <Image src={src} alt="Studio" fill sizes="33vw" style={{ objectFit: 'cover' }} />
          </div>
        ))}
      </section>
    </div>
  )
}
