import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import BackToTopButton from '@/components/BackToTopButton'
import { CartProvider } from '@/components/CartProvider'
import CartDrawer from '@/components/CartDrawer'
import CookieBanner from '@/components/CookieBanner'
import Analytics from '@/components/Analytics'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Day In Day In — Art Prints by Stine Weirsøe Flamant',
    template: '%s — Day In Day In',
  },
  description:
    'Art prints, canvases, and wall hangings. Original works by Copenhagen artist Stine Weirsøe Flamant. Printed by Gelato. Ships to EU, UK, and Norway.',
  metadataBase: new URL('https://dayindayin.dk'),
  openGraph: {
    siteName: 'Day In Day In',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          <ScrollToTop />
          <Nav />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
          <BackToTopButton />
          <CookieBanner />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  )
}
