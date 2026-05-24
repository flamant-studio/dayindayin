import Image from 'next/image'
import Link from 'next/link'
import { getProducts, formatPrice } from '@/lib/shopify/products'
import styles from './page.module.css'

const BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

export default async function PreviewC() {
  const all = await getProducts(60).catch(() => [])
  const products = all.filter((p) => p.firstImage).slice(0, 8)

  return (
    <div className={styles.page}>
      <div className={styles.previewBanner}>DESIGN PREVIEW C — Quiet / Kinfolk</div>

      {/* ── Hero: centered, minimal, breathing ── */}
      <section className={styles.hero}>
        <span className={styles.heroEyebrow}>Copenhagen, Denmark</span>
        <div className={styles.heroFrame}>
          <Image
            src={`${BLOB}/lifestyle/ls-01.jpg`}
            alt="Art by Stine Weirsøe Flamant"
            fill
            priority
            sizes="(max-width: 768px) 90vw, 640px"
            style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
          />
        </div>
        <h1 className={styles.heroTitle}>Art made by hand</h1>
        <p className={styles.heroSub}>
          Original works by Stine Weirsøe Flamant.<br />
          Every print made on demand — no mass production.
        </p>
        <Link href="/shop" className={styles.heroCta}>Shop all works</Link>
      </section>

      {/* ── Thin rule ── */}
      <div className={styles.rule} />

      {/* ── Products: floating, transparent, generous gaps ── */}
      <section className={styles.works}>
        <p className={styles.worksLabel}>Selected works</p>
        <div className={styles.grid}>
          {products.map((p) => (
            <Link key={p.id} href={`/shop/${p.handle}`} className={styles.card}>
              <div className={styles.cardImg}>
                <Image
                  src={p.firstImage!.url}
                  alt={p.firstImage!.altText ?? p.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={styles.cardImgEl}
                />
              </div>
              <p className={styles.cardTitle}>{p.title}</p>
              <p className={styles.cardPrice}>{formatPrice(p.minPrice.amount)}</p>
            </Link>
          ))}
        </div>
        <div className={styles.worksFooter}>
          <Link href="/shop" className={styles.worksAll}>View all works →</Link>
        </div>
      </section>

      {/* ── Artist note ── */}
      <section className={styles.note}>
        <div className={styles.noteImg}>
          <Image
            src={`${BLOB}/lifestyle/ls-05.jpg`}
            alt="Stine in the studio"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className={styles.noteText}>
          <p className={styles.noteLabel}>About the artist</p>
          <p className={styles.noteBody}>
            Stine makes art with her hands — tufted textiles, embroidered canvas,
            photography, digital illustration. Each piece starts in the studio
            and ends on your wall.
          </p>
          <Link href="/about" className={styles.noteLink}>Read more</Link>
        </div>
      </section>
    </div>
  )
}
