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
  featuredImage?: { url: string; altText: string | null } | null
}

interface Props {
  variants: Variant[]
  handle?: string
  productTitle?: string
  productType?: string
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

interface Parsed { sizeKey: string; frameColor: string }
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
  let t = title
  // Strip orientation suffix: " - Vertical" / " - Horizontal" at end
  t = t.replace(/\s*-\s*(Vertical|Horizontal)$/i, '').trim()

  // Find frame color — accepts "Black frame", "Black" (new Shopify format), "- Black frame", "/ Black"
  const frameMatch = t.match(/\s*[-\/]\s*(White|Wood|Black)(\s+frame)?$/i)
  if (!frameMatch) return null
  const frameColor = frameMatch[1]
  const beforeFrame = t.slice(0, frameMatch.index!).trim()

  // Extract size from beforeFrame
  // A-notation: "A3 (29.7 x 42  cm)" or just "A3"
  const aSizeMatch = beforeFrame.match(/^(A[1-4])\b/)
  if (aSizeMatch) return { sizeKey: aSizeMatch[1], frameColor }

  // Metric dimensions → map to A size
  if (/21[×x]29\.?7/i.test(beforeFrame)) return { sizeKey: 'A4', frameColor }
  if (/29\.?7[×x]42/i.test(beforeFrame))  return { sizeKey: 'A3', frameColor }
  if (/42[×x]59\.?4/i.test(beforeFrame))  return { sizeKey: 'A2', frameColor }
  if (/59\.?4[×x]84/i.test(beforeFrame))  return { sizeKey: 'A1', frameColor }

