import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch about Stine Weirsøe Flamant\'s work. Questions about prints, commissions, or wholesale — answered by Sebastian first.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — Day In Day In',
    description: 'Get in touch about Stine Weirsøe Flamant\'s work. Questions about prints, commissions, or wholesale — answered by Sebastian first.',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contact</h1>
          <p className={styles.sub}>
            This site is run by Sebastian, Stine&apos;s husband. Send a question below —
            about an order, a commission, anything else — I read anything incoming and
            answer. Stine gets pulled in directly when it&apos;s about her work.
          </p>
          <a href="mailto:stine@dayindayin.dk" className={styles.directEmail}>
            stine@dayindayin.dk
          </a>
        </div>

        <div className={styles.cols}>
          <div className={styles.formCol}>
            <ContactForm />
          </div>

          <div className={styles.infoCol}>
            <div className={styles.infoBlock}>
              <h2 className={styles.infoHeading}>Commissions</h2>
              <p className={styles.infoText}>
                Stine takes commissions selectively — embroidery, tufting, painting.
                Send the size, the context, and your budget, and I&apos;ll pass it to her.
                Lead time is typically 4–10 weeks.
              </p>
            </div>
            <div className={styles.infoBlock}>
              <h2 className={styles.infoHeading}>Orders &amp; shipping</h2>
              <p className={styles.infoText}>
                All prints are fulfilled by Gelato — 3–7 business days to EU, UK, and Norway.
                For order issues, include your order number.
              </p>
            </div>
            <div className={styles.infoBlock}>
              <h2 className={styles.infoHeading}>Licensing</h2>
              <p className={styles.infoText}>
                Editorial, interior, product design. Reach out with what you have in mind,
                the specific work, and the territory and duration of use.
              </p>
            </div>
            <div className={styles.infoBlock}>
              <h2 className={styles.infoHeading}>Response time</h2>
              <p className={styles.infoText}>
                I read anything incoming. For urgent order issues, include your order number.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
