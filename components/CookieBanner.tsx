'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './CookieBanner.module.css'

const CONSENT_KEY = 'did_cookie_consent'

export default function CookieBanner() {
  const [decided, setDecided] = useState<boolean | null>(null)

  useEffect(() => {
    setDecided(!!localStorage.getItem(CONSENT_KEY))
  }, [])

  function decide(value: 'accept' | 'decline') {
    localStorage.setItem(CONSENT_KEY, value)
    setDecided(true)
  }

  // null = not yet checked (avoid hydration mismatch)
  if (decided !== false) return null

  return (
    <div className={styles.banner} role="region" aria-label="Cookie consent">
      <p className={styles.text}>
        We use cookies to keep your cart working. No tracking, no advertising cookies.{' '}
        <Link href="/legal/privacy" className={styles.learnMore}>Privacy policy →</Link>
      </p>
      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={() => decide('decline')}>
          Decline
        </button>
        <button className={styles.btn} onClick={() => decide('accept')}>
          Accept
        </button>
      </div>
    </div>
  )
}
