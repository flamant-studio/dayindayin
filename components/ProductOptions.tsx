'use client'
import { useState } from 'react'
import { formatPrice } from '@/lib/shopify/products'
import AddToCartButton from '@/components/AddToCartButton'
import styles from './ProductOptions.module.css'

interface Variant {
  id: string
  title: string
  price: string
  availableForSale: boolean
}

interface Props {
  variants: Variant[]
}

export default function ProductOptions({ variants }: Props) {
  const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0]
  const [selected, setSelected] = useState<Variant>(firstAvailable)

  if (variants.length === 1) {
    const v = variants[0]
    return (
      <AddToCartButton
        variantId={v.id}
        price={formatPrice(v.price)}
        available={v.availableForSale}
      />
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
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => v.availableForSale && setSelected(v)}
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
      <AddToCartButton
        variantId={selected.id}
        price={formatPrice(selected.price)}
        available={selected.availableForSale}
      />
    </div>
  )
}
