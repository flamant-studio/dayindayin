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
    'Art made by hand in Copenhagen. Original tufted textiles, embroidery, paintings, and photography by Stine Weirsøe Flamant. Prints from 56 kr, shipped across Europe by Gelato.',
  metadataBase: new URL('https://dayindayin.dk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'Day In Day In',
    locale: 'en_US',
    type: 'website',
    url: 'https://dayindayin.dk',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dayindayin',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="theme-color" content="#F0EBE3" />
        <link rel="preconnect" href="https://29kekabbrd49avje.public.blob.vercel-storage.com" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <CartProvider>
          <ScrollToTop />
          <Nav />
          <CartDrawer />
          <main id="main-content">{children}</main>
          <Footer />
          <BackToTopButton />
          <CookieBanner />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  )
}
