import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Stine Weirsøe Flamant. Questions about prints, commissions, or wholesale.',
}

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contact</h1>
          <p className={styles.sub}>
            Questions about an order, commissions, or something else — use the form below.
            I read everything and respond within a few days.
          </p>
        </div>

        <div className={styles.cols}>
          <div className={styles.formCol}>
            <ContactForm />
          </div>

          <div className={styles.infoCol}>
            <div className={styles.infoBlock}>
              <h2 className={styles.infoHeading}>Commissions</h2>
              <p className={styles.infoText}>
                Stine takes commissions selectively. Embroidery, tufting, painting.
                Be specific — tell her the size, the context, and your budget.
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
          </div>
        </div>
      </div>
    </div>
  )
}
