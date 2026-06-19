import type { MetadataRoute } from 'next'
import { getAllProductHandles } from '@/lib/shopify/products'
import { works, blogPosts } from '@/lib/data'

const BASE = 'https://dayindayin.dk'

const FILTER_TAGS = [
  'art-print', 'framed', 'poster', 'mug', 'apparel', 'tote',
  'greeting-card', 'postcard', 'water-bottle', 'wood-print',
  'shero', 'neko', 'sea-monsters', 'botanical', 'floral', 'faces', 'sommerby',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/collections`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/fine-art`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/archive`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/art-journal`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/practical`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/commissions`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
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

  // Dynamic product pages from Shopify (paginated — handles all 300+ products)
  let productPages: MetadataRoute.Sitemap = []
  try {
    const handles = await getAllProductHandles()
    productPages = handles.map((handle) => ({
      url: `${BASE}/shop/${handle}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Shopify unavailable — skip product pages
  }

  // Works pages (fine art originals)
  const workPages: MetadataRoute.Sitemap = works.map((w) => ({
    url: `${BASE}/works/${w.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Blog post pages (Studio Notes)
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...filterPages, ...productPages, ...workPages, ...blogPages]
}
