'use client'
import { useState, FormEvent } from 'react'
import styles from './NewsletterSignup.module.css'

interface Props {
  variant?: 'full' | 'minimal'
}

export default function NewsletterSignup({ variant = 'full' }: Props) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim() || loading) return
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!emailValid) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j.error ?? 'Could not subscribe that address. Try again.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'minimal') {
    return (
      <div className={styles.minimal}>
        {submitted ? (
          <p className={styles.minimalSuccess}>Subscribed ✓</p>
        ) : (
          <>
            <form className={styles.minimalForm} onSubmit={handleSubmit} noValidate aria-label="Subscribe to studio newsletter">
              <input
                type="email"
                className={styles.minimalInput}
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
                disabled={loading}
              />
              <button type="submit" className={styles.minimalBtn} disabled={loading} aria-label="Subscribe">
                {loading ? '…' : 'Subscribe'}
              </button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
          </>
        )}
      </div>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>From the studio — direct.</h2>
        <p className={styles.sub} id="newsletter-desc">When something finishes, something ships, or something&apos;s worth writing about. Stine sends it herself. No algorithm, no schedule.</p>

        {submitted ? (
          <p className={styles.success}>You&apos;re in. Stine will be in touch from the studio — when something finishes, not on a schedule.</p>
        ) : (
          <>
            <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Subscribe to studio newsletter">
              <input
                type="email"
                className={styles.input}
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
                aria-describedby="newsletter-desc"
                disabled={loading}
              />
              <button type="submit" className={styles.btn} disabled={loading}>
                {loading ? '…' : 'Subscribe'}
              </button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
          </>
        )}
      </div>
    </section>
  )
}
