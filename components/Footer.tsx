import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>Day In Day In</span>
          <p className={styles.tagline}>
            Art made by hand in Copenhagen.<br />
            Originals on enquiry. Prints shipped across Europe.
          </p>
          <div className={styles.social}>
            <a
              href="https://www.instagram.com/dayindayin"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Day In Day In on Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Instagram
            </a>
          </div>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <span className={styles.colTitle}>Shop</span>
            <Link href="/shop">All products</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/shop?filter=art-print">Art Prints</Link>
            <Link href="/shop?filter=framed">Framed Prints</Link>
            <Link href="/shop?filter=poster">Posters</Link>
            <Link href="/shop?filter=mug">Mugs</Link>
            <Link href="/shop?filter=postcard">Postcards</Link>
            <Link href="/saved">Saved</Link>
          </div>
          <div className={styles.col}>
            <span className={styles.colTitle}>Artist</span>
            <Link href="/about">About Stine</Link>
            <Link href="/fine-art">Fine Art</Link>
            <Link href="/archive">All Works</Link>
            <Link href="/art-journal">Studio Notes</Link>
            <Link href="/commissions">Commissions</Link>
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
