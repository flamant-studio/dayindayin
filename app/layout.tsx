import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
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
  authors: [{ name: 'Stine Weirsøe Flamant' }],
  creator: 'Stine Weirsøe Flamant',
  metadataBase: new URL('https://dayindayin.dk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'Day In Day In',
    locale: 'en_US',
    type: 'website',
    url: 'https://dayindayin.dk',
    images: [
      {
        url: 'https://29kekabbrd49avje.public.blob.vercel-storage.com/lifestyle/ls-01.jpg',
        width: 1200,
        height: 800,
        alt: 'Art made by hand — Day In Day In',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dayindayin',
    images: ['https://29kekabbrd49avje.public.blob.vercel-storage.com/lifestyle/ls-01.jpg'],
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Day In Day In',
  url: 'https://dayindayin.dk',
  description: 'Art prints and original works by Copenhagen artist Stine Weirsøe Flamant.',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://dayindayin.dk/search?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="theme-color" content="#F0EBE3" />
        <meta name="color-scheme" content="light" />
        <meta name="robots" content="max-image-preview:large" />
        <link rel="preconnect" href="https://29kekabbrd49avje.public.blob.vercel-storage.com" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <CartProvider>
          <ScrollToTop />
          <Nav />
          <CartDrawer />
          <main id="main-content">{children}</main>
          <Footer />
          <CookieBanner />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  )
}
