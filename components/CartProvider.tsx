'use client'
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type { NormalizedCart } from '@/lib/shopify/storefront'

interface CartContextValue {
  cart: NormalizedCart | null
  count: number
  open: boolean
  loading: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (variantId: string, quantity?: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<NormalizedCart | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    fetch('/api/cart')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.cart) setCart(data.cart) })
      .catch(() => {})
  }, [])

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    setLoading(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchandiseId: variantId, quantity }),
      })
      const data = await res.json()
      if (data?.cart) {
        setCart(data.cart)
        setOpen(true)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const removeItem = useCallback(async (lineId: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId }),
      })
      const data = await res.json()
      if (data?.cart) setCart(data.cart)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    setLoading(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId, quantity }),
      })
      const data = await res.json()
      if (data?.cart) setCart(data.cart)
    } finally {
      setLoading(false)
    }
  }, [])

  const count = cart?.totalQuantity ?? 0

  return (
    <CartContext.Provider value={{
      cart, count, open, loading,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addItem, removeItem, updateItem,
    }}>
      {children}
    </CartContext.Provider>
  )
}
