'use client'
import Image from 'next/image'
import { useCart } from './CartProvider'
import styles from './CartDrawer.module.css'

function formatPrice(amount: string) {
  return `DKK ${parseFloat(amount).toFixed(0)}`
}

export default function CartDrawer() {
  const { cart, open, loading, closeCart, removeItem } = useCart()

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
            <p>Your cart is empty.</p>
            <button className={styles.continueShopping} onClick={closeCart}>Continue shopping</button>
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
