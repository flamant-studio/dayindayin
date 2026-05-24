'use client'
import { useState } from 'react'
import styles from './BackInStock.module.css'

interface Props {
  handle: string
  title: string
  variantTitle?: string
}

type Status = 'idle' | 'submitting' | 'done' | 'error'

export default function BackInStock({ handle, title, variantTitle }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, handle, title, variantTitle }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return <p className={styles.success}>We&apos;ll email you when it&apos;s back in stock.</p>
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Notify me when available</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          className={styles.input}
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'submitting'}
          aria-label="Email for back-in-stock notification"
        />
        <button type="submit" className={styles.btn} disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Notify me'}
        </button>
      </form>
      {status === 'error' && <p className={styles.error}>Something went wrong. Try again.</p>}
    </div>
  )
}
