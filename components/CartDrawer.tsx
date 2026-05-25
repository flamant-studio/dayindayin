'use client'
import Image from 'next/image'
import { useEffect } from 'react'
import { useCart } from './CartProvider'
import styles from './CartDrawer.module.css'

const FREE_SHIPPING_THRESHOLD = 500

function formatPrice(amount: string) {
  return `DKK ${parseFloat(amount).toFixed(0)}`
}

export default function CartDrawer() {
  const { cart, open, loading, closeCart, removeItem, updateItem } = useCart()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {open && <div className={styles.overlay} onClick={closeCart} />}
      <aside className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`} role="dialog" aria-modal={open} aria-label="Cart" aria-hidden={!open}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your cart</h2>
          <button className={styles.close} onClick={closeCart} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {(!cart || cart.lines.length === 0) ? (
          <div className={styles.empty}>
            <svg className={styles.emptyIcon} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <div className={styles.emptyText}>
              <p className={styles.emptyHeading}>Your basket is empty</p>
              <p className={styles.emptySubtext}>Discover original works by Stine Weirsøe Flamant</p>
            </div>
            <button className={styles.continueShopping} onClick={closeCart}>Browse the shop</button>
          </div>
        ) : (
          <>
            <ul className={styles.items}>
              {cart.lines.map((line) => {
                const img = line.merchandise.product.images.edges[0]?.node
                return (
                  <li key={line.id} className={styles.item}>
                    <div className={styles.itemImage}>
                      {img ? (
                        <Image src={img.url} alt={img.altText ?? line.merchandise.product.title} fill sizes="72px" style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className={styles.itemImagePlaceholder} />
                      )}
                    </div>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemTitle}>{line.merchandise.product.title}</p>
                      {line.merchandise.title !== 'Default Title' && (
                        <p className={styles.itemVariant}>{line.merchandise.title}</p>
                      )}
                      <p className={styles.itemPrice}>{formatPrice(line.merchandise.price.amount)}</p>
                      <div className={styles.qtyControls}>
                        <button
                          className={styles.qtyBtn}
                          disabled={loading}
                          aria-label="Decrease quantity"
                          onClick={() => {
                            if (line.quantity <= 1) {
                              removeItem(line.id)
                            } else {
                              updateItem(line.id, line.quantity - 1)
                            }
                          }}
                        >
                          −
                        </button>
                        <span className={styles.qtyValue}>{line.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          disabled={loading}
                          aria-label="Increase quantity"
                          onClick={() => updateItem(line.id, line.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(line.id)}
                      disabled={loading}
                      aria-label="Remove item"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className={styles.footer}>
              {(() => {
                const total = parseFloat(cart.totalAmount.amount)
                const remaining = FREE_SHIPPING_THRESHOLD - total
                const pct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)
                return (
                  <div className={styles.freeShipping}>
                    <div className={styles.freeShippingBar}>
                      <div className={styles.freeShippingFill} style={{ width: `${pct}%` }} />
                    </div>
                    <p className={styles.freeShippingText}>
                      {remaining > 0
                        ? <>Spend <strong>{Math.ceil(remaining)} kr</strong> more for free EU shipping</>
                        : <>You qualify for free shipping ✓</>}
                    </p>
                  </div>
                )
              })()}
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span>{formatPrice(cart.totalAmount.amount)}</span>
              </div>
              <p className={styles.taxNote}>Taxes and shipping calculated at checkout</p>
              <a
                href={cart.checkoutUrl}
                className={`${styles.checkoutBtn} ${loading ? styles.checkoutBtnLoading : ''}`}
              >
                Checkout
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
