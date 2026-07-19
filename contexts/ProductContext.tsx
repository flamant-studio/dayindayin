'use client'
import { createContext, useContext, useState } from 'react'

interface ProductContextValue {
  selectedVariantId: string | null
  selectedPrice: string | null
  selectedImage: string | null
  setSelected: (variantId: string, price: string, imageUrl?: string | null) => void
}

const ProductContext = createContext<ProductContextValue>({
  selectedVariantId: null,
  selectedPrice: null,
  selectedImage: null,
  setSelected: () => {},
})

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <ProductContext.Provider value={{
      selectedVariantId,
      selectedPrice,
      selectedImage,
      setSelected: (id, price, imageUrl) => {
        setSelectedVariantId(id)
        setSelectedPrice(price)
        // Always update, even to null — a variant without its own photo must fall back
        // to the base product image, not silently keep whatever was shown before it.
        setSelectedImage(imageUrl ?? null)
      },
    }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  return useContext(ProductContext)
}
