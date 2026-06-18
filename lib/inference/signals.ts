import { HANDLE_CATEGORY_MAP } from '@/lib/catalog/categories'

export interface UserSignals {
  sessionId: string
  isReturning: boolean
  customerType: 'browser' | 'shopper' | 'buyer' | 'returning'
  pricePoint: 'budget' | 'mid' | 'aspirational' | 'unknown'
  contentPreference: 'editorial' | 'functional'
  categoryInterest: string[]
  sessionQuality: 'low' | 'medium' | 'high'
  hasAbandoned: boolean
  recentSearches: string[]
  browseDepth: number
  sourceChannel: string | null
  materialAffinity: string[]
  daysSinceLastVisit: number | null
  repeatViewedHandles: string[]
  giftContext: boolean
  timeOfDay: 'morning' | 'afternoon' | 'evening'
  dwellQuality: 'quick-scanner' | 'reader' | 'deep-diver'
  tasteVector?: Record<string, number>
}

export interface UserProfile {
  session_id: string | null
  inferred_customer_type: string
  price_sensitivity: string
  content_preference: string
  category_interest: string[]
  session_quality_history: unknown[]
  abandonment_history: unknown[]
  source_channel_history: string[]
  search_keywords: string[]
  browse_history: string[]
  material_affinity?: string[]
  taste_vector?: Record<string, number>
  feedback_signals?: Record<string, 'like' | 'dismiss'>
  last_seen_at?: string
}

function inferCategoriesFromHandles(handles: string[]): string[] {
  const counts: Record<string, number> = {}
  for (const handle of handles) {
    for (const { keywords, category } of HANDLE_CATEGORY_MAP) {
      if (keywords.some((kw) => handle.includes(kw))) {
        counts[category] = (counts[category] ?? 0) + 1
        break
      }
    }
  }
  return Object.entries(counts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat)
}

export function extractSignals(profile: UserProfile | null, sessionId: string): UserSignals {
  const hour = new Date().getHours()
  const timeOfDay: UserSignals['timeOfDay'] =
    hour >= 5 && hour < 12 ? 'morning'
    : hour >= 12 && hour < 19 ? 'afternoon'
    : 'evening'

  if (!profile) {
    return {
      sessionId, isReturning: false, customerType: 'browser', pricePoint: 'unknown',
      contentPreference: 'editorial', categoryInterest: [], sessionQuality: 'low',
      hasAbandoned: false, recentSearches: [], browseDepth: 0, sourceChannel: null,
      materialAffinity: [], daysSinceLastVisit: null, repeatViewedHandles: [],
      giftContext: false, timeOfDay, dwellQuality: 'reader',
    }
  }

  const sessionHistory = (profile.session_quality_history as {
    scroll_depth?: number; pages?: number; dwell_seconds?: number; at?: string
  }[]) ?? []

  const lastVisitAt = sessionHistory.length > 0
    ? sessionHistory[sessionHistory.length - 1].at : null
  const daysSinceLastVisit = lastVisitAt
    ? Math.floor((Date.now() - new Date(lastVisitAt).getTime()) / (1000 * 60 * 60 * 24)) : null

  const avgScrollDepth = sessionHistory.length > 0
    ? sessionHistory.reduce((sum, s) => sum + (s.scroll_depth ?? 0), 0) / sessionHistory.length : 0
  const avgDwellSeconds = sessionHistory.length > 0
    ? sessionHistory.reduce((sum, s) => sum + (s.dwell_seconds ?? 0), 0) / sessionHistory.length : 0

  const sessionQuality: 'low' | 'medium' | 'high' =
    avgScrollDepth > 70 || avgDwellSeconds > 60 ? 'high'
    : avgScrollDepth > 40 || avgDwellSeconds > 20 ? 'medium'
    : 'low'

  const browseHistory = (profile.browse_history ?? []) as string[]
  const tasteVector = profile.taste_vector as Record<string, number> | undefined
  const storedInterest = profile.category_interest ?? []

  const categoryInterest = tasteVector && Object.keys(tasteVector).length > 0
    ? Object.entries(tasteVector)
        .filter(([, conf]) => conf >= 0.15)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([cat]) => cat)
    : storedInterest.length > 0
      ? storedInterest
      : inferCategoriesFromHandles(browseHistory)

  const isReturning = browseHistory.length >= 3

  const storedContentPref = (profile.content_preference as UserSignals['contentPreference']) ?? null
  const scrollBasedPref: UserSignals['contentPreference'] =
    sessionHistory.length >= 2
      ? avgScrollDepth > 60 ? 'editorial' : avgScrollDepth < 25 ? 'functional' : 'editorial'
      : 'editorial'
  const contentPreference: UserSignals['contentPreference'] = storedContentPref ?? scrollBasedPref

  const effectiveCategoryInterest = daysSinceLastVisit !== null && daysSinceLastVisit > 7
    ? categoryInterest.slice(0, 2)
    : categoryInterest

  const materialAffinity = Array.isArray(profile.material_affinity)
    ? (profile.material_affinity as string[]).slice(0, 3) : []

  const dismissedSet = new Set(
    Object.entries((profile.feedback_signals ?? {}) as Record<string, string>)
      .filter(([, v]) => v === 'dismiss')
      .map(([h]) => h)
  )
  const handleCounts: Record<string, number> = {}
  for (const h of browseHistory) { handleCounts[h] = (handleCounts[h] ?? 0) + 1 }
  const repeatViewedHandles = Object.entries(handleCounts)
    .filter(([h, count]) => count >= 2 && !dismissedSet.has(h))
    .map(([h]) => h)

  const searchKeywords = (profile.search_keywords ?? []) as string[]
  const giftContext =
    browseHistory.includes('gift-finder') ||
    searchKeywords.some((kw) => /\bgift\b/i.test(kw))

  const dwellQuality: UserSignals['dwellQuality'] =
    avgDwellSeconds >= 45 ? 'deep-diver'
    : avgDwellSeconds < 10 ? 'quick-scanner'
    : 'reader'

  return {
    sessionId,
    isReturning,
    customerType: (profile.inferred_customer_type as UserSignals['customerType']) ?? 'browser',
    pricePoint: (profile.price_sensitivity as UserSignals['pricePoint']) ?? 'unknown',
    contentPreference,
    categoryInterest: effectiveCategoryInterest,
    sessionQuality,
    hasAbandoned: (profile.abandonment_history as unknown[]).length > 0,
    recentSearches: (profile.search_keywords ?? []).slice(-5),
    browseDepth: browseHistory.length,
    sourceChannel: (() => {
      const raw = (profile.source_channel_history as string[] | null ?? []).slice(-1)[0] ?? null
      if (!raw) return null
      try { return (JSON.parse(raw) as { channel: string }).channel ?? null } catch { return raw }
    })(),
    materialAffinity,
    daysSinceLastVisit,
    repeatViewedHandles,
    giftContext,
    timeOfDay,
    dwellQuality,
    tasteVector: tasteVector && Object.keys(tasteVector).length > 0 ? tasteVector : undefined,
  }
}
