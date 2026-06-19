import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Commissions',
  description: 'Commission an original work from Stine Weirsøe Flamant — embroidery, hand tufting, or painting. Direct, selective, honest about timelines.',
  alternates: { canonical: '/commissions' },
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
          <li>
            <strong>Send a brief.</strong> Be specific: size, context, what it&apos;s for, your budget. Stine reads everything and responds honestly — she&apos;ll say yes, no, or let&apos;s talk.
          </li>
          <li>
            <strong>Short conversation.</strong> If the project feels right, you&apos;ll exchange a few messages to align on scope. No lengthy back-and-forth.
          </li>
          <li>
            <strong>50% deposit to start.</strong> Work begins when the deposit is in. You&apos;ll see progress photos at key milestones.
          </li>
          <li>
            <strong>Delivery &amp; final payment.</strong> Balance due on completion. Shipping across Europe included; outside Europe at cost.
          </li>
        </ol>
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
