'use client'
import Link from 'next/link'
import { useEffect } from 'react'

export default function ShopError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div style={{ padding: '5rem 2rem', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
        Shop unavailable
      </h1>
      <p style={{ fontWeight: 300, lineHeight: 1.8, color: 'var(--c-muted)' }}>
        We couldn&apos;t load the shop right now — Shopify may be down or unreachable. Try refreshing.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={reset}
          style={{ padding: '0.75rem 2rem', background: 'var(--c-text)', color: 'var(--c-white)', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.06em', border: 'none', cursor: 'pointer' }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{ padding: '0.75rem 2rem', border: '1px solid var(--c-border)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--c-muted)' }}
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
