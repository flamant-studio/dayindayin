import Link from 'next/link'
import Image from 'next/image'
import { getProducts, getProductsByTitleKeyword, formatPriceLabel, categoryLabel, seriesLabel, isArtworkProduct } from '@/lib/shopify/products'
import { displayTitle } from '@/lib/display'
import { blogPosts } from '@/lib/data'
import NewsletterSignup from '@/components/NewsletterSignup'
import WishlistButton from '@/components/WishlistButton'
import QuickAddButton from '@/components/QuickAddButton'
import styles from './page.module.css'

const BLOB = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

const LIFESTYLE = [
  `${BLOB}/lifestyle/ls-01.jpg`,
  `${BLOB}/lifestyle/ls-04.jpg`,
  `${BLOB}/lifestyle/ls-05.jpg`,
]

const SERIES_CARDS = [
  { tag: 'shero',       label: 'SHERO',        sub: 'Feminist pop-art',      accent: '#D94F2C' },
  { tag: 'neko',        label: 'NEKO',          sub: 'Cats and symbols',      accent: '#2E5D4B' },
  { tag: 'sea-monsters',label: 'Sea Monsters',  sub: 'Imaginary creatures',   accent: '#4A7A9B' },
  { tag: 'botanical',   label: 'Botanical',     sub: 'Plants and growth',     accent: '#5C7A48' },
  { tag: 'floral',      label: 'Floral',        sub: 'Bold florals',          accent: '#B85C78' },
  { tag: 'faces',       label: 'Faces',         sub: 'Portraits and masks',   accent: '#7A6B8A' },
  { tag: 'sommerby',    label: 'Sommerby',      sub: 'Danish summer light',   accent: '#C4694F' },
]

export const revalidate = 60

// Keywords to fetch one representative image per series (flat art preferred over mockups)
const SERIES_KEYWORDS: Array<{ tag: string; keyword: string }> = [
  { tag: 'shero',        keyword: 'shero' },
  { tag: 'neko',         keyword: 'neko' },
  { tag: 'sea-monsters', keyword: 'Sea Monsters' },
  { tag: 'botanical',    keyword: 'Botanical' },
  { tag: 'floral',       keyword: 'Floral' },
  { tag: 'faces',        keyword: 'Face' },
  { tag: 'sommerby',     keyword: 'Sommerby' },
]

const MOCKUP_KEYWORDS = ['mug', 'tote bag', 'tank top', ' cap', 'water bottle', 'wood print']
const isMockup = (title: string) => { const t = title.toLowerCase(); return MOCKUP_KEYWORDS.some(k => t.includes(k)) }

