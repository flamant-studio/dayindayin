'use client'
import { useState, FormEvent } from 'react'
import styles from './NewsletterSignup.module.css'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim() || loading) return
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
        setError(j.error ?? 'Something went wrong. Please try again.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Stay in the loop</h2>
        <p className={styles.sub}>New works, studio updates, and occasional thoughts from Stine.</p>

        {submitted ? (
          <p className={styles.success}>Thank you — we&#39;ll be in touch.</p>
        ) : (
          <>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <input
                type="email"
                className={styles.input}
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
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
