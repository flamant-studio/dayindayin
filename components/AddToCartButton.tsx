'use client'
import { useState } from 'react'
import { useCart } from './CartProvider'
import styles from './AddToCartButton.module.css'

interface Props {
  variantId: string
  price: string
  available?: boolean
}

export default function AddToCartButton({ variantId, price, available = true }: Props) {
  const { addItem } = useCart()
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle')

  if (!available) {
    return <div className={styles.soldOut}>Currently sold out</div>
  }

  async function handleClick() {
    if (state !== 'idle') return
    setState('adding')
    try {
      await addItem(variantId)
      setState('added')
      setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('idle')
    }
  }

  return (
    <button
      className={`${styles.btn} ${state === 'added' ? styles.added : ''} ${state === 'adding' ? styles.adding : ''}`}
      onClick={handleClick}
      disabled={state !== 'idle'}
    >
      {state === 'adding' && 'Adding…'}
      {state === 'added' && 'Added to cart ✓'}
      {state === 'idle' && `Add to cart — ${price}`}
    </button>
  )
}
