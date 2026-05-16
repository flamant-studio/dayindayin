import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>Day In Day In</span>
          <p className={styles.tagline}>
            Art prints by Stine Weirsøe Flamant.<br />
            Printed by Gelato. Ships to EU, UK &amp; Norway.
          </p>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <span className={styles.colTitle}>Shop</span>
            <Link href="/shop">All products</Link>
            <Link href="/shop/collections/tufted-works">Tufted Works</Link>
            <Link href="/shop/collections/embroidery">Embroidery</Link>
            <Link href="/shop/collections/paintings">Paintings</Link>
            <Link href="/shop/collections/photography">Photography</Link>
            <Link href="/shop/collections/archive">Archive</Link>
          </div>
          <div className={styles.col}>
            <span className={styles.colTitle}>Artist</span>
            <Link href="/about">About Stine</Link>
            <Link href="/fine-art">Fine Art</Link>
            <Link href="/art-journal">Art Journal</Link>
          </div>
          <div className={styles.col}>
            <span className={styles.colTitle}>Info</span>
            <Link href="/practical">Shipping &amp; FAQ</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/copyright">Copyright</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Stine Weirsøe Flamant. All rights reserved.</span>
        <span className={styles.gelato}>Printed by <a href="https://gelato.com" target="_blank" rel="noopener noreferrer">Gelato</a></span>
      </div>
    </footer>
  )
}
