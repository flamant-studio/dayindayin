import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

const BLOB_BASE = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

export const metadata = {
  title: 'About',
  description: 'Stine Weirsøe Flamant — contemporary artist, Copenhagen. Embroidery, tufting, photography, painting.',
}

export default function AboutPage() {
  return (
    <div className={styles.page}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <p className={styles.heroLabel}>The Artist</p>
        <h1 className={styles.heroTitle}>Stine Weirsøe Flamant</h1>
        <p className={styles.heroSub}>Contemporary artist · Copenhagen</p>
      </section>

      {/* ── Portrait + bio ────────────────────────────────────── */}
      <section className={styles.profile}>
        <div className={styles.portraitWrap}>
          <Image
            src={`${BLOB_BASE}/about/stine-portrait.jpg`}
            alt="Stine Weirsøe Flamant"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.portraitImg}
            priority
          />
        </div>
        <div className={styles.bio}>
          <p className={styles.bioLead}>
            We all have <em>superpowers</em>. Mine is making something out of nothing.
          </p>
          <p>
            Colour is the fabric of my entire being. I am curious about the human condition
            — how to be human in these strange times, and what humanity looks like when you
            observe from the edges or from deep within.
          </p>
          <p>
            My disability — a chronic autoimmune pain syndrome — and my personal history
            is the canvas for every artwork I create. I consider myself an outsider artist.
          </p>
          <p>
            Sometimes my art is literal: words and sentences taken from what I see and read,
            enlarged on embroidery fabric. Sometimes the political aspect is more subtle,
            or more personal.
          </p>
          <p>
            I am a textile artist involved in a love affair with embroidery and hand tufting.
            Slowly and gently, my artistic voice sounds more and more familiar to me.
          </p>
        </div>
      </section>

      {/* ── Process photos ───────────────────────────────────── */}
      <section className={styles.process}>
        <div className={styles.processImg}>
          <Image
            src={`${BLOB_BASE}/about/stine-embroidery.jpg`}
            alt="Stine at work — embroidery"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.processImgEl}
          />
        </div>
        <div className={styles.processImg}>
          <Image
            src={`${BLOB_BASE}/about/stine-embroidery-2.jpg`}
            alt="Stine at work — embroidery detail"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.processImgEl}
          />
        </div>
      </section>

      {/* ── Two ways to collect ──────────────────────────────── */}
      <section className={styles.studio}>
        <p className={styles.studioNote}>
          There are two ways to collect this work. The{' '}
          <Link href="/fine-art">Fine Art section</Link>{' '}
          holds original pieces — hand-tufted textiles, embroidery, unique works on canvas.
          These are one-of-a-kind; enquiries are handled directly.
          For prints, mugs, totes, and more, the{' '}
          <Link href="/shop">shop</Link>{' '}
          ships across Europe from 56 kr.
        </p>
        <div className={styles.studioLinks}>
          <Link href="/fine-art" className={styles.shopCta}>Original works →</Link>
          <Link href="/shop" className={styles.shopCtaSecondary}>Browse the shop →</Link>
        </div>
      </section>

    </div>
  )
}
