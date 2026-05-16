/**
 * Gelato API client.
 * Reads GELATO_API_KEY from env. If not set, logs a warning and returns null/throws gracefully.
 * DO NOT call production endpoints unless Gelato is connected in Shopify admin.
 */

const GELATO_ORDER_BASE = 'https://order.gelatoapis.com/v4'
const GELATO_PRODUCT_BASE = 'https://product.gelatoapis.com/v3'

function getApiKey(): string | null {
  return process.env.GELATO_API_KEY ?? null
}

function headers(apiKey: string) {
  return {
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json',
  }
}

export class GelatoNotConfiguredError extends Error {
  constructor() {
    super('GELATO_API_KEY is not set. Connect Gelato in Shopify admin first.')
    this.name = 'GelatoNotConfiguredError'
  }
}

export async function gelatoGet<T>(path: string, base = GELATO_PRODUCT_BASE): Promise<T> {
  const apiKey = getApiKey()
  if (!apiKey) throw new GelatoNotConfiguredError()

  const res = await fetch(`${base}${path}`, { headers: headers(apiKey) })
  if (!res.ok) throw new Error(`Gelato GET ${path} → ${res.status}`)
  return res.json()
}

export async function gelatoPost<T>(path: string, body: unknown, base = GELATO_ORDER_BASE): Promise<T> {
  const apiKey = getApiKey()
  if (!apiKey) throw new GelatoNotConfiguredError()

  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gelato POST ${path} → ${res.status}: ${text}`)
  }
  return res.json()
}

export async function gelatoGetProductPrice(
  productUid: string,
  country = 'DK',
  currency = 'DKK'
): Promise<number | null> {
  try {
    const data = await gelatoGet<Array<{ price: number }>>(
      `/products/${productUid}/prices?country=${country}&currency=${currency}`
    )
    return data[0]?.price ?? null
  } catch (err) {
    if (err instanceof GelatoNotConfiguredError) {
      console.warn('[Gelato] Not configured — skipping price lookup')
    }
    return null
  }
}

export function isGelatoConfigured(): boolean {
  return Boolean(getApiKey())
}
