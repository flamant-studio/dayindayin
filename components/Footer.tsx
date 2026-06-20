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
            <a
              href="https://www.pinterest.com/dayindayin"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Day In Day In on Pinterest"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
              Pinterest
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
            <Link href="/commissions">Commissions</Link>
            <Link href="/contact">Contact</Link>
            <a href="mailto:stine@dayindayin.dk" className={styles.emailLink}>stine@dayindayin.dk</a>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/copyright">Copyright</Link>
          </div>
        </div>
      </div>

      <div className={styles.trust}>
        <div className={styles.trustInner}>
          <span className={styles.trustItem}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            Ships to EU, UK &amp; Norway
          </span>
          <span className={styles.trustDot} aria-hidden="true" />
          <span className={styles.trustItem}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Secure checkout via Shopify
          </span>
          <span className={styles.trustDot} aria-hidden="true" />
          <span className={styles.trustItem}>Printed on demand by Gelato</span>
          <span className={styles.trustDot} aria-hidden="true" />
          <span className={styles.trustItem}>Art prints from 56 kr</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Stine Weirsøe Flamant · Flamant Tekst &amp; Design</span>
        <div className={styles.bottomRight}>
          <a href="/sitemap.xml" className={styles.sitemapLink}>Sitemap</a>
          <span className={styles.gelato}>Printed by <a href="https://gelato.com" target="_blank" rel="noopener noreferrer">Gelato</a></span>
        </div>
      </div>
    </footer>
  )
}
