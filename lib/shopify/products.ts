import { adminFetch } from './client'

export interface ShopifyMoney {
  amount: string
  currencyCode: string
}

export interface ShopifyImage {
  url: string
  altText: string | null
  width?: number
  height?: number
}

export interface ShopifyVariant {
  id: string
  title: string
  price: string
  availableForSale: boolean
}

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  productType: string
  tags: string[]
  vendor: string
  status: string
  priceRangeV2: {
    minVariantPrice: ShopifyMoney
    maxVariantPrice: ShopifyMoney
  }
  images: { edges: { node: ShopifyImage }[] }
  variants: { edges: { node: ShopifyVariant }[] }
}

const PRODUCT_FIELDS = `
  id handle title description descriptionHtml
  productType tags vendor status
  priceRangeV2 {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  images(first: 8) { edges { node { url altText width height } } }
  variants(first: 20) { edges { node { id title price availableForSale } } }
`

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function sanitizeAlt(altText: string | null): string | null {
  if (!altText || UUID_RE.test(altText.trim())) return null
  return altText
}

export function normalizeProduct(p: ShopifyProduct) {
  return {
    ...p,
    images: p.images.edges.map((e) => ({
      ...e.node,
      altText: sanitizeAlt(e.node.altText),
    })),
    variants: p.variants.edges.map((e) => e.node),
    firstImage: p.images.edges[0]?.node
      ? { ...p.images.edges[0].node, altText: sanitizeAlt(p.images.edges[0].node.altText) }
      : null,
    firstVariant: p.variants.edges[0]?.node ?? null,
    minPrice: p.priceRangeV2.minVariantPrice,
  }
}

export type NormalizedProduct = ReturnType<typeof normalizeProduct>

export function formatPrice(amount: string): string {
  return `${Math.round(parseFloat(amount))} kr`
}

export function checkoutUrl(variantGid: string, quantity = 1): string {
  const numericId = variantGid.split('/').pop()!
  return `https://${process.env.SHOPIFY_STORE_DOMAIN}/cart/${numericId}:${quantity}`
}

export async function getProducts(first = 96): Promise<NormalizedProduct[]> {
  const data = await adminFetch<{
    products: { edges: { node: ShopifyProduct }[] }
  }>({
    query: `
      query GetProducts($first: Int!) {
        products(first: $first, query: "status:active", sortKey: CREATED_AT, reverse: true) {
          edges { node { ${PRODUCT_FIELDS} } }
        }
      }
    `,
    variables: { first },
  })
  return data.products.edges
    .map((e) => normalizeProduct(e.node))
    .filter((p) => p.status === 'ACTIVE')
}

export async function getProductsByTag(tag: string, first = 96): Promise<NormalizedProduct[]> {
  const data = await adminFetch<{
    products: { edges: { node: ShopifyProduct }[] }
  }>({
    query: `
      query GetProductsByTag($q: String!, $first: Int!) {
        products(first: $first, query: $q, sortKey: CREATED_AT, reverse: true) {
          edges { node { ${PRODUCT_FIELDS} } }
        }
      }
    `,
    variables: { q: `tag:${tag} AND status:active`, first },
    revalidate: 300,
  })
  return data.products.edges
    .map((e) => normalizeProduct(e.node))
    .filter((p) => p.status === 'ACTIVE')
}

export async function getProductsByType(productType: string, excludeHandle: string, first = 4): Promise<NormalizedProduct[]> {
  const data = await adminFetch<{
    products: { edges: { node: ShopifyProduct }[] }
  }>({
    query: `
      query GetProductsByType($q: String!, $first: Int!) {
        products(first: $first, query: $q, sortKey: CREATED_AT, reverse: true) {
          edges { node { ${PRODUCT_FIELDS} } }
        }
      }
    `,
    variables: { q: `product_type:${productType} AND status:active NOT handle:${excludeHandle}`, first },
    revalidate: 300,
  })
  return data.products.edges
    .map((e) => normalizeProduct(e.node))
    .filter((p) => p.status === 'ACTIVE')
}

export const SERIES_TAGS: Record<string, string> = {
  shero:          'SHERO',
  neko:           'NEKO',
  'sea-monsters': 'Sea Monsters',
  botanical:      'Botanical',
  floral:         'Floral',
  faces:          'Faces',
  sommerby:       'Sommerby',
}

export function seriesLabel(product: NormalizedProduct): string | null {
  for (const tag of product.tags) {
    const label = SERIES_TAGS[tag.toLowerCase()]
    if (label) return label
  }
  return null
}

// Specific category tags take priority — 'art-print' is intentionally absent
// so it falls through to the default, allowing specific tags found later in the
// tags array (e.g. 'tufting') to win.
const TAG_CATEGORY: Record<string, string> = {
  tufting: 'Tufted Works',
  embroidery: 'Embroidery',
  painting: 'Painting',
  photography: 'Photography',
  'greeting-card': 'Greeting Card',
  tote: 'Tote Bag',
}

export function categoryLabel(product: NormalizedProduct): string {
  for (const tag of product.tags) {
    const label = TAG_CATEGORY[tag.toLowerCase()]
    if (label) return label
  }
  const t = product.title.toLowerCase()
  if (t.includes('tote')) return 'Tote Bag'
  if (t.includes('greeting') || t.includes('card')) return 'Greeting Card'
  return 'Art Print'
}

export async function getProductByHandle(handle: string): Promise<NormalizedProduct | null> {
  const data = await adminFetch<{
    products: { edges: { node: ShopifyProduct }[] }
  }>({
    query: `
      query GetProductByHandle($q: String!) {
        products(first: 1, query: $q) {
          edges { node { ${PRODUCT_FIELDS} } }
        }
      }
    `,
    variables: { q: `handle:${handle} AND status:active` },
    revalidate: 300,
  })
  const node = data.products.edges[0]?.node
  return node ? normalizeProduct(node) : null
}
