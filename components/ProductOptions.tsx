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

// Normalize Gelato-generated variant titles to clean display labels
function normalizeTitle(title: string): string {
  let t = title
  // Strip " - Vertical" / " - Horizontal" orientation suffix
  t = t.replace(/\s*-\s*(Vertical|Horizontal)$/i, '').trim()
  // "21x29.7 cm / 8x12"" → "A4"
  t = t.replace(/21[×x]29\.7\s*cm\s*\/\s*8[×x]12[""″].*/i, 'A4')
  // "15x20 cm / 6x8"" → "A5"
  t = t.replace(/15[×x]20\s*cm\s*\/\s*6[×x]8[""″].*/i, 'A5')
  // "A3 (29.7 x 42  cm)" / "A2 (42 x 59.4  cm)" → "A3" / "A2"
  t = t.replace(/^(A\d+)\s*\(.*\)$/, '$1')
  // Tank top / apparel: "White - XL - DTG (Direct-to-garment)" → "XL"
  const sizeMatch = t.match(/\b(XS|S|M|L|XL|2XL|3XL|XXL)\b/)
  if (sizeMatch && t.toLowerCase().includes('dtg')) return sizeMatch[1]
  // Mug: "Ceramic White / Design Option 1" → "White · A"
  //      "Ceramic Black / Design Option 2" → "Black · B"
  const mugMatch = t.match(/Ceramic\s+(White|Black)\s*\/\s*Design Option\s*(\d+)/i)
  if (mugMatch) return `${mugMatch[1]} · ${mugMatch[2] === '1' ? 'A' : 'B'}`
  return t
}

interface Parsed { sizeKey: string; sizeDisplay: string; frameColor: string }
interface MugParsed { color: string; design: string }

function parseMug(title: string): MugParsed | null {
  const m = title.match(/Ceramic\s+(White|Black)\s*\/\s*Design Option\s*(\d+)/i)
  if (!m) return null
  return { color: m[1], design: m[2] === '1' ? 'A' : 'B' }
}

function isMugLayout(variants: Variant[]): boolean {
  return variants.length === 4 && variants.every(v => parseMug(v.title) !== null)
}

function parseFramed(title: string): Parsed | null {
  const t = normalizeTitle(title)
  const m = t.match(/^(A\d[^/]*?)\s*\/\s*(White|Wood|Black)\s+frame/i)
  if (!m) return null
  const sizeDisplay = m[1].trim()
  const sizeKey = sizeDisplay.match(/^(A\d)/)?.[1] ?? sizeDisplay
  return { sizeKey, sizeDisplay, frameColor: m[2] }
}

const SIZE_ORDER  = ['A4', 'A3', 'A2', 'A1']
const FRAME_ORDER = ['White', 'Wood', 'Black']
const FRAME_SWATCH: Record<string, string> = {
  White: '#F5F5F0',
  Wood:  '#C4A87A',
  Black: '#1A1A1A',
}
const FRAME_SWATCH_BORDER: Record<string, string> = {
  White: '#CCCCCC',
  Wood:  '#C4A87A',
  Black: '#1A1A1A',
}

function isFramedLayout(variants: Variant[]): boolean {
  return variants.length >= 4 && variants.every(v => parseFramed(v.title) !== null)
}

