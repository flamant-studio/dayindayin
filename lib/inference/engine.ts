import { extractSignals, type UserSignals } from './signals'
import type { UserProfile } from './signals'

export interface ContentDirectives {
  showDiscounts: boolean
  contentPreference: 'editorial' | 'functional'
  hasAbandoned: boolean
  gridLayout: 'editorial' | 'standard' | 'dense'
  _t?: number
}

const DEFAULT_DIRECTIVES: ContentDirectives = {
  showDiscounts: false,
  contentPreference: 'editorial',
  hasAbandoned: false,
  gridLayout: 'standard',
}

export function runInference(profile: UserProfile | null, sessionId: string) {
  const signals = extractSignals(profile, sessionId)
  return { directives: deriveDirectives(signals) }
}

export function deriveDirectives(signals: UserSignals): ContentDirectives {
  const isPriceSensitive = signals.pricePoint === 'budget' || signals.pricePoint === 'mid'

  const gridLayout: ContentDirectives['gridLayout'] =
    signals.dwellQuality === 'deep-diver' ||
    (signals.isReturning && signals.sessionQuality === 'high' && signals.contentPreference === 'editorial')
      ? 'editorial'
      : signals.pricePoint === 'budget' ||
        (signals.dwellQuality === 'quick-scanner' && signals.browseDepth >= 6)
      ? 'dense'
      : 'standard'

  return {
    showDiscounts: isPriceSensitive,
    contentPreference: signals.contentPreference,
    hasAbandoned: signals.hasAbandoned,
    gridLayout,
    _t: Math.floor(Date.now() / 1000),
  }
}

export function serialiseDirectives(directives: ContentDirectives): string {
  return Buffer.from(JSON.stringify(directives)).toString('base64')
}

export function deserialiseDirectives(encoded: string): ContentDirectives {
  try {
    return JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'))
  } catch {
    return DEFAULT_DIRECTIVES
  }
}