  return null
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

export default function ProductOptions({ variants: variantsProp, handle, productTitle, productType }: Props) {
  const { setSelected: publishSelected } = useProduct()

  // A5 art prints are discontinued (Sebastian, 2026-07-25) — filtered here rather than
  // in Shopify so it's reversible with a one-line revert, no variant deletion needed.
  const variants = variantsProp.filter(v => normalizeTitle(v.title) !== 'A5')

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

  // Shopify's Storefront API falls back to the product's first image for any variant
  // that has no dedicated photo of its own — it does NOT return null like the Admin API
  // does. So "no real photo for this option" shows up as a URL shared by 2+ variants,
  // not as a missing image. Detect that instead of trusting featuredImage on its own.
  function hasSharedImage(group: { featuredImage?: { url: string } | null }[] | null, current: { featuredImage?: { url: string } | null }): boolean {
    if (!group || !current.featuredImage?.url) return false
    return group.filter(v => v.featuredImage?.url === current.featuredImage?.url).length > 1
  }

  const [selected, setSelected]       = useState<Variant>(firstAvailable)
  const [selectedSize, setSelectedSize]   = useState<string>(firstAvailableParsed?.parsed.sizeKey ?? sizes[0] ?? '')
  const [selectedFrame, setSelectedFrame] = useState<string>(firstAvailableParsed?.parsed.frameColor ?? frames[0] ?? '')
  const [selectedMugColor, setSelectedMugColor] = useState<string>(mugFirstAvailable?.mug.color ?? 'White')
  const [selectedMugDesign, setSelectedMugDesign] = useState<string>(mugFirstAvailable?.mug.design ?? 'A')

  useEffect(() => {
    publishSelected(firstAvailable.id, formatPrice(firstAvailable.price), firstAvailable.featuredImage?.url)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pickSize(size: string) {
    setSelectedSize(size)
    const matched = parsedVariants?.find(v => v.parsed.sizeKey === size && v.parsed.frameColor === selectedFrame)
    if (matched) { setSelected(matched); publishSelected(matched.id, formatPrice(matched.price), matched.featuredImage?.url) }
  }

  function pickFrame(frame: string) {
    setSelectedFrame(frame)
    const matched = parsedVariants?.find(v => v.parsed.sizeKey === selectedSize && v.parsed.frameColor === frame)
    if (matched) { setSelected(matched); publishSelected(matched.id, formatPrice(matched.price), matched.featuredImage?.url) }
  }

  function selectVariant(v: Variant) {
    if (!v.availableForSale) return
    setSelected(v)
    publishSelected(v.id, formatPrice(v.price), v.featuredImage?.url)
  }

  function pickMugColor(color: string) {
    setSelectedMugColor(color)
    // No design selector shown anymore — stick with whichever design variant was already
    // resolved as first-available for the previous color (see mugFirstAvailable above).
    const matched = mugVariants?.find(v => v.mug.color === color && v.mug.design === selectedMugDesign)
    if (matched && matched.availableForSale) { setSelected(matched); publishSelected(matched.id, formatPrice(matched.price), matched.featuredImage?.url) }
  }

  const isLowStock =
    selected.availableForSale &&
    selected.inventoryQuantity != null &&
    selected.inventoryQuantity > 0 &&
    selected.inventoryQuantity <= LOW_STOCK_THRESHOLD

  const allSoldOut = variants.every(v => !v.availableForSale)

  // Single variant — check if product should show size/option info (Gelato sync lag)
  if (variants.length === 1) {
    const v = variants[0]
    const isDefaultTitle = v.title === 'Default Title'
    const titleL = (productTitle ?? '').toLowerCase()
    const typeL = (productType ?? '').toLowerCase()

    // Determine expected sizes/options based on product type
    type SizeInfo = { sizes: string[]; frames?: string[] }
    let sizeInfo: SizeInfo | null = null
    if (isDefaultTitle) {
      if (titleL.includes('framed') || typeL.includes('framed')) {
        sizeInfo = { sizes: ['A4', 'A3', 'A2', 'A1'], frames: ['White', 'Wood', 'Black'] }
      } else if (titleL.includes('art print') || titleL.includes('fine art') || typeL === 'art print') {
        sizeInfo = { sizes: ['A4', 'A3', 'A2'] }
      } else if (titleL.includes('poster') || typeL === 'poster') {
        sizeInfo = { sizes: ['A3', 'A2', 'A1'] }
      } else if (titleL.includes('tank') || titleL.includes('apparel') || typeL === 'tank top' || typeL === 'apparel') {
        sizeInfo = { sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'] }
      } else if (titleL.includes('mug') || typeL === 'mug') {
        sizeInfo = { sizes: ['White', 'Black'], frames: ['Side A', 'Side B'] }
      }
    }

    return (
      <div className={styles.wrapper}>
        {isLowStock && <p className={styles.lowStock}>Only {selected.inventoryQuantity} left</p>}
        <div className={styles.atcWrap}>
          {v.availableForSale ? (
            <AddToCartButton variantId={v.id} price={formatPrice(v.price)} available />
          ) : (
            <>
              <AddToCartButton variantId={v.id} price={formatPrice(v.price)} available={false} />
              {handle && <BackInStock handle={handle} title={productTitle ?? ''} />}
            </>
          )}
        </div>
      </div>
    )
  }

  // Color picker for mugs. Design Option 1/2 ("Side A/B" in the old UI) was a print-area
  // choice (full wrap vs a small patch), not a mug side — Sebastian is removing the extra
  // option Gelato-side (2026-07-25). Frontend no longer shows a design selector at all;
  // whichever design variant is first-available per color (see mugFirstAvailable) is used.
  if (isMug && mugVariants) {
    const mugColors = ['White', 'Black']
    return (
      <div className={styles.wrapper}>
        <div className={styles.selectorGroup}>
          <p className={styles.selectorLabel}>Color</p>
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

        {isLowStock && <p className={styles.lowStock}>Only {selected.inventoryQuantity} left</p>}
        <div className={styles.atcWrap}>
          {selected.availableForSale ? (
            <AddToCartButton variantId={selected.id} price={formatPrice(selected.price)} available />
          ) : (
            <>
              <AddToCartButton variantId={selected.id} price={formatPrice(selected.price)} available={false} />
              {handle && <BackInStock handle={handle} title={productTitle ?? ''} variantTitle={selected.title} />}
            </>
          )}
        </div>
      </div>
    )
  }

  // 2D picker for framed prints (size × frame color)
  if (isFramed && parsedVariants) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.selectorGroup}>
          <p className={styles.selectorLabel}>Size</p>
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
          <p className={styles.selectorLabel}>Frame</p>
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

        {hasSharedImage(parsedVariants, selected) && (
          <p className={styles.sizeNote}>Photo shown is a reference — your selected size/frame will match at print.</p>
        )}

        {isLowStock && (
          <p className={styles.lowStock}>Only {selected.inventoryQuantity} left in this size</p>
        )}

        <div className={styles.atcWrap}>
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
      </div>
    )
  }

  // Flat list for all other variant types
  const CLOTHING_SIZES = new Set(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'XXL', 'XXXL'])
  const PAPER_SIZES = new Set(['A1', 'A2', 'A3', 'A4', 'A5'])
  const allAreSizes = variants.every(v => CLOTHING_SIZES.has(normalizeTitle(v.title)))
  const allArePaperSizes = variants.every(v => PAPER_SIZES.has(normalizeTitle(v.title)))
  const variantGroupLabel = allAreSizes ? 'Size' : allArePaperSizes ? 'Format' : 'Options'

  // Gelato's sync has left some products with 2 Shopify variants for the same size (old vs
  // new naming — "A3" and "A3 (29.7 x 42 cm)" both normalize to "A3"). Show one button per
  // normalized label, not one per underlying variant — prefer an in-stock one if there's a
  // choice, otherwise the first.
  const dedupedVariants = Array.from(
    variants.reduce((byLabel, v) => {
      const label = normalizeTitle(v.title)
      const existing = byLabel.get(label)
      if (!existing || (!existing.availableForSale && v.availableForSale)) byLabel.set(label, v)
      return byLabel
    }, new Map<string, Variant>()).values()
  )

  // 5+ options (e.g. XS-2XL) wrapped unevenly with auto-width buttons — a fixed 4-up grid
  // wraps as a clean second row instead. 2-4 options keep sharing the row equally.
  const isCompactWrap = dedupedVariants.length >= 5

  return (
    <div className={styles.wrapper}>
      <div className={styles.selectorGroup}>
        <p className={styles.variantLabel}>{variantGroupLabel}</p>
        <div className={[styles.variantList, isCompactWrap ? styles.variantListCompact : ''].filter(Boolean).join(' ')}>
          {dedupedVariants.map((v) => (
            <button
              key={v.id}
              className={[
                styles.variantBtn,
                isCompactWrap ? styles.variantBtnCompact : '',
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
      </div>

      {isLowStock && (
        <p className={styles.lowStock}>Only {selected.inventoryQuantity} left in this size</p>
      )}

      <div className={styles.atcWrap}>
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
    </div>
  )
}
