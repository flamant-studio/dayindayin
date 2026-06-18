import Anthropic from '@anthropic-ai/sdk'
import type { UserSignals } from '@/lib/inference/signals'
import type { ShopifyProduct } from '@/lib/shopify/products'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are helping curate DayInDayIn — an art brand by Stine Weirsøe Flamant. Original prints, mugs, tote bags, and apparel made from her artwork. Scandinavian sensibility. Personal, warm, not corporate.

Brand voice rules:
- Warm, considered, direct. Nothing performative.
- Art-first, not commercial. The work speaks; the copy supports.
- NEVER use: superlatives, urgency signals, lifestyle fantasy, filler affirmations, exclamation marks.
- NEVER use: "stunning", "gorgeous", "incredible", "amazing", "beautiful".
- Short sentences. Active voice. Say less.`

function rankingFingerprint(products: ShopifyProduct[], signals: UserSignals, savedHandles: string[] = []): string {
  const productKey = products.slice(0, 3).map((p) => p.handle).join(',')
  const savedKey = savedHandles.slice(0, 3).sort().join(',')
  const repeatKey = signals.repeatViewedHandles.slice(0, 3).sort().join(',')
  return [
    signals.categoryInterest.slice(0, 3).join(','),
    signals.pricePoint,
    signals.customerType,
    productKey,
    savedKey,
    repeatKey,
    signals.giftContext ? 'gift' : '',
    signals.dwellQuality,
    signals.timeOfDay,
  ].join('|')
}

function diversifyForColdStart(products: ShopifyProduct[]): ShopifyProduct[] {
  const PRIORITY_TYPES = ['Art Print', 'Framed Print', 'Mug', 'Tote Bag', 'Poster', 'Apparel']
  const byType: Record<string, ShopifyProduct[]> = {}
  for (const p of products) {
    const t = p.productType || 'Other'
    ;(byType[t] = byType[t] ?? []).push(p)
  }
  const picked: ShopifyProduct[] = []
  const pickedHandles = new Set<string>()
  for (const type of PRIORITY_TYPES) {
    const first = (byType[type] ?? [])[0]
    if (first) { picked.push(first); pickedHandles.add(first.handle) }
  }
  return [...picked, ...products.filter((p) => !pickedHandles.has(p.handle))]
}

export async function rankProductsForUser(
  allProducts: ShopifyProduct[],
  signals: UserSignals,
  savedHandles: string[] = [],
  dismissedHandles: string[] = []
): Promise<ShopifyProduct[]> {
  if (allProducts.length === 0) return allProducts

  const products = dismissedHandles.length > 0
    ? allProducts.filter((p) => !dismissedHandles.includes(p.handle))
    : allProducts

  if (products.length === 0) return []

  if (!signals.isReturning && signals.categoryInterest.length === 0) {
    return diversifyForColdStart(products)
  }

  const productList = products
    .slice(0, 20)
    .map((p, i) =>
      `${i}: handle=${p.handle} type=${p.productType} price=${p.priceRangeV2.minVariantPrice.amount} tags=${p.tags.join(',')}`
    )
    .join('\n')

  const pricePriorityNote =
    signals.pricePoint === 'budget' ? 'User is budget-sensitive — prefer lower-priced items.'
    : signals.pricePoint === 'aspirational' ? 'User skews aspirational — prefer premium-priced items.'
    : ''

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }] as unknown as string,
      messages: [{
        role: 'user',
        content: `User interest categories: ${
          signals.tasteVector && Object.keys(signals.tasteVector).length > 0
            ? Object.entries(signals.tasteVector)
                .filter(([, c]) => c >= 0.15)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([cat, conf]) => `${cat} (${Math.round(conf * 100)}%)`)
                .join(', ') || 'none known'
            : signals.categoryInterest.join(', ') || 'none known'
        }
User type: ${signals.customerType}
Price sensitivity: ${signals.pricePoint}${pricePriorityNote ? `\n${pricePriorityNote}` : ''}
Content preference: ${signals.contentPreference}
Browse depth: ${signals.browseDepth} products viewed
Session quality: ${signals.sessionQuality}
Dwell quality: ${signals.dwellQuality}
${signals.materialAffinity.length > 0 ? `Material affinity: ${signals.materialAffinity.join(', ')}` : ''}
${savedHandles.length > 0 ? `Saved handles: ${savedHandles.slice(0, 10).join(', ')}` : ''}
${signals.repeatViewedHandles.length > 0 ? `Repeat-viewed handles (high intent): ${signals.repeatViewedHandles.slice(0, 5).join(', ')}` : ''}
${signals.giftContext ? 'Gift context: favour accessible, gift-appropriate items.' : ''}
${signals.hasAbandoned ? 'Cart abandoner: rank high-intent category matches first.' : ''}
${signals.timeOfDay === 'evening' ? 'Evening browse: favour prints and art over apparel.' : ''}

Products (index: handle, type, price, tags):
${productList}

Return indices in best-match order, comma-separated. ALL indices. Numbers only.`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    const indices = text.split(',').map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n))
    const reordered = indices.map((i) => products[i]).filter(Boolean)
    const seen = new Set(indices)
    const rest = products.filter((_, i) => !seen.has(i))
    let result = [...reordered, ...rest]

    if (signals.repeatViewedHandles.length > 0) {
      const repeatSet = new Set(signals.repeatViewedHandles.slice(0, 3))
      const pinned = result.filter((p) => repeatSet.has(p.handle))
      const rest2 = result.filter((p) => !repeatSet.has(p.handle))
      result = [...pinned, ...rest2]
    }

    return result
  } catch {
    return products
  }
}

export { rankingFingerprint }
