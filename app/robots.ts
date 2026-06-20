import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/saved', '/order-confirmed', '/search', '/preview-a', '/preview-b', '/preview-c'] },
    sitemap: 'https://dayindayin.dk/sitemap.xml',
  }
}