export default async function HomePage() {
  // Parallel targeted fetches — faster than getAllProducts (500+ items)
  const [products, ...seriesResults] = await Promise.all([
    getProducts(12).then(all => all.filter(p => p.firstImage)).catch(() => []),
    ...SERIES_KEYWORDS.map(({ keyword }) =>
      getProductsByTitleKeyword(keyword, 8).catch(() => [])
    ),
  ])

  // Pick best image per series: flat art preferred, dark variants over light/blanc
  const LIGHT_TITLE_KEYWORDS = ['blanc', 'white', 'cream']
  const isLight = (t: string) => { const tl = t.toLowerCase(); return LIGHT_TITLE_KEYWORDS.some(k => tl.includes(k)) }
  const seriesImageMap: Record<string, string> = {}
  SERIES_KEYWORDS.forEach(({ tag }, i) => {
    const prods = seriesResults[i].filter(p => p.firstImage)
    // Score: mockup=+2, light/blanc variant=+1 (lower is better)
    const scored = prods.map(p => ({
      p,
      score: (isMockup(p.title) ? 2 : 0) + (isLight(p.title) ? 1 : 0),
    }))
    scored.sort((a, b) => a.score - b.score)
    const best = scored[0]?.p
    if (best?.firstImage) seriesImageMap[tag] = best.firstImage.url
  })

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
            Stine Weirsøe Flamant makes art with her hands in Copenhagen. Originals on enquiry. Prints from 56 kr, shipped across Europe.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/shop" className={styles.heroCta}>Browse the shop</Link>
            <Link href="/fine-art" className={styles.heroCtaSecondary}>See original works</Link>
          </div>
          <div className={styles.heroTrustRow}>
            <span className={styles.heroTrustDot} aria-hidden="true" />
            <span className={styles.heroTrustText}>Shop open · Ships to EU, UK &amp; Norway · Printed by Gelato</span>
          </div>
        </div>
      </section>

      {/* ── New In ───────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Latest Work</h2>
          <Link href="/shop" className={styles.viewAll}>All products →</Link>
        </div>

        {products.length > 0 ? (
          <div className={styles.productGrid}>
            {products.map((p) => (
              <Link key={p.id} href={`/shop/${p.handle}`} className={styles.card}>
                <div className={`${styles.cardImg} ${isArtworkProduct(p) ? styles.cardImgArtwork : styles.cardImgMockup}`}>
                  {p.firstImage
                    ? <Image src={p.firstImage.url} alt={p.firstImage.altText ?? p.title} fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.cardImgEl} />
                    : <div className={styles.cardPlaceholder} />
                  }
                  <WishlistButton
                    handle={p.handle}
                    title={displayTitle(p.title)}
                    imageUrl={p.firstImage?.url ?? null}
                    price={formatPriceLabel(p)}
                  />
                  {p.variants.length === 1 && p.firstVariant?.title === 'Default Title' && p.firstVariant.availableForSale && (
                    <QuickAddButton merchandiseId={p.firstVariant.id} title={p.title} />
                  )}
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{displayTitle(p.title)}</span>
                  <span className={styles.cardType}>
                    {seriesLabel(p) ? `${seriesLabel(p)} · ` : ''}{categoryLabel(p)}
                  </span>
                  <span className={styles.cardPrice}>{formatPriceLabel(p)}</span>
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
                <div className={styles.seriesCardImg}>
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
                  <span className={styles.seriesCardLabel} style={{ color: accent }}>{label}</span>
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
            src={`${BLOB}/works/tufting/candy-I.jpg`}
            alt="Candy I — tufted textile by Stine Weirsøe Flamant"
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
        <div className={styles.editorialBody}>
          <span className={styles.editorialSeries}>Tufting — from the studio</span>
          <h2 className={styles.editorialTitle}>Candy I</h2>
          <p className={styles.editorialNote}>
            Made by hand with a tufting gun on stretched cotton canvas. Bold candy-stripe geometry in cut and loop pile — the kind of colour that stops you in a room. Stine has been tufting since 2019; each piece takes days to finish and exists once.
          </p>
          <Link href="/works/candy-I" className={styles.editorialLink}>
            See the originals →
          </Link>
        </div>
      </section>

      {/* ── Two ways to collect ──────────────────────────────── */}
      <section className={styles.collectSection}>
        <Link href="/fine-art" className={styles.collectBlock}>
          <div className={styles.collectImgWrap}>
            <Image
              src={`${BLOB}/works/tufting/liebes-panopticon.jpg`}
              alt="Liebes Panopticon — Hand Tufted original by Stine Weirsøe Flamant"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.collectImg}
            />
          </div>
          <div className={styles.collectText}>
            <span className={styles.collectLabel}>Original Fine Art</span>
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

      {/* ── Artist statement ─────────────────────────────────── */}
      <section className={styles.artistStrip}>
        <p className={styles.artistText}>
          Stine Weirsøe Flamant makes art with her hands in Copenhagen — tufted textiles, embroidered canvas, paintings, and photography. Everything in this shop is her work. Nothing is licensed in.
        </p>
        <Link href="/about" className={styles.artistLink}>About the artist →</Link>
      </section>

      {/* ── Studio Notes teaser ──────────────────────────────── */}
      {(() => {
        const notes = blogPosts.slice(0, 3)
        return (
          <section className={styles.notesTeaser}>
            <div className={styles.notesTeaserHead}>
              <div>
                <span className={styles.notesTeaserLabel}>Studio Notes</span>
                <h2 className={styles.notesTeaserTitle}>From the studio</h2>
              </div>
              <Link href="/art-journal" className={styles.notesTeaserViewAll}>All notes →</Link>
            </div>
            <div className={styles.notesTeaserGrid}>
              {notes.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.notesTeaserCard}>
                  <div className={styles.notesTeaserImg}>
                    <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.notesTeaserBody}>
                    <span className={styles.notesTeaserDate}>
                      {new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}
                    </span>
                    <span className={styles.notesTeaserPostTitle}>{post.title}</span>
                    <span className={styles.notesTeaserExcerpt}>{post.excerpt}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })()}


      {/* ── Newsletter ───────────────────────────────────────── */}
      <NewsletterSignup />

      {/* ── Lifestyle strip ──────────────────────────────────── */}
      <Link href="/shop" className={styles.lifestyleStripLink}>
        <section className={styles.lifestyleStrip}>
          {([
            'Art prints by Stine Weirsøe Flamant displayed on a wall',
            'Close-up of hand-tufted textile by Stine Weirsøe Flamant',
            'Studio detail — embroidery and textile work',
          ] as const).map((alt, i) => (
            <div key={i} className={styles.lifestyleImg}>
              <Image src={LIFESTYLE[i]} alt={alt} fill sizes="33vw" style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </section>
        <p className={styles.lifestyleCaption}>See all products in the shop →</p>
      </Link>
    </>
  )
}