export default function ProductOptions({ variants, handle, productTitle }: Props) {
  const { setSelected: publishSelected } = useProduct()

  const isMug = isMugLayout(variants)
  const isFramed = !isMug && isFramedLayout(variants)

  const parsedVariants = isFramed
    ? variants.map(v => ({ ...v, parsed: parseFramed(v.title)! }))
    : null

  const sizes = parsedVariants
    ? [...new Set(parsedVariants.map(v => v.parsed.sizeKey))]
        .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))
    : []

  const frames = parsedVariants
    ? [...new Set(parsedVariants.map(v => v.parsed.frameColor))]
        .sort((a, b) => FRAME_ORDER.indexOf(a) - FRAME_ORDER.indexOf(b))
    : []

  const firstAvailableParsed = parsedVariants?.find(v => v.availableForSale) ?? parsedVariants?.[0]
  const firstAvailable = variants.find(v => v.availableForSale) ?? variants[0]

  const mugVariants = isMug ? variants.map(v => ({ ...v, mug: parseMug(v.title)! })) : null
  const mugFirstAvailable = mugVariants?.find(v => v.availableForSale) ?? mugVariants?.[0]

  const [selected, setSelected]       = useState<Variant>(firstAvailable)
  const [selectedSize, setSelectedSize]   = useState<string>(firstAvailableParsed?.parsed.sizeKey ?? sizes[0] ?? '')
  const [selectedFrame, setSelectedFrame] = useState<string>(firstAvailableParsed?.parsed.frameColor ?? frames[0] ?? '')
  const [selectedMugColor, setSelectedMugColor] = useState<string>(mugFirstAvailable?.mug.color ?? 'White')
  const [selectedMugDesign, setSelectedMugDesign] = useState<string>(mugFirstAvailable?.mug.design ?? 'A')

  useEffect(() => {
    publishSelected(firstAvailable.id, formatPrice(firstAvailable.price))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pickSize(size: string) {
    setSelectedSize(size)
    const matched = parsedVariants?.find(v => v.parsed.sizeKey === size && v.parsed.frameColor === selectedFrame)
    if (matched) { setSelected(matched); publishSelected(matched.id, formatPrice(matched.price)) }
  }

  function pickFrame(frame: string) {
    setSelectedFrame(frame)
    const matched = parsedVariants?.find(v => v.parsed.sizeKey === selectedSize && v.parsed.frameColor === frame)
    if (matched) { setSelected(matched); publishSelected(matched.id, formatPrice(matched.price)) }
  }

  function selectVariant(v: Variant) {
    if (!v.availableForSale) return
    setSelected(v)
    publishSelected(v.id, formatPrice(v.price))
  }

  function pickMugColor(color: string) {
    setSelectedMugColor(color)
    const matched = mugVariants?.find(v => v.mug.color === color && v.mug.design === selectedMugDesign)
    if (matched && matched.availableForSale) { setSelected(matched); publishSelected(matched.id, formatPrice(matched.price)) }
  }

  function pickMugDesign(design: string) {
    setSelectedMugDesign(design)
    const matched = mugVariants?.find(v => v.mug.color === selectedMugColor && v.mug.design === design)
    if (matched && matched.availableForSale) { setSelected(matched); publishSelected(matched.id, formatPrice(matched.price)) }
  }

  const isLowStock =
    selected.availableForSale &&
    selected.inventoryQuantity != null &&
    selected.inventoryQuantity > 0 &&
    selected.inventoryQuantity <= LOW_STOCK_THRESHOLD

  const allSoldOut = variants.every(v => !v.availableForSale)

  // Single variant — show no selector
  if (variants.length === 1) {
    const v = variants[0]
    return (
      <div className={styles.wrapper}>
        {isLowStock && <p className={styles.lowStock}>Only {selected.inventoryQuantity} left</p>}
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

  // 2D picker for mugs (color × design side)
  if (isMug && mugVariants) {
    const mugColors = ['White', 'Black']
    const mugDesigns = ['A', 'B']
    return (
      <div className={styles.wrapper}>
        <div className={styles.selectorGroup}>
          <p className={styles.selectorLabel}>
            Color <span className={styles.selectorValue}>{selectedMugColor}</span>
          </p>
          <div className={styles.selectorRow}>
            {mugColors.map(color => {
              const hasAvailable = mugVariants.some(v => v.mug.color === color && v.availableForSale)
              return (
                <button
                  key={color}
                  className={[
                    styles.selectorBtn,
                    selectedMugColor === color ? styles.selectorSelected : '',
                    !hasAvailable ? styles.variantSoldOut : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => hasAvailable && pickMugColor(color)}
                  disabled={!hasAvailable}
                  aria-pressed={selectedMugColor === color}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.selectorGroup}>
          <p className={styles.selectorLabel}>
            Design <span className={styles.selectorValue}>{selectedMugDesign === 'A' ? 'Side A' : 'Side B'}</span>
          </p>
          <div className={styles.selectorRow}>
            {mugDesigns.map(design => {
              const hasAvailable = mugVariants.some(v => v.mug.color === selectedMugColor && v.mug.design === design && v.availableForSale)
              return (
                <button
                  key={design}
                  className={[
                    styles.selectorBtn,
                    selectedMugDesign === design ? styles.selectorSelected : '',
                    !hasAvailable ? styles.variantSoldOut : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => hasAvailable && pickMugDesign(design)}
                  disabled={!hasAvailable}
                  aria-pressed={selectedMugDesign === design}
                >
                  {design === 'A' ? 'Side A' : 'Side B'}
                </button>
              )
            })}
          </div>
        </div>

        {isLowStock && <p className={styles.lowStock}>Only {selected.inventoryQuantity} left</p>}
        {selected.availableForSale ? (
          <AddToCartButton variantId={selected.id} price={formatPrice(selected.price)} available />
        ) : (
          <>
            <AddToCartButton variantId={selected.id} price={formatPrice(selected.price)} available={false} />
            {handle && <BackInStock handle={handle} title={productTitle ?? ''} variantTitle={selected.title} />}
          </>
        )}
      </div>
    )
  }

  // 2D picker for framed prints (size × frame color)
  if (isFramed && parsedVariants) {
    const selectedSizeDisplay = parsedVariants.find(v => v.parsed.sizeKey === selectedSize)?.parsed.sizeDisplay ?? selectedSize

    return (
      <div className={styles.wrapper}>
        <div className={styles.selectorGroup}>
          <p className={styles.selectorLabel}>
            Size <span className={styles.selectorValue}>{selectedSizeDisplay}</span>
          </p>
          <div className={styles.selectorRow}>
            {sizes.map(size => {
              const hasAvailable = parsedVariants.some(v => v.parsed.sizeKey === size && v.availableForSale)
              return (
                <button
                  key={size}
                  className={[
                    styles.selectorBtn,
                    selectedSize === size ? styles.selectorSelected : '',
                    !hasAvailable ? styles.variantSoldOut : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => hasAvailable && pickSize(size)}
                  disabled={!hasAvailable}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.selectorGroup}>
          <p className={styles.selectorLabel}>
            Frame <span className={styles.selectorValue}>{selectedFrame}</span>
          </p>
          <div className={styles.selectorRow}>
            {frames.map(frame => {
              const hasAvailable = parsedVariants.some(v => v.parsed.frameColor === frame && v.availableForSale)
              const isSelected = selectedFrame === frame
              return (
                <button
                  key={frame}
                  className={[
                    styles.frameSelectorBtn,
                    isSelected ? styles.selectorSelected : '',
                    !hasAvailable ? styles.variantSoldOut : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => hasAvailable && pickFrame(frame)}
                  disabled={!hasAvailable}
                  aria-pressed={isSelected}
                >
                  <span
                    className={styles.frameSwatch}
                    style={{
                      background: FRAME_SWATCH[frame],
                      borderColor: isSelected ? 'var(--c-white)' : FRAME_SWATCH_BORDER[frame],
                    }}
                  />
                  {frame}
                </button>
              )
            })}
          </div>
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

  // Flat list for all other variant types
  const CLOTHING_SIZES = new Set(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'XXL', 'XXXL'])
  const allAreSizes = variants.every(v => CLOTHING_SIZES.has(normalizeTitle(v.title)))
  const variantGroupLabel = allAreSizes ? 'Size' : 'Options'

  return (
    <div className={styles.wrapper}>
      <p className={styles.variantLabel}>{variantGroupLabel}</p>
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
          >
            {normalizeTitle(v.title)}
            {!v.availableForSale && <span className={styles.soldOutBadge}>Sold out</span>}
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
