'use client'
import { useState } from 'react'
import styles from './ContactForm.module.css'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      website: (form.elements.namedItem('website') as HTMLInputElement).value,
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setStatus(res.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return <p className={styles.success}>Thank you — I&apos;ll be in touch soon.</p>
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} />

      <input type="text" name="name" placeholder="Name" required disabled={status === 'submitting'} />
      <input type="email" name="email" placeholder="Email" required disabled={status === 'submitting'} />
      <textarea name="message" placeholder="Message" rows={5} required disabled={status === 'submitting'} />

      {status === 'error' && (
        <p className={styles.error}>Something went wrong — please try again.</p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
