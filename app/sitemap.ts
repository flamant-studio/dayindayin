import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/shopify/products'

const BASE = 'https://dayindayin.dk'

const FILTER_TAGS = [
  'tufting', 'embroidery', 'painting', 'photography', 'tote', 'greeting-card',
  'shero', 'neko', 'sea-monsters', 'botanical', 'floral', 'faces', 'sommerby',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/fine-art`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/art-journal`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/archive`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/practical`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/legal/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/copyright`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Shop filter pages (type + series)
  const filterPages: MetadataRoute.Sitemap = FILTER_TAGS.map((tag) => ({
    url: `${BASE}/shop?filter=${tag}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Dynamic product pages from Shopify
  let productPages: MetadataRoute.Sitemap = []
  try {
    const products = await getProducts(250)
    productPages = products.map((p) => ({
      url: `${BASE}/shop/${p.handle}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Shopify unavailable — skip product pages
  }

  return [...staticPages, ...filterPages, ...productPages]
}
