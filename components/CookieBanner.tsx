'use client'
import { useState, useEffect } from 'react'
import styles from './CookieBanner.module.css'

const CONSENT_KEY = 'did_cookie_consent'

export default function CookieBanner() {
  const [accepted, setAccepted] = useState<boolean | null>(null)

  useEffect(() => {
    setAccepted(!!localStorage.getItem(CONSENT_KEY))
  }, [])

  function accept() {
    localStorage.setItem(CONSENT_KEY, '1')
    setAccepted(true)
  }

  // null = not yet checked (avoid hydration mismatch)
  if (accepted !== false) return null

  return (
    <div className={styles.banner} role="region" aria-label="Cookie consent">
      <p className={styles.text}>
        We use cookies for cart functionality. No tracking or advertising cookies.
      </p>
      <button className={styles.btn} onClick={accept}>
        Accept
      </button>
    </div>
  )
}
