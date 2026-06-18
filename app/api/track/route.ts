/**
 * POST /api/track
 * Receives client-side events, writes to Supabase, updates user profile signals.
 */
import { NextRequest, NextResponse } from 'next/server'
import { logEvent, getUserProfile, upsertUserProfile } from '@/lib/supabase/server'
import { HANDLE_CATEGORY_MAP, handleToCategory } from '@/lib/catalog/categories'

const trackRateMap = new Map<string, number[]>()
const TRACK_WINDOW_MS = 60_000
const TRACK_MAX = 120

function checkRate(ip: string): boolean {
  const now = Date.now()
  const hits = (trackRateMap.get(ip) ?? []).filter((t) => now - t < TRACK_WINDOW_MS)
  if (hits.length >= TRACK_MAX) return false
  trackRateMap.set(ip, [...hits, now])
  return true
}

interface TrackingPayload {
  session_id: string
  events: { type: string; data: Record<string, unknown> }[]
}

// Weighted moving average for taste_vector: new signal blended in at α=0.3
function updateTasteVector(
  existing: Record<string, number>,
  newCategories: string[],
  alpha = 0.3
): Record<string, number> {
  const result = { ...existing }
  for (const cat of newCategories) {
    result[cat] = (result[cat] ?? 0) * (1 - alpha) + alpha
  }
  // Decay all other categories slightly
  for (const cat of Object.keys(result)) {
    if (!newCategories.includes(cat)) {
      result[cat] = result[cat] * (1 - alpha * 0.1)
    }
  }
  return result
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRate(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  let payload: TrackingPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!payload.session_id || !Array.isArray(payload.events)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { session_id, events } = payload

  // Write events (fire-and-forget, don't block response)
  void Promise.all(
    events.map((event) =>
      logEvent({
        session_id,
        event_type: event.type,
        event_data: event.data,
        page_url: (event.data.url as string) ?? undefined,
      })
    )
  )

  // Collect signal updates
  const browseAppends: string[] = []
  const categoryAppends: string[] = []
  const searchAppends: string[] = []
  const viewedPrices: number[] = []
  let inferredType: string | null = null

  const FUNCTIONAL_KEYWORDS = ['size', 'dimension', 'material', 'cm', 'weight', 'washable', 'care', 'capacity']

  for (const event of events) {
    if (event.type === 'product_view') {
      const handle = event.data.handle as string
      if (handle) {
        browseAppends.push(handle)
        const cat = handleToCategory(handle)
        if (cat) categoryAppends.push(cat)
      }
      const price = parseFloat(event.data.price as string)
      if (!isNaN(price) && price > 0) viewedPrices.push(price)
    }

    if (event.type === 'search') {
      const query = event.data.query as string
      if (query) {
        searchAppends.push(query)
        const lower = query.toLowerCase()
        if (FUNCTIONAL_KEYWORDS.some((kw) => lower.includes(kw))) {
          // functional search query — noted in profile update below
        }
        for (const { keywords, category } of HANDLE_CATEGORY_MAP) {
          if (keywords.some((kw) => lower.includes(kw))) {
            categoryAppends.push(category)
            break
          }
        }
      }
    }

    if (event.type === 'collection_view') {
      const handle = event.data.handle as string
      if (handle) {
        const cat = handleToCategory(handle)
        if (cat) { categoryAppends.push(cat); categoryAppends.push(cat) } // double-weight
      }
    }

    if (event.type === 'add_to_cart') {
      inferredType = 'shopper'
      const handle = event.data.handle as string
      if (handle) {
        browseAppends.push(handle)
        const cat = handleToCategory(handle)
        if (cat) { categoryAppends.push(cat); categoryAppends.push(cat); categoryAppends.push(cat) } // triple-weight
      }
    }

    if (event.type === 'purchase') {
      inferredType = 'buyer'
    }

    if (event.type === 'save_product') {
      const handle = event.data.handle as string
      if (handle) {
        const cat = handleToCategory(handle)
        if (cat) {
          // save = strongest intent signal, weight 3×
          categoryAppends.push(cat); categoryAppends.push(cat); categoryAppends.push(cat)
        }
      }
    }

    if (event.type === 'filter_applied') {
      const filterValue = event.data.value as string
      if (filterValue) {
        const cat = handleToCategory(filterValue) ?? filterValue
        if (cat) { categoryAppends.push(cat); categoryAppends.push(cat); categoryAppends.push(cat) }
      }
    }

    if (event.type === 'abandon_cart') {
      // handled via abandonment_history below
    }
  }

  // Fetch current profile to merge signals
  const profile = await getUserProfile(session_id)

  const updates: Parameters<typeof upsertUserProfile>[1] = {
    last_seen_at: new Date().toISOString(),
  }

  if (browseAppends.length > 0) {
    const existing = (profile?.browse_history as string[] | null) ?? []
    const merged = [...existing, ...browseAppends].slice(-50)
    updates.browse_history = merged
  }

  if (categoryAppends.length > 0) {
    // Update category_interest counts
    const existing = (profile?.category_interest as string[] | null) ?? []
    const counts: Record<string, number> = {}
    for (const c of existing) counts[c] = (counts[c] ?? 0) + 1
    for (const c of categoryAppends) counts[c] = (counts[c] ?? 0) + 1
    updates.category_interest = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([cat]) => cat)

    // Update taste_vector via WMA
    const existingVector = (profile?.taste_vector as Record<string, number> | null) ?? {}
    updates.taste_vector = updateTasteVector(existingVector, categoryAppends)
  }

  if (searchAppends.length > 0) {
    const existing = (profile?.search_keywords as string[] | null) ?? []
    updates.search_keywords = [...existing, ...searchAppends].slice(-20)
  }

  if (viewedPrices.length > 0) {
    const avgPrice = viewedPrices.reduce((a, b) => a + b, 0) / viewedPrices.length
    // DKK price tiers for dayindayin
    updates.price_sensitivity =
      avgPrice < 200 ? 'budget'
      : avgPrice < 500 ? 'mid'
      : 'aspirational'
  }

  if (inferredType) {
    const current = profile?.inferred_customer_type ?? 'browser'
    const hierarchy = ['browser', 'shopper', 'buyer']
    if (hierarchy.indexOf(inferredType) > hierarchy.indexOf(current)) {
      updates.inferred_customer_type = inferredType
    }
  }

  if (Object.keys(updates).length > 0) {
    await upsertUserProfile(session_id, updates)
  }

  return NextResponse.json({ ok: true })
}
