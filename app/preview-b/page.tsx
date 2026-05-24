import Image from 'next/image'
import Link from 'next/link'
import { getProducts, formatPrice, categoryLabel } from '@/lib/shopify/products'
import styles from './page.module.css'

const BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

export default async function PreviewB() {
  const all = await getProducts(60).catch(() => [])
  const products = all.filter((p) => p.firstImage).slice(0, 10)

  return (
    <div className={styles.page}>
      <div className={styles.previewBanner}>DESIGN PREVIEW B — Graphic / Poster</div>

      {/* ── Hero: pure typography, image as inset ── */}
      <section className={styles.hero}>
        <div className={styles.heroInset}>
          <Image
            src={`${BLOB}/lifestyle/ls-04.jpg`}
            alt="Art by Stine Weirsøe Flamant"
            fill
            priority
            sizes="30vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className={styles.heroType}>
          <p className={styles.heroBy}>By Stine Weirsøe Flamant</p>
          <h1 className={styles.heroTitle}>
            <span>Day</span>
            <span>In</span>
            <span>Day</span>
            <span>In</span>
          </h1>
          <p className={styles.heroDisciplines}>
            Tufting · Embroidery · Painting · Photography
          </p>
          <Link href="/shop" className={styles.heroCta}>→ Enter shop</Link>
        </div>
      </section>

      {/* ── Products as ruled list ── */}
      <section className={styles.catalog}>
        <div className={styles.catalogHead}>
          <span className={styles.catalogNum}>Works available — {products.length} shown</span>
          <Link href="/shop" className={styles.catalogAll}>See all</Link>
        </div>
        <div className={styles.list}>
          {products.map((p, i) => (
            <Link key={p.id} href={`/shop/${p.handle}`} className={styles.row}>
              <span className={styles.rowIndex}>{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.rowThumb}>
                <Image
                  src={p.firstImage!.url}
                  alt={p.firstImage!.altText ?? p.title}
                  fill
                  sizes="80px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <span className={styles.rowTitle}>{p.title}</span>
              <span className={styles.rowType}>{categoryLabel(p)}</span>
              <span className={styles.rowPrice}>{formatPrice(p.minPrice.amount)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Statement block ── */}
      <section className={styles.statement}>
        <div className={styles.statementInner}>
          <p className={styles.statementText}>
            Copenhagen-based artist. Works in tufting, embroidery,<br />
            digital illustration, and photography since 2018.
          </p>
          <Link href="/about" className={styles.statementLink}>Read more →</Link>
        </div>
      </section>
    </div>
  )
}
