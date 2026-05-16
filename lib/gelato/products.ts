/**
 * Gelato product helpers.
 * Create Gelato products and link them to Shopify variants.
 * These are used by the seed scripts only — not called at runtime.
 *
 * DO NOT run these functions until Gelato is connected in Shopify admin
 * and GELATO_API_KEY is set in .env.local.
 */

import { gelatoPost, isGelatoConfigured } from './client'
import { getGelatoUid } from './catalog'

export interface GelatoProductPayload {
  title: string
  description: string
  isVisibleInTheOnlineStore: boolean
  salesChannels: Array<{ type: 'shopify'; settings: { shopifyProductId: string; shopifyVariantId: string } }>
  variants: Array<{
    productUid: string
    imagePlaceholders: Array<{ name: string; printArea: string; width: number; height: number }>
  }>
}

export interface GelatoCreateProductResult {
  id: string
  title: string
  externalId: string
}

/**
 * Create a Gelato product linked to a Shopify product/variant.
 * Returns null and logs warning if Gelato is not configured.
 */
export async function createGelatoProduct(payload: GelatoProductPayload): Promise<GelatoCreateProductResult | null> {
  if (!isGelatoConfigured()) {
    console.warn('[Gelato] Skipping product creation — GELATO_API_KEY not set')
    return null
  }

  return gelatoPost<GelatoCreateProductResult>('/products', payload)
}

/**
 * Build a standard product payload for a DayInDayIn print product.
 */
export function buildGelatoProductPayload({
  title,
  description,
  format,
  shopifyProductId,
  shopifyVariantId,
}: {
  title: string
  description: string
  format: string
  shopifyProductId: string
  shopifyVariantId: string
}): GelatoProductPayload | null {
  const productUid = getGelatoUid(format)
  if (!productUid) {
    console.warn(`[Gelato] Unknown format: ${format}`)
    return null
  }

  // Standard print area — Gelato expects mm dimensions for design placement
  const imagePlaceholder =
    format === 'mug-11oz'
      ? { name: 'front', printArea: 'front', width: 204, height: 85 }
      : format === 'tote-bag'
      ? { name: 'front', printArea: 'front', width: 280, height: 340 }
      : { name: 'front', printArea: 'default', width: 210, height: 297 } // A4/portrait default

  return {
    title,
    description,
    isVisibleInTheOnlineStore: true,
    salesChannels: [
      {
        type: 'shopify',
        settings: { shopifyProductId, shopifyVariantId },
      },
    ],
    variants: [
      {
        productUid,
        imagePlaceholders: [imagePlaceholder],
      },
    ],
  }
}
