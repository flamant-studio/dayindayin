'use client'
import { useState } from 'react'
import { useCart } from './CartProvider'
import styles from './QuickAddButton.module.css'

interface Props {
  merchandiseId: string
  title: string
}

export default function QuickAddButton({ merchandiseId, title }: Props) {
  const { addItem, loading } = useCart()
  const [added, setAdded] = useState(false)

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (loading || added) return
    await addItem(merchandiseId, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <>
      <button
        type="button"
        className={styles.btn}
        data-quick-add="true"
        onClick={handleClick}
        disabled={loading}
        aria-label={added ? `${title} added to cart` : `Add ${title} to cart`}
      >
        {added ? '✓ Added' : '+ Add to cart'}
      </button>
      <span aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {added ? `${title} added to cart` : ''}
      </span>
    </>
  )
}
