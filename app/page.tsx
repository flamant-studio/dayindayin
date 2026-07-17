import Link from 'next/link'
import Image from 'next/image'
import { getProducts, formatPriceLabel, categoryLabel, seriesLabel, isArtworkProduct } from '@/lib/shopify/products'
import { displayTitle } from '@/lib/display'
import { works } from '@/lib/data'
import { SERIES } from '@/lib/series'
import SectionHeading from '@/components/SectionHeading'
import ProductCard from '@/components/ProductCard'
import SeriesTile from '@/components/SeriesTile'
import styles from './page.module.css'

const BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

// ls-01/02/04/05/07 are used elsewhere on the homepage and on /commissions — kept out of this
// strip on purpose (see Task 5, 2026-07-11). ls-03/06/08/09 are the only lifestyle shots not
// already featured anywhere on the live site; the 4th slot pulls a studio detail from Jellyfish's
// own gallery (never surfaced outside that work's own PDP) rather than repeat a lifestyle photo.
const LIFESTYLE = [
  { src: `${BLOB}/lifestyle/ls-03.jpg`, alt: 'Moodboard and colour references in the studio — Stine Weirsøe Flamant' },
  { src: `${BLOB}/lifestyle/ls-08.jpg`, alt: 'Tufted rug piece and embroidery supplies on the studio deck' },
  { src: `${BLOB}/lifestyle/ls-09.jpg`, alt: 'Coffee and magazines on the studio table' },
  { src: `${BLOB}/works/tufting/jellyfish/gallery/3.jpg`, alt: 'Detail of hand-tufted wool texture — Stine Weirsøe Flamant' },
]

export const revalidate = 60

