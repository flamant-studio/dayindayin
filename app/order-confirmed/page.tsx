import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Order confirmed',
  description: 'Your order has been placed.',
  robots: { index: false },
}

export default function OrderConfirmedPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.icon} aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h1 className={styles.title}>Order confirmed</h1>
        <p className={styles.body}>
          Thank you — your order is on its way. You&apos;ll receive a confirmation email shortly.
          Prints are fulfilled by Gelato and typically ship within 3–7 business days.
        </p>
        <p className={styles.body}>
          If you have any questions about your order, use the contact form below.
        </p>
        <div className={styles.actions}>
          <Link href="/shop" className={styles.primary}>Continue shopping</Link>
          <Link href="/contact" className={styles.secondary}>Contact us</Link>
        </div>
        <div className={styles.note}>
          <p className={styles.noteText}>
            No returns on print-on-demand unless the product arrives defective or damaged.
            In that case, reach out within 14 days with a photo of the issue.
          </p>
        </div>
      </div>
    </div>
  )
}
