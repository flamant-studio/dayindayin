'use client'
import { useState, useEffect } from 'react'
import styles from './ContactForm.module.css'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const SUBJECTS = [
  'Commission enquiry',
  'Order question',
  'Fine Art / original work',
  'Wholesale / licensing',
  'Something else',
]

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [subject, setSubject] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const s = params.get('subject')
    if (s) {
      const decoded = decodeURIComponent(s).toLowerCase()
      if (decoded.startsWith('enquiry') || decoded.includes('fine art') || decoded.includes('original')) {
        setSubject('Fine Art / original work')
      } else {
        const match = SUBJECTS.find(opt => decoded.includes(opt.toLowerCase().split(' ')[0]))
        if (match) setSubject(match)
      }
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLSelectElement).value,
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

      <label className={styles.label}>
        <span className={styles.labelText}>Name</span>
        <input type="text" name="name" placeholder="Your name" required disabled={status === 'submitting'} aria-required="true" />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>Email</span>
        <input type="email" name="email" placeholder="your@email.com" required disabled={status === 'submitting'} aria-required="true" />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>Subject</span>
        <select
          name="subject"
          className={styles.select}
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
          disabled={status === 'submitting'}
          aria-required="true"
        >
          <option value="" disabled>What&apos;s this about?</option>
          {SUBJECTS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>Message</span>
        <textarea name="message" placeholder="What would you like to know?" rows={5} required disabled={status === 'submitting'} aria-required="true" maxLength={2000} />
      </label>

      {status === 'error' && (
        <p className={styles.error}>Message didn&apos;t send. Try again, or email hello@dayindayin.dk directly.</p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