export default async function HomePage() {
  const availableWorks = works.filter(w => !w.sold).length

  // Targeted fetch — faster than getAllProducts (500+ items)
  const rawProducts = await getProducts(48).then(all => all.filter(p => p.firstImage)).catch(() => [])

  // Prefer flat artwork over product mockups, then diversify by category (max 2 per type)
  const MOCKUP_TYPE_KEYWORDS = ['mug', 'tote', 'tank', 'cap', 'bottle', 'wood print', 'postcard', 'greeting card']
  const isMockupProduct = (title: string) => { const t = title.toLowerCase(); return MOCKUP_TYPE_KEYWORDS.some(k => t.includes(k)) }
  const artFirst = [
    ...rawProducts.filter(p => !isMockupProduct(p.title)),
    ...rawProducts.filter(p => isMockupProduct(p.title)),
  ]
  // Cap each category at 2 slots so the grid shows variety
  const catCount = new Map<string, number>()
  const diverse: typeof artFirst = []
  for (const p of artFirst) {
    const cat = categoryLabel(p)
    const n = catCount.get(cat) ?? 0
    if (n < 2) { diverse.push(p); catCount.set(cat, n + 1) }
    if (diverse.length >= 8) break
  }
  // Fill remaining slots if fewer than 8 categories available
  if (diverse.length < 8) {
    const used = new Set(diverse.map(p => p.id))
    for (const p of artFirst) { if (!used.has(p.id)) { diverse.push(p); if (diverse.length >= 8) break } }
  }
  const products = diverse

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Day In Day In',
    url: 'https://dayindayin.dk',
    logo: 'https://dayindayin.dk/icon.png',
    sameAs: ['https://www.instagram.com/dayindayin'],
    description: 'Art prints and original works by Copenhagen artist Stine Weirsøe Flamant. Print-on-demand by Gelato, shipped across Europe.',
    foundingLocation: { '@type': 'Place', name: 'Copenhagen, Denmark' },
    founder: { '@type': 'Person', name: 'Stine Weirsøe Flamant' },
  }

  const siteSearchJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Day In Day In',
    url: 'https://dayindayin.dk',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://dayindayin.dk/search?q={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSearchJsonLd) }} />
      {/* ── Hero — full-bleed ────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <video
            autoPlay
            muted
            loop
            playsInline
            className={styles.heroBgVideo}
            poster={`${BLOB}/lifestyle/ls-01.jpg`}
          >
            <source src="https://29kekabbrd49avje.public.blob.vercel-storage.com/video/hero-loop.mp4" type="video/mp4" />
          </video>
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Copenhagen, Denmark</span>
          <h1 className={styles.heroTitle}>Art made<br />by hand.</h1>
          <p className={styles.heroSub}>
            Stine Weirsøe Flamant makes art with her hands in Copenhagen. Originals on enquiry. Prints from 56 kr, shipped across Europe.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/shop" className={styles.heroCta}>Browse the shop</Link>
            <Link href="/fine-art" className={styles.heroCtaSecondary}>See original works</Link>
          </div>
        </div>
      </section>

      {/* ── Two ways to collect ──────────────────────────────── */}
      <section className={styles.collectSection}>
        <Link href="/fine-art" className={styles.collectBlock}>
          <div className={styles.collectImgWrap}>
            <Image
              src={`${BLOB}/lifestyle/ls-07.jpg`}
              alt="Art in the studio — Stine Weirsøe Flamant"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.collectImg}
            />
          </div>
          <div className={styles.collectText}>
            <span className={styles.collectLabel}>Original Fine Art · {availableWorks} available</span>
            <h2 className={styles.collectTitle}>One of a kind.</h2>
            <p className={styles.collectDesc}>
              Tufted textiles, embroidery, paintings — made by hand in Copenhagen. Each piece exists once. Prices on enquiry.
            </p>
            <span className={styles.collectCta}>See original works</span>
          </div>
        </Link>
        <Link href="/shop" className={`${styles.collectBlock} ${styles.collectBlockAlt}`}>
          <div className={styles.collectImgWrap}>
            <Image
              src={`${BLOB}/lifestyle/ls-04.jpg`}
              alt="Art print by Stine Weirsøe Flamant displayed on a wall"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.collectImg}
            />
          </div>
          <div className={styles.collectText}>
            <span className={styles.collectLabel}>Print Shop</span>
            <h2 className={styles.collectTitle}>Art for every wall.</h2>
            <p className={styles.collectDesc}>
              High-quality prints on demand by Gelato. Art prints, framed prints, mugs, totes. From 56 kr — shipped across Europe.
            </p>
            <span className={styles.collectCtaSecondary}>Browse the shop</span>
          </div>
        </Link>
      </section>

      {/* ── Editorial — featured work ─────────────────────────── */}
      <section className={styles.editorial}>
        <div className={styles.editorialImage}>
          <Image
            src={`${BLOB}/works/tufting/liebes-panopticon.jpg?v=2`}
            alt="Liebes Panopticon — hand tufted wool by Stine Weirsøe Flamant"
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
        <div className={styles.editorialBody}>
          <span className={styles.editorialSeries}>Tufting — from the studio</span>
          <h2 className={styles.editorialTitle}>Liebes Panopticon</h2>
          <p className={styles.editorialNote}>
            The title takes Foucault's structure of surveillance and puts the word "Liebes" — beloved — in front of it. Coercion in warmth's clothing. Hand-tufted wool on canvas; made over several days in the Copenhagen studio. One of a kind.
          </p>
          <Link href="/works/liebes-panopticon" className={styles.editorialLink}>
            See the original →
          </Link>
        </div>
      </section>

      {/* ── Series strip ─────────────────────────────────────── */}
      <section className={styles.seriesSection}>
        <SectionHeading title="Browse by Series" viewAll={{ href: '/collections', label: 'All collections' }} />
        <div className={styles.seriesStrip}>
          {SERIES.map(({ tag, label, sub, accent, image }) => (
            <SeriesTile
              key={tag}
              href={`/shop?filter=${tag}`}
              label={label}
              sub={sub}
              accent={accent}
              imgUrl={image}
            />
          ))}
        </div>
      </section>

      {/* ── In the shop ──────────────────────────────────────── */}
      <section className={styles.section}>
        <SectionHeading title="In the shop" viewAll={{ href: '/shop', label: 'All products' }} />

        {products.length > 0 ? (
          <div className={styles.productGrid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} sizes="(max-width: 768px) 50vw, 25vw" />
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
          Stine Weirsøe Flamant makes art with her hands in Copenhagen — tufted textiles, embroidered canvas, paintings, and photography. Everything in this shop is her work. Nothing is licensed in.
        </p>
        <Link href="/about" className={styles.artistLink}>About the artist →</Link>
      </section>

      {/* ── Studio Notes teaser — disabled 2026-07-11, no live copy yet.
          See app/_art-journal and app/_blog (renamed to unpublish, not deleted). ── */}

      {/* ── Newsletter — disabled 2026-07-11, moved to a minimal footer signup
          (see components/Footer.tsx). Full-section variant kept in NewsletterSignup.tsx. ── */}

      {/* ── Lifestyle strip ──────────────────────────────────── */}
      <Link href="/shop" className={styles.lifestyleStripLink}>
        <section className={styles.lifestyleStrip}>
          {LIFESTYLE.map(({ src, alt }, i) => (
            <div key={i} className={styles.lifestyleImg}>
              <Image src={src} alt={alt} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </section>
      </Link>
    </>
  )
}
