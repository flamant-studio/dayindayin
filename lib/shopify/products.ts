// Shopify product fetching via Storefront API (static token, no OAuth needed)

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!
const API_VERSION = '2025-01'

async function sfFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate: number | false = 300
): Promise<T> {
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    ...(revalidate === false ? { cache: 'no-store' } : { next: { revalidate } }),
  })

  if (!res.ok) throw new Error(`Storefront API error: ${res.status} ${res.statusText}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(`Storefront GraphQL: ${JSON.stringify(json.errors)}`)
  return json.data as T
}

// Raw Storefront API types (internal)
interface SfMoney { amount: string; currencyCode: string }
interface SfImage { url: string; altText: string | null; width?: number; height?: number }

interface SfVariant {
  id: string
  title: string
  price: SfMoney
  availableForSale: boolean
  quantityAvailable: number | null
  image: { url: string; altText: string | null } | null
}

interface SfProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  productType: string
  tags: string[]
  vendor: string
  priceRange: { minVariantPrice: SfMoney; maxVariantPrice: SfMoney }
  images: { edges: { node: SfImage }[] }
  variants: { edges: { node: SfVariant }[] }
}

// Public types — kept identical so the rest of the app compiles unchanged
export interface ShopifyMoney { amount: string; currencyCode: string }

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
  inventoryQuantity: number | null
  featuredImage: { url: string; altText: string | null } | null
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

// Map Storefront response → ShopifyProduct shape used throughout the app
function toShopifyProduct(p: SfProduct): ShopifyProduct {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    productType: p.productType,
    tags: p.tags,
    vendor: p.vendor,
    status: 'ACTIVE',
    priceRangeV2: p.priceRange,
    images: p.images,
    variants: {
      edges: p.variants.edges.map((e) => ({
        node: {
          id: e.node.id,
          title: e.node.title,
          price: e.node.price.amount,
          availableForSale: e.node.availableForSale,
          inventoryQuantity: e.node.quantityAvailable ?? null,
          featuredImage: e.node.image ?? null,
        },
      })),
    },
  }
}

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

export function formatPriceLabel(product: Pick<NormalizedProduct, 'priceRangeV2'>): string {
  const min = parseFloat(product.priceRangeV2.minVariantPrice.amount)
  const max = parseFloat(product.priceRangeV2.maxVariantPrice.amount)
  const base = formatPrice(product.priceRangeV2.minVariantPrice.amount)
  return min < max ? `From ${base}` : base
}

export function checkoutUrl(variantGid: string, quantity = 1): string {
  const numericId = variantGid.split('/').pop()!
  return `https://${process.env.SHOPIFY_STORE_DOMAIN}/cart/${numericId}:${quantity}`
}

const PRODUCT_FIELDS = `
  id handle title description descriptionHtml
  productType tags vendor
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  images(first: 8) { edges { node { url altText width height } } }
  variants(first: 20) { edges { node {
    id title availableForSale
    price { amount currencyCode }
    quantityAvailable
    image { url altText }
  } } }
`

type ProductsPage = {
  products: {
    edges: { node: SfProduct }[]
    pageInfo: { hasNextPage: boolean; endCursor: string }
  }
}

type HandlesPage = {
  products: {
    edges: { node: { handle: string } }[]
    pageInfo: { hasNextPage: boolean; endCursor: string }
  }
}

