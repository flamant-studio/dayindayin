'use client'

import { useEffect, useState } from 'react'
import styles from './ShoppingNudge.module.css'

const SESSION_KEY = 'diy_nudge'
const CACHE_TTL = 30 * 60 * 1000

export default function ShoppingNudge() {
  const [nudge, setNudge] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Check consent
    const consent = document.cookie.split(';').find((c) => c.trim().startsWith('diy_consent='))
    if (consent?.includes('declined')) return

    // Check sessionStorage cache
    try {
      const cached = sessionStorage.getItem(SESSION_KEY)
      if (cached) {
        const { text, at } = JSON.parse(cached) as { text: string; at: number }
        if (Date.now() - at < CACHE_TTL && text) {
          setNudge(text)
          setTimeout(() => setVisible(true), 1200)
          return
        }
      }
    } catch { /* ignore */ }

    fetch('/api/nudge')
      .then((r) => r.text())
      .then((text) => {
        if (!text.trim()) return
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify({ text, at: Date.now() }))
        } catch { /* ignore */ }
        setNudge(text)
        setTimeout(() => setVisible(true), 1200)
      })
      .catch(() => { /* silent fail */ })
  }, [])

  if (!nudge) return null

  return (
    <p className={`${styles.nudge} ${visible ? styles.visible : ''}`}>
      {nudge}
    </p>
  )
}
