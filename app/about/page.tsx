import Image from 'next/image'
import Link from 'next/link'
import { works } from '@/lib/data'
import styles from './page.module.css'

const BLOB_BASE = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

export const metadata = {
  title: 'About',
  description: 'Stine Weirsøe Flamant — contemporary artist, Copenhagen. Embroidery, tufting, photography, painting.',
  openGraph: {
    title: 'About Stine Weirsøe Flamant',
    description: 'Contemporary artist based in Copenhagen. Embroidery, hand tufting, painting, and photography — made by hand.',
    images: [{ url: 'https://29kekabbrd49avje.public.blob.vercel-storage.com/about/stine-portrait.jpg', width: 800, height: 1000 }],
  },
  alternates: { canonical: '/about' },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Stine Weirsøe Flamant',
  url: 'https://dayindayin.dk/about',
  jobTitle: 'Artist',
  description: 'Contemporary artist based in Copenhagen. Working in hand tufting, embroidery, painting, and photography.',
  sameAs: ['https://www.instagram.com/dayindayin', 'https://dayindayin.dk'],
  image: 'https://29kekabbrd49avje.public.blob.vercel-storage.com/about/stine-portrait.jpg',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Copenhagen',
    addressCountry: 'DK',
  },
  nationality: { '@type': 'Country', name: 'Denmark' },
  worksFor: {
    '@type': 'Organization',
    name: 'Day In Day In',
    url: 'https://dayindayin.dk',
    foundingDate: '2024',
  },
  knowsAbout: ['Hand Tufting', 'Embroidery', 'Acrylic Painting', 'Photography', 'Textile Art'],
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Day In Day In',
  url: 'https://dayindayin.dk',
  logo: 'https://dayindayin.dk/icon.png',
  sameAs: ['https://www.instagram.com/dayindayin'],
  description: 'Art prints and original works by Copenhagen artist Stine Weirsøe Flamant.',
  address: { '@type': 'PostalAddress', addressLocality: 'Copenhagen', addressCountry: 'DK' },
  foundingDate: '2024',
  founder: { '@type': 'Person', name: 'Stine Weirsøe Flamant' },
}

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

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
          <a
            href="https://www.instagram.com/dayindayin"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instagramLink}
          >
            @dayindayin on Instagram →
          </a>
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

      {/* ── Artist statement ─────────────────────────────────── */}
      <section className={styles.statement}>
        <p className={styles.statementQuote}>
          &ldquo;I make art with what I have, from where I am. I am driven to make the unseen visible —
          to give it mass and substance, so that the world becomes larger for all of us.&rdquo;
        </p>
        <p className={styles.statementAttr}>Stine Weirsøe Flamant, 2022</p>
      </section>

      {/* ── Process ──────────────────────────────────────────── */}
      <section className={styles.processNote}>
        <h2 className={styles.processNoteTitle}>How the work gets made</h2>
        <div className={styles.processNoteBody}>
          <p>
            Tufting happens on a frame. The gun drives loops of wool through a canvas backing,
            building up a pile layer by layer. A large piece can take ten, twelve, fifteen hours
            of continuous work. The results look loose and expressive from a distance but are built
            up with deliberate precision — pile height, density, colour placement.
          </p>
          <p>
            Embroidery is slower. Needle and thread on fabric or canvas, one stitch at a time.
            Stine&apos;s embroidery work tends toward text — words, sentences, fragments —
            because there&apos;s something about the physical slowness of stitching that makes
            language feel earned.
          </p>
          <p>
            Painting is the wildest of the three. Acrylic and oil stick, worked on the studio
            floor. Layers added and scraped back. Sessions sometimes weeks apart while a canvas
            dries or settles. The Universe series has been going since 2019.
          </p>
        </div>
      </section>

      {/* ── Milestones ───────────────────────────────────────── */}
      <section className={styles.milestones}>
        <h2 className={styles.milestonesTitle}>Selected work &amp; milestones</h2>
        <ul className={styles.milestoneList}>
          {[
            { year: '2019', text: 'Began the Universe series — ongoing body of work in acrylic and oil stick.' },
            { year: '2020', text: 'Started hand tufting. First large-format tufted pieces exhibited.' },
            { year: '2021', text: 'SHERO series — feminist pop-art embroidery and textile work.' },
            { year: '2022', text: 'NEKO series — cats as symbols of independence and curiosity. First print editions.' },
            { year: '2023', text: 'Sea Monsters series. Expanded into mixed-media and large-format works.' },
            { year: '2024', text: 'DayInDayIn launched as an independent art brand and print shop.' },
            { year: '2025', text: 'Botanical and Floral series. Print shop expanded across Europe via Gelato.' },
            { year: '2026', text: 'New botanical summer series. Shop of Words text works. NEKO series continues with large-format tufted pieces.' },
          ].map(({ year, text }) => (
            <li key={year} className={styles.milestone}>
              <span className={styles.milestoneYear}>{year}</span>
              <span className={styles.milestoneText}>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Browse by medium ─────────────────────────────────── */}
      <section className={styles.mediumLinks}>
        <h2 className={styles.mediumLinksTitle}>Browse the archive by medium</h2>
        <div className={styles.mediumLinksGrid}>
          {([
            { href: '/archive?category=tufting',     label: 'Hand Tufting',  count: works.filter(w => w.category === 'tufting').length },
            { href: '/archive?category=embroidery',  label: 'Embroidery',    count: works.filter(w => w.category === 'embroidery').length },
            { href: '/archive?category=painting',    label: 'Painting',      count: works.filter(w => w.category === 'painting').length },
            { href: '/archive?category=photography', label: 'Photography',   count: works.filter(w => w.category === 'photography').length },
          ] as const).map(({ href, label, count }) => (
            <Link key={href} href={href} className={styles.mediumLink}>
              <span className={styles.mediumLinkLabel}>{label}</span>
              <span className={styles.mediumLinkCount}>{count} works</span>
            </Link>
          ))}
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

      {/* ── Contact block ────────────────────────────────────── */}
      <section className={styles.contactBlock}>
        <h2 className={styles.contactBlockTitle}>Get in touch</h2>
        <p className={styles.contactBlockSub}>
          For commissions, press, or general enquiries — Stine responds directly.
        </p>
        <div className={styles.contactBlockLinks}>
          <a href="mailto:stine@dayindayin.dk" className={styles.contactEmail}>
            stine@dayindayin.dk
          </a>
          <a href="https://www.instagram.com/dayindayin" target="_blank" rel="noopener noreferrer" className={styles.contactSocial}>
            Instagram →
          </a>
          <Link href="/commissions" className={styles.contactSocial}>Commissions →</Link>
          <Link href="/contact" className={styles.contactSocial}>Contact form →</Link>
        </div>
      </section>

    </div>
  )
}