export async function getAllProductHandles(): Promise<string[]> {
  const handles: string[] = []
  let cursor: string | null = null
  while (true) {
    const page: HandlesPage = await sfFetch<HandlesPage>(
      `query GetHandles($first: Int!, $after: String) {
        products(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
          edges { node { handle } }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { first: 250, after: cursor },
      3600
    )
    handles.push(...page.products.edges.map((e) => e.node.handle))
    if (!page.products.pageInfo.hasNextPage) break
    cursor = page.products.pageInfo.endCursor
  }
  return handles
}

export async function getProducts(first = 96): Promise<NormalizedProduct[]> {
  const data = await sfFetch<{ products: { edges: { node: SfProduct }[] } }>(
    `query GetProducts($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }`,
    { first }
  )
  return data.products.edges.map((e) => normalizeProduct(toShopifyProduct(e.node)))
}

export async function getAllProducts(): Promise<NormalizedProduct[]> {
  const all: NormalizedProduct[] = []
  let cursor: string | null = null
  while (true) {
    const page: ProductsPage = await sfFetch<ProductsPage>(
      `query GetAllProducts($first: Int!, $after: String) {
        products(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
          edges { node { ${PRODUCT_FIELDS} } }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { first: 250, after: cursor }
    )
    all.push(...page.products.edges.map((e) => normalizeProduct(toShopifyProduct(e.node))))
    if (!page.products.pageInfo.hasNextPage) break
    cursor = page.products.pageInfo.endCursor
  }
  return all
}

export async function getAllProductsByTag(tag: string): Promise<NormalizedProduct[]> {
  const all: NormalizedProduct[] = []
  let cursor: string | null = null
  while (true) {
    const page: ProductsPage = await sfFetch<ProductsPage>(
      `query GetAllProductsByTag($q: String!, $first: Int!, $after: String) {
        products(first: $first, after: $after, query: $q, sortKey: CREATED_AT, reverse: true) {
          edges { node { ${PRODUCT_FIELDS} } }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { q: `tag:${tag}`, first: 250, after: cursor }
    )
    all.push(...page.products.edges.map((e) => normalizeProduct(toShopifyProduct(e.node))))
    if (!page.products.pageInfo.hasNextPage) break
    cursor = page.products.pageInfo.endCursor
  }
  return all
}

export async function getProductsByTag(tag: string, first = 96): Promise<NormalizedProduct[]> {
  const data = await sfFetch<{ products: { edges: { node: SfProduct }[] } }>(
    `query GetProductsByTag($q: String!, $first: Int!) {
      products(first: $first, query: $q, sortKey: CREATED_AT, reverse: true) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }`,
    { q: `tag:${tag}`, first }
  )
  return data.products.edges.map((e) => normalizeProduct(toShopifyProduct(e.node)))
}

export async function getProductsByTitleKeyword(keyword: string, first = 20): Promise<NormalizedProduct[]> {
  const data = await sfFetch<{ products: { edges: { node: SfProduct }[] } }>(
    `query GetProductsByTitle($q: String!, $first: Int!) {
      products(first: $first, query: $q, sortKey: CREATED_AT, reverse: true) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }`,
    { q: `title:*${keyword}*`, first }
  )
  return data.products.edges.map((e) => normalizeProduct(toShopifyProduct(e.node)))
}

export async function getProductsByType(productType: string, excludeHandle: string, first = 4): Promise<NormalizedProduct[]> {
  const data = await sfFetch<{ products: { edges: { node: SfProduct }[] } }>(
    `query GetProductsByType($q: String!, $first: Int!) {
      products(first: $first, query: $q, sortKey: CREATED_AT, reverse: true) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }`,
    { q: `product_type:${productType} NOT handle:${excludeHandle}`, first }
  )
  return data.products.edges.map((e) => normalizeProduct(toShopifyProduct(e.node)))
}

export async function getProductByHandle(handle: string): Promise<NormalizedProduct | null> {
  const data = await sfFetch<{ product: SfProduct | null }>(
    `query GetProductByHandle($handle: String!) {
      product(handle: $handle) { ${PRODUCT_FIELDS} }
    }`,
    { handle },
    false
  )
  return data.product ? normalizeProduct(toShopifyProduct(data.product)) : null
}

export const SERIES_TAGS: Record<string, string> = {
  shero:          'SHERO',
  neko:           'NEKO',
  'sea-monsters': 'Sea Monsters',
  botanical:      'Botanical',
  floral:         'Floral',
  masks:          'Masks',
  tourism:        'Tourism',
}

const TITLE_SERIES: Array<[RegExp, string]> = [
  [/\bshero\b/i, 'SHERO'],
  [/\bneko\b/i, 'NEKO'],
  [/sea[\s-]monster/i, 'Sea Monsters'],
  [/botanical/i, 'Botanical'],
  [/floral/i, 'Floral'],
  [/\bmasks?\b|\bfaces?\b/i, 'Masks'],
  [/\btourism\b/i, 'Tourism'],
]

export function seriesLabel(product: Pick<NormalizedProduct, 'tags' | 'title'>): string | null {
  for (const tag of product.tags) {
    const label = SERIES_TAGS[tag.toLowerCase()]
    if (label) return label
  }
  for (const [pattern, label] of TITLE_SERIES) {
    if (pattern.test(product.title)) return label
  }
  return null
}

const TAG_CATEGORY: Record<string, string> = {
  tufting:         'Tufted Work',
  embroidery:      'Embroidery',
  framed:          'Framed Print',
  mug:             'Mug',
  postcard:        'Postcard',
  poster:          'Poster',
  apparel:         'Apparel',
  photography:     'Photo Print',
  'greeting-card': 'Greeting Card',
  tote:            'Tote Bag',
  'water-bottle':  'Water Bottle',
  'wood-print':    'Wood Print',
}

const ARTWORK_LABELS = new Set([
  'Art Print', 'Framed Print', 'Poster', 'Postcard', 'Greeting Card', 'Wood Print', 'Photo Print',
])

export function isArtworkProduct(product: NormalizedProduct): boolean {
  return ARTWORK_LABELS.has(categoryLabel(product))
}

export function categoryLabel(product: Pick<NormalizedProduct, 'tags' | 'title'>): string {
  for (const tag of product.tags) {
    const label = TAG_CATEGORY[tag.toLowerCase()]
    if (label) return label
  }
  const t = product.title.toLowerCase()
  if (t.includes('tote bag') || t.includes('tote')) return 'Tote Bag'
  if (t.includes('greeting card')) return 'Greeting Card'
  if (t.includes('postcard')) return 'Postcard'
  if (t.includes('framed print')) return 'Framed Print'
  if (t.includes('wood print')) return 'Wood Print'
  if (t.includes('poster')) return 'Poster'
  if (t.includes('mug')) return 'Mug'
  if (t.includes('tank top') || t.includes('apparel')) return 'Apparel'
  if (t.includes('water bottle')) return 'Water Bottle'
  if (t.includes('fine art print') || t.includes('art print')) return 'Art Print'
  return 'Art Print'
}

const FALLBACK_DESC: Partial<Record<string, string>> = {
  'Art Print':     'Giclée art print on premium 200 gsm paper. Printed to order by Gelato and shipped within 3–7 business days.',
  'Framed Print':  'Art print in your choice of frame (black, white, or wood). Available in A4, A3, A2, and A1. Printed to order by Gelato.',
  'Poster':        'Semi-glossy poster print on 200 gsm coated paper. Available in A1, A2, and A3. Ships in 3–7 business days.',
  'Mug':           'Ceramic mug with full-colour print. Dishwasher safe. Available in white and black, with two artwork arrangements.',
  'Tote Bag':      'Natural canvas tote bag with bold full-colour print. Strong handles, generous size — made for everyday use.',
  'Apparel':       'Tank top with all-over print. Unisex fit, available in sizes XS through 2XL.',
  'Postcard':      'Pack of 10 art postcards, A6 size, printed on 350 gsm coated paper. Perfect for gifting or sending.',
  'Greeting Card': 'Pack of 10 folded greeting cards, A6 size. Premium 350 gsm paper with glossy protection. Blank inside.',
  'Water Bottle':  '17oz stainless steel water bottle with all-over print. White exterior, insulated double-wall construction.',
  'Wood Print':    '200×200mm art print on natural birch plywood. A unique and tactile way to display Stine\'s work.',
  'Photo Print':   'Fine art photo print on premium paper. Printed to order by Gelato.',
  'Tufted Work':   'Original tufted textile work by Stine Weirsøe Flamant. One of a kind — enquire for availability.',
  'Embroidery':    'Original embroidery by Stine Weirsøe Flamant. One of a kind — enquire for availability.',
}

export function fallbackDescription(product: NormalizedProduct): string {
  const cat = categoryLabel(product)
  const base = FALLBACK_DESC[cat] ?? 'Art by Stine Weirsøe Flamant. Printed to order and shipped across Europe.'
  return base
}
