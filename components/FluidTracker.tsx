'use client'

/**
 * FluidTracker — fires behavioural events to /api/track.
 * Drop into any page. Fires page_view on mount always.
 * Pass productData to also fire product_view.
 * Pass collectionHandle to fire collection_view.
 * Pass searchQuery to fire search.
 */
import { useEffect } from 'react'

interface ProductData {
  handle: string
  price: string
  productType: string
  tags?: string[]
}

interface Props {
  productData?: ProductData
  collectionHandle?: string
  searchQuery?: string
}

function getSessionId(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)diy_sid=([^;]+)/)
  return match ? match[1] : null
}

function track(sessionId: string, events: { type: string; data: Record<string, unknown> }[]) {
  const consent = document.cookie.match(/(?:^|;\s*)diy_consent=([^;]+)/)
  if (consent?.[1] === 'declined') return
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, events }),
    keepalive: true,
  }).catch(() => { /* silent fail */ })
}

export default function FluidTracker({ productData, collectionHandle, searchQuery }: Props) {
  useEffect(() => {
    // Wait briefly for middleware cookie to be set on first load
    const run = () => {
      const sessionId = getSessionId()
      if (!sessionId) return

      const events: { type: string; data: Record<string, unknown> }[] = []

      events.push({ type: 'page_view', data: { url: window.location.pathname } })

      if (productData) {
        events.push({
          type: 'product_view',
          data: {
            handle: productData.handle,
            price: productData.price,
            productType: productData.productType,
            tags: productData.tags ?? [],
            url: window.location.pathname,
          },
        })
      }

      if (collectionHandle) {
        events.push({
          type: 'collection_view',
          data: { handle: collectionHandle, url: window.location.pathname },
        })
      }

      if (searchQuery) {
        events.push({
          type: 'search',
          data: { query: searchQuery, url: window.location.pathname },
        })
      }

      track(sessionId, events)
    }

    // Small delay to ensure middleware has set diy_sid cookie
    const timer = setTimeout(run, 500)
    return () => clearTimeout(timer)
  }, [productData?.handle, collectionHandle, searchQuery])

  return null
}

// Standalone fire-and-forget helper for use in event handlers
export function trackEvent(type: string, data: Record<string, unknown>) {
  const sessionId = getSessionId()
  if (!sessionId) return
  track(sessionId, [{ type, data }])
}
