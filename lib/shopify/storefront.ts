// lib/shopify/storefront.ts
// Storefront API client — safe for client-side, used for cart operations.
// Requires SHOPIFY_STOREFRONT_TOKEN in env (create in Shopify admin → Apps → Develop apps).

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN ?? ''
const API_VERSION = '2025-01'

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(
    `https://${DOMAIN}/api/${API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error(`Storefront API: ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(`Storefront GraphQL: ${JSON.stringify(json.errors)}`)
  return json.data as T
}

// Cart types
export interface CartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: { amount: string; currencyCode: string }
    product: {
      id: string
      title: string
      handle: string
      images: { edges: { node: { url: string; altText: string | null } }[] }
    }
  }
}

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    totalAmount: { amount: string; currencyCode: string }
    subtotalAmount: { amount: string; currencyCode: string }
  }
  lines: { edges: { node: CartLine }[] }
}

const CART_FRAGMENT = `
  id checkoutUrl totalQuantity
  cost {
    totalAmount { amount currencyCode }
    subtotalAmount { amount currencyCode }
  }
  lines(first: 100) {
    edges { node {
      id quantity
      merchandise {
        ... on ProductVariant {
          id title
          price { amount currencyCode }
          product {
            id title handle
            images(first: 1) { edges { node { url altText } } }
          }
        }
      }
    }}
  }
`

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await storefrontFetch<{ cartCreate: { cart: Cart } }>(
    `mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) { cart { ${CART_FRAGMENT} } }
    }`,
    { input: { lines } }
  )
  return data.cartCreate.cart
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await storefrontFetch<{ cartLinesAdd: { cart: Cart } }>(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FRAGMENT} } }
    }`,
    { cartId, lines }
  )
  return data.cartLinesAdd.cart
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await storefrontFetch<{ cartLinesRemove: { cart: Cart } }>(
    `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FRAGMENT} } }
    }`,
    { cartId, lineIds }
  )
  return data.cartLinesRemove.cart
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefrontFetch<{ cart: Cart | null }>(
    `query GetCart($cartId: ID!) {
      cart(id: $cartId) { ${CART_FRAGMENT} }
    }`,
    { cartId }
  )
  return data.cart
}

export function normalizeCart(cart: Cart) {
  return {
    ...cart,
    lines: cart.lines.edges.map((e) => e.node),
    totalAmount: cart.cost.totalAmount,
  }
}

export type NormalizedCart = ReturnType<typeof normalizeCart>
