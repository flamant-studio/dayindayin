import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Commissions',
  description: 'Commission an original work from Stine Weirsøe Flamant — embroidery, hand tufting, or painting. Direct, selective, honest about timelines.',
  alternates: { canonical: '/commissions' },
  openGraph: {
    title: 'Commissions — Day In Day In',
    description: 'Commission an original work from Stine Weirsøe Flamant. Embroidery, hand tufting, or painting. 4–10 week lead times. You speak directly with Stine.',
    images: [{ url: 'https://29kekabbrd49avje.public.blob.vercel-storage.com/works/embroidery/elsk.jpg', width: 800, height: 800 }],
  },
}

const TYPES = [
  {
    id: 'embroidery',
    label: 'Embroidery',
    desc: 'Needle and thread on canvas or linen. Sizes from small (30×30cm) to large-format panels. Best for portraits, text-based work, botanical subjects.',
    timeline: '4–8 weeks',
  },
  {
    id: 'tufting',
    label: 'Hand Tufting',
    desc: "Wool on monk’s cloth. Wall-hung or floor pieces. Dense, textural, colourful. Minimum size around 50×50cm. Best for bold, graphic motifs.",
    timeline: '6–10 weeks',
  },
  {
    id: 'painting',
    label: 'Painting',
    desc: 'Acrylic and oil stick on canvas. Floor-worked, layered, physical. Tends toward abstraction — Stine does not paint photorealistic commissions.',
    timeline: '4–8 weeks',
  },
]

export default function CommissionsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.heroLabel}>Original Work</span>
        <h1>Commissions</h1>
        <p className={styles.heroSub}>
          Stine takes commissions selectively — when she has the space for it and the brief is interesting. No middlemen. You speak directly with her.
        </p>
      </section>

      <section className={styles.types}>
        {TYPES.map((t) => (
          <div key={t.id} className={styles.typeCard}>
            <div className={styles.typeHeader}>
              <span className={styles.typeLabel}>{t.label}</span>
              <span className={styles.typeTimeline}>{t.timeline}</span>
            </div>
            <p className={styles.typeDesc}>{t.desc}</p>
          </div>
        ))}
      </section>

      <section className={styles.how}>
        <h2>How it works</h2>
        <ol className={styles.steps}>
          {[
            { label: 'Send a brief.', desc: 'Be specific: size, context, what it\'s for, your budget. Stine reads everything and responds honestly — she\'ll say yes, no, or let\'s talk.' },
            { label: 'Short conversation.', desc: 'If the project feels right, you\'ll exchange a few messages to align on scope. No lengthy back-and-forth.' },
            { label: '50% deposit to start.', desc: 'Work begins when the deposit is in. You\'ll see progress photos at key milestones.' },
            { label: 'Delivery & final payment.', desc: 'Balance due on completion. Shipping across Europe included; outside Europe at cost.' },
          ].map((step) => (
            <li key={step.label} className={styles.step}>
              <span className={styles.stepNum} />
              <span className={styles.stepBody}><strong>{step.label}</strong> {step.desc}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.pricing}>
        <h2>Indicative pricing</h2>
        <p className={styles.pricingNote}>
          Commission pricing depends on size, medium, and complexity. These are starting points — not maximums. Stine will give you a quote after you send a brief.
        </p>
        <div className={styles.priceCards}>
          {[
            { medium: 'Embroidery', range: '2,500–8,000 kr', note: 'Small canvas to large-format panel' },
            { medium: 'Hand Tufting', range: '4,000–15,000 kr', note: 'Floor or wall piece, 50×50cm and up' },
            { medium: 'Painting', range: '3,000–12,000 kr', note: 'Acrylic and oil stick on canvas' },
          ].map(({ medium, range, note }) => (
            <div key={medium} className={styles.priceCard}>
              <span className={styles.priceCardMedium}>{medium}</span>
              <span className={styles.priceCardRange}>{range}</span>
              <span className={styles.priceCardNote}>{note}</span>
            </div>
          ))}
        </div>
        <p className={styles.pricingNote}>
          All prices exclude shipping. International shipping of large originals is quoted separately. A 50% deposit is required to start; balance due on completion.
        </p>
      </section>

      <section className={styles.honest}>
        <h2>Honest about constraints</h2>
        <p>
          Stine doesn&apos;t do copies or near-copies of existing work. She doesn&apos;t reproduce photographs realistically — that&apos;s not her medium. She does do subjects from her practice: people, plants, animals, text, abstraction.
        </p>
        <p>
          If your timeline is tight, ask — sometimes the workload allows it, sometimes it doesn&apos;t. If she can&apos;t take it on right now, she&apos;ll tell you.
        </p>
      </section>

      <section className={styles.originals}>
        <p className={styles.originalsText}>
          If you want to see what Stine&apos;s work looks like before reaching out,{' '}
          <Link href="/fine-art">the fine art section</Link> has the full archive of originals —
          tufted works, embroidery, paintings, and photography.
        </p>
      </section>

      <section className={styles.cta}>
        <p className={styles.ctaText}>Got something in mind? Reach out.</p>
        <Link href="/contact?subject=Commission%20enquiry" className={styles.ctaBtn}>
          Send a brief →
        </Link>
        <p className={styles.ctaSub}>
          Or email <a href="mailto:stine@dayindayin.dk">stine@dayindayin.dk</a> directly.
        </p>
      </section>
    </div>
  )
}
