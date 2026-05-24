'use client'
import { useEffect, useState, useRef } from 'react'
import { useCart } from './CartProvider'
import { useProduct } from '@/contexts/ProductContext'
import styles from './StickyATC.module.css'

interface Props {
  title: string
  imageUrl: string | null
}

export default function StickyATC({ title, imageUrl }: Props) {
  const [visible, setVisible] = useState(false)
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle')
  const { addItem } = useCart()
  const { selectedVariantId, selectedPrice } = useProduct()

  useEffect(() => {
    const sentinel = document.getElementById('atc-sentinel')
    if (!sentinel) return
    const obs = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0, rootMargin: '-56px 0px 0px 0px' })
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [])

  async function handleAdd() {
    if (state !== 'idle' || !selectedVariantId) return
    setState('adding')
    try {
      await addItem(selectedVariantId)
      setState('added')
      setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('idle')
    }
  }

  return (
    <div className={`${styles.bar} ${visible ? styles.barVisible : ''}`} aria-hidden={!visible}>
      <div className={styles.inner}>
        <span className={styles.title}>{title}</span>
        {selectedPrice && <span className={styles.price}>{selectedPrice}</span>}
        <button
          className={`${styles.btn} ${state === 'added' ? styles.added : ''}`}
          onClick={handleAdd}
          disabled={state !== 'idle' || !selectedVariantId}
          aria-label={`Add ${title} to cart`}
        >
          {state === 'adding' && 'Adding…'}
          {state === 'added' && 'Added ✓'}
          {state === 'idle' && 'Add to cart'}
        </button>
      </div>
    </div>
  )
}
