import Image from 'next/image'
import Link from 'next/link'
import { works } from '@/lib/data'
import Button from '@/components/Button'
import styles from './page.module.css'

const BLOB_BASE = 'https://29kekabbrd49avje.public.blob.vercel-storage.com'

export const metadata = {
  title: 'About',
  description: 'Stine Weirsøe Flamant — contemporary artist, Copenhagen. Embroidery, tufting, photography, painting.',
  openGraph: {
    title: 'About Stine Weirsøe Flamant',
    description: 'Contemporary artist based in Copenhagen. Embroidery, hand tufting, painting, and photography — made by hand.',
    images: [{ url: 'https://29kekabbrd49avje.public.blob.vercel-storage.com/about/stine-portrait.jpg?v=2', width: 800, height: 1000 }],
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
  sameAs: ['https://www.instagram.com/dayindayin_art', 'https://dayindayin.dk'],
  image: 'https://29kekabbrd49avje.public.blob.vercel-storage.com/about/stine-portrait.jpg?v=2',
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
  sameAs: ['https://www.instagram.com/dayindayin_art'],
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

      {/* ── Brand mark ───────────────────────────────────────── */}
      <section className={styles.brandMark}>
        <div className={styles.brandMarkImg}>
          <Image
            src={`${BLOB_BASE}/about/brand-mark.jpg`}
            alt="The Day In Day In name, hand-lettered over a studio-blue backdrop with a decayed leaf, a dandelion seed head, and a torn fabric swatch — the original collage the site is named after"
            fill
            sizes="(max-width: 768px) 90vw, 480px"
            className={styles.brandMarkImgEl}
          />
        </div>
      </section>

      {/* ── Portrait + bio ────────────────────────────────────── */}
      <section className={styles.profile}>
        <div className={styles.portraitWrap}>
          <Image
            src={`${BLOB_BASE}/about/stine-portrait.jpg?v=2`}
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
            href="https://www.instagram.com/dayindayin_art"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instagramLink}
          >
            @dayindayin_art on Instagram →
          </a>
        </div>
      </section>

      {/* ── Process photos ───────────────────────────────────── */}
      <section className={styles.process}>
        <div className={styles.processImg}>
          <Image
            src={`${BLOB_BASE}/about/stine-embroidery.jpg?v=2`}
            alt="Detail of French-knot embroidery in blues and greens"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.processImgEl}
          />
        </div>
        <div className={styles.processImg}>
          <Image
            src={`${BLOB_BASE}/about/stine-embroidery-2.jpg?v=2`}
            alt="Detail of cut-pile tufting texture in warm tan and coral"
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
          <p>
            Photography is the quietest. Shot on location — Denmark, Sri Lanka, Copenhagen streets, summer houses.
            Stine photographs the moment before or after, the thing at the edge of frame.
            Most of the photography archive was shot on a single camera body over many years of travel and daily observation.
          </p>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────── */}
      <section className={styles.processNote}>
        <h2 className={styles.processNoteTitle}>Story</h2>
        <div className={styles.processNoteBody}>
          <p>
            Stine&apos;s journey as an artist began in Sweden, where she lived deep in the
            forest for the first year of her life. Born with no name — a true child of the
            early 1970s, from Danish parents who were both crafters, who had turned their
            backs on civilisation and chosen a free life.
          </p>
          <p>
            From those early days, Stine moved with her parents and siblings around Denmark.
            She has moved more than forty times throughout her life. A nomadic childhood that
            took her through most of Denmark, mainly the countryside. She climbed trees,
            fiercely explored nature, and butted heads with rural conformism at school. She
            evolved through adolescence as a challenger — with a keen sense for both the
            beauty of life and the ugliness of humans at their lowest.
          </p>
          <p>
            Through early adulthood, Stine established herself as a teacher and a mother. She
            was then struck by a series of herniated discs and chronic back pain that
            handicapped her severely. Despite this, she built lutterlagkage.dk — an online
            store selling children&apos;s clothes of her own design, produced by herself. She
            continued exploring the graphical realm, but it was only in her early forties
            that she took the real leap from craft work to art. That backdrop of craft and
            process understanding is visible throughout her entire body of work.
          </p>
          <p>
            Her early art centred on embroidery and painting, with themes of family, society
            and normativity.
          </p>
          <p>
            She moved on to tufted works, cementing a love affair with the tactility of
            fabric. Her tufted works revolve around mankind in the universe, nature in
            interpreted form, and sometimes slogans: POW, and the later-to-become iconic
            SHERO. These pieces are sensed and felt as much as they are seen.
          </p>
          <p>
            The Liebes Panopticon — a set of four distinct works — is the centrepiece of this
            period. A bold, time-consuming multi-part project emanating rays of colourful
            love from its centres.
          </p>
          <p>
            In this same period, Stine explored the gendered human in society, the criteria
            for social acceptance, and the freedom to stand out. This process gave birth to
            the iconic Neko Paw — a symbol of a fighting being. Through travels to Sri Lanka,
            she was inspired to create the Protective Masks series: a satirical knife to the
            woes of modern life, through items such as the Mask against Unsolicited Phone
            Calls or the Mask against Conformism.
          </p>
          <p>
            In recent years Stine has struggled with illness but has continued producing art.
            Her latest work is about the connectivity that binds everything together — the
            universe, the flora, the soil of the earth, the people and animals that share this
            planet. She has worked on ephemeral installations, mythological handcrafted
            artefacts, and digital works: florals, gardens, nature.
          </p>
          <p>
            Her current processes take her back to previous themes of nature, in bright and
            colourful palettes.
          </p>
        </div>
      </section>

      {/* ── Selected motifs ──────────────────────────────────── */}
      <section className={styles.processNote}>
        <h2 className={styles.processNoteTitle}>Selected motifs</h2>
        <div className={styles.processNoteBody}>
          <p>
            <strong>Neko Paw.</strong> A clenched paw, human and cat at once — a symbol of
            power and identity without gender or species. The original is black and white;
            later versions add colour.
          </p>
          <p>
            <strong>SHERO.</strong> A patch-style badge reading SHERO — feminist pop-art,
            first embroidered, now printed across formats.
          </p>
          <p>
            <strong>Masks.</strong> Inspired by mask traditions Stine encountered in Sri
            Lanka, reworked as a satirical set: a mask against unsolicited phone calls, one
            against conformism, one against indifference. Modern anxieties given a
            traditional form.
          </p>
        </div>
      </section>

      {/* ── Milestones ───────────────────────────────────────────
          Hidden per Sebastian, 2026-07-27 — timeline had unverified/wrong
          claims (e.g. the 2026 entry touted a "Sommerby" series that was
          already removed sitewide as not a real series). Revisit with
          real, confirmed dates before bringing this back.

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
            { year: '2026', text: 'Print shop expanded across 12 product types. 74 original works catalogued — tufting, embroidery, painting, and photography. New summer botanical series from Sommerby. Shop of Words text prints launched.' },
          ].map(({ year, text }) => (
            <li key={year} className={styles.milestone}>
              <span className={styles.milestoneYear}>{year}</span>
              <span className={styles.milestoneText}>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      */}

      {/* ── Browse by medium ─────────────────────────────────── */}
      <section className={styles.mediumLinks}>
        <h2 className={styles.mediumLinksTitle}>Browse the archive by medium</h2>
        <div className={styles.mediumLinksGrid}>
          {([
            { href: '/fine-art?view=grid&category=tufting',     label: 'Hand Tufting',  count: works.filter(w => w.category === 'tufting').length },
            { href: '/fine-art?view=grid&category=embroidery',  label: 'Embroidery',    count: works.filter(w => w.category === 'embroidery').length },
            { href: '/fine-art?view=grid&category=painting',    label: 'Painting',      count: works.filter(w => w.category === 'painting').length },
            { href: '/fine-art?view=grid&category=photography', label: 'Photography',   count: works.filter(w => w.category === 'photography').length },
            { href: '/fine-art?view=grid&category=mixed',        label: 'Mixed Media',   count: works.filter(w => w.category === 'mixed').length },
            { href: '/fine-art?view=grid&category=handhooking',  label: 'Handhooking',   count: works.filter(w => w.category === 'handhooking').length },
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
          <Button href="/fine-art" variant="link" arrow>Original works</Button>
          <Button href="/shop" variant="link" arrow>Browse the shop</Button>
        </div>
      </section>

      {/* ── Contact block ────────────────────────────────────── */}
      <section className={styles.contactBlock}>
        <h2 className={styles.contactBlockTitle}>Get in touch</h2>
        <p className={styles.contactBlockSub}>
          For commissions, press, or general enquiries — Sebastian answers first and
          brings Stine in directly when it&apos;s about her work.
        </p>
        <div className={styles.contactBlockLinks}>
          <a href="mailto:hello@dayindayin.dk" className={styles.contactEmail}>
            hello@dayindayin.dk
          </a>
          <a href="https://www.instagram.com/dayindayin_art" target="_blank" rel="noopener noreferrer" className={styles.contactSocial}>
            Instagram →
          </a>
          <Link href="/commissions" className={styles.contactSocial}>Commissions →</Link>
          <Link href="/contact" className={styles.contactSocial}>Contact form →</Link>
        </div>
      </section>

    </div>
  )
}
