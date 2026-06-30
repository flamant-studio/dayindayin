'use client'
import { useState, useCallback } from 'react'

/**
 * Shared lightbox controller for galleries. Owns the open index + wrap-around
 * prev/next so each gallery layout doesn't re-implement it. The two galleries
 * (ImageGallery = PDP hero+thumbs, WorksGallery = editorial mosaic) stay
 * separate on purpose — see DESIGN_SYSTEM.md › Galleries.
 */
export function useLightbox(length: number) {
  const [index, setIndex] = useState<number | null>(null)
  const open = useCallback((i: number) => setIndex(i), [])
  const close = useCallback(() => setIndex(null), [])
  const prev = useCallback(
    () => setIndex((i) => (i === null ? 0 : (i - 1 + length) % length)),
    [length],
  )
  const next = useCallback(
    () => setIndex((i) => (i === null ? 0 : (i + 1) % length)),
    [length],
  )
  return { index, open, close, prev, next, isOpen: index !== null }
}
