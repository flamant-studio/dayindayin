import Link from 'next/link'
import NewsletterSignup from './NewsletterSignup'
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
          <NewsletterSignup variant="minimal" />
          <div className={styles.social}>
            <a
              href="https://www.instagram.com/dayindayin_art"
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
            <Link href="/motifs">Shop by Motif</Link>
            <Link href="/shop?filter=art-print">Art Prints</Link>
            <Link href="/shop?filter=framed">Framed Prints</Link>
            <Link href="/shop?filter=poster">Posters</Link>
            <Link href="/shop?filter=mug">Mugs</Link>
            <Link href="/shop?filter=tote">Tote Bags</Link>
            <Link href="/shop?filter=apparel">Apparel</Link>
            <Link href="/shop?filter=postcard">Postcards</Link>
            <Link href="/shop?filter=greeting-card">Greeting Cards</Link>
            <Link href="/shop?filter=wood-print">Wood Prints</Link>
            <Link href="/shop?filter=water-bottle">Water Bottles</Link>
            <Link href="/saved">Saved</Link>
          </div>
          <div className={styles.col}>
            <span className={styles.colTitle}>Artist</span>
            <Link href="/about">About Stine</Link>
            <Link href="/fine-art">Fine Art</Link>
            <Link href="/fine-art?view=grid">All Works</Link>
            {/* Studio Notes disabled 2026-07-11 — no live copy yet, see app/_art-journal */}
            <Link href="/commissions">Commissions</Link>
          </div>
          <div className={styles.col}>
            <span className={styles.colTitle}>Info</span>
            <Link href="/practical">Shipping &amp; FAQ</Link>
            <Link href="/commissions">Commissions</Link>
            <Link href="/contact">Contact</Link>
            <a href="mailto:hello@dayindayin.dk" className={styles.emailLink}>hello@dayindayin.dk</a>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/copyright">Copyright</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>
          © {new Date().getFullYear()} Stine Weirsøe Flamant · Ships to EU, UK &amp; Norway · Secure checkout via Shopify · Printed by <a href="https://gelato.com" target="_blank" rel="noopener noreferrer">Gelato</a>
        </span>
        <a href="/sitemap.xml" className={styles.sitemapLink}>Sitemap</a>
      </div>
    </footer>
  )
}
