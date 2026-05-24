'use client'
import { useState, FormEvent } from 'react'
import styles from './NewsletterSignup.module.css'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Stay in the loop</h2>
        <p className={styles.sub}>New works, studio updates, and occasional thoughts from Stine.</p>

        {submitted ? (
          <p className={styles.success}>Thank you — we&#39;ll be in touch.</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              className={styles.input}
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address"
            />
            <button type="submit" className={styles.btn}>
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
