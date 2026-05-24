'use client'
import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/shopify/products'
import { useProduct } from '@/contexts/ProductContext'
import AddToCartButton from '@/components/AddToCartButton'
import BackInStock from '@/components/BackInStock'
import styles from './ProductOptions.module.css'

const LOW_STOCK_THRESHOLD = 5

interface Variant {
  id: string
  title: string
  price: string
  availableForSale: boolean
  inventoryQuantity?: number | null
}

interface Props {
  variants: Variant[]
  handle?: string
  productTitle?: string
}

export default function ProductOptions({ variants, handle, productTitle }: Props) {
  const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0]
  const [selected, setSelected] = useState<Variant>(firstAvailable)
  const { setSelected: publishSelected } = useProduct()

  // Publish initial selection to context for StickyATC
  useEffect(() => {
    publishSelected(firstAvailable.id, formatPrice(firstAvailable.price))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function selectVariant(v: Variant) {
    if (!v.availableForSale) return
    setSelected(v)
    publishSelected(v.id, formatPrice(v.price))
  }

  const isLowStock =
    selected.availableForSale &&
    selected.inventoryQuantity != null &&
    selected.inventoryQuantity > 0 &&
    selected.inventoryQuantity <= LOW_STOCK_THRESHOLD

  const allSoldOut = variants.every((v) => !v.availableForSale)

  if (variants.length === 1) {
    const v = variants[0]
    return (
      <div className={styles.wrapper}>
        {isLowStock && (
          <p className={styles.lowStock}>Only {selected.inventoryQuantity} left</p>
        )}
        {v.availableForSale ? (
          <AddToCartButton variantId={v.id} price={formatPrice(v.price)} available />
        ) : (
          <>
            <AddToCartButton variantId={v.id} price={formatPrice(v.price)} available={false} />
            {handle && <BackInStock handle={handle} title={productTitle ?? ''} />}
          </>
        )}
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.variantLabel}>Options</p>
      <div className={styles.variantList}>
        {variants.map((v) => (
          <button
            key={v.id}
            className={[
              styles.variantBtn,
              selected.id === v.id ? styles.variantSelected : '',
              !v.availableForSale ? styles.variantSoldOut : '',
            ].filter(Boolean).join(' ')}
            onClick={() => selectVariant(v)}
            disabled={!v.availableForSale}
            aria-pressed={selected.id === v.id}
            aria-label={`${v.title}${!v.availableForSale ? ' — sold out' : ''}`}
          >
            {v.title}
            {!v.availableForSale && (
              <span className={styles.soldOutBadge}>Sold out</span>
            )}
          </button>
        ))}
      </div>

      {isLowStock && (
        <p className={styles.lowStock}>Only {selected.inventoryQuantity} left in this size</p>
      )}

      {selected.availableForSale ? (
        <AddToCartButton variantId={selected.id} price={formatPrice(selected.price)} available />
      ) : (
        <>
          <AddToCartButton variantId={selected.id} price={formatPrice(selected.price)} available={false} />
          {allSoldOut && handle && (
            <BackInStock handle={handle} title={productTitle ?? ''} variantTitle={selected.title} />
          )}
        </>
      )}
    </div>
  )
}
