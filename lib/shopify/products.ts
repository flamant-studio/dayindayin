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

export function normalizeProduct(p: ShopifyProduct) {
  return {
    ...p,
    images: p.images.edges.map((e) => e.node),
    variants: p.variants.edges.map((e) => e.node),
    firstImage: p.images.edges[0]?.node ?? null,
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
        products(first: $first, sortKey: CREATED_AT, reverse: true) {
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
