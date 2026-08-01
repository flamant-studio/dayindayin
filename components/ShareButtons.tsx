'use client'
import { useState } from 'react'
import styles from './ShareButtons.module.css'

interface Props {
  url: string
}

export default function ShareButtons({ url }: Props) {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={styles.row}>
      <span className={styles.label}>Share</span>
      <button className={styles.btn} onClick={copyLink} aria-label="Copy link to clipboard">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}
