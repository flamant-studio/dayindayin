'use client'
import { createContext, useContext, useState } from 'react'

interface ProductContextValue {
  selectedVariantId: string | null
  selectedPrice: string | null
  setSelected: (variantId: string, price: string) => void
}

const ProductContext = createContext<ProductContextValue>({
  selectedVariantId: null,
  selectedPrice: null,
  setSelected: () => {},
})

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)

  return (
    <ProductContext.Provider value={{
      selectedVariantId,
      selectedPrice,
      setSelected: (id, price) => { setSelectedVariantId(id); setSelectedPrice(price) },
    }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  return useContext(ProductContext)
}
