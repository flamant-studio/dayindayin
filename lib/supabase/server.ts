/**
 * Supabase server client — uses service role key.
 * SERVER-SIDE ONLY. Never import in client components.
 * All DayInDayIn/Fluid tables use the diy_ prefix to coexist
 * with the personal-shopper project in the same Supabase instance.
 */
import { createClient } from '@supabase/supabase-js'

function getServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

// ============================================================
// User profile
// ============================================================
export async function upsertUserProfile(sessionId: string, updates: Partial<{
  shopify_customer_id: string
  category_interest: string[]
  content_preference: string
  price_sensitivity: string
  inferred_customer_type: string
  session_quality_history: unknown[]
  abandonment_history: unknown[]
  source_channel_history: string[]
  search_keywords: string[]
  purchase_history: unknown[]
  browse_history: string[]
  material_affinity: string[]
  last_seen_at: string
  taste_vector: Record<string, number>
  feedback_signals: Record<string, string>
}>) {
  const supabase = getServerClient()
  const { data, error } = await supabase
    .from('diy_user_profiles')
    .upsert({ session_id: sessionId, ...updates }, { onConflict: 'session_id' })
    .select()
    .single()
  if (error) console.error('[supabase] upsertUserProfile error:', error)
  return data
}

export async function getUserProfile(sessionId: string) {
  const supabase = getServerClient()
  const { data, error } = await supabase
    .from('diy_user_profiles')
    .select('*')
    .eq('session_id', sessionId)
    .is('deleted_at', null)
    .single()
  if (error && error.code !== 'PGRST116') {
    console.error('[supabase] getUserProfile error:', error)
  }
  return data
}

export async function deleteUserProfile(sessionId: string) {
  const supabase = getServerClient()
  const { error } = await supabase
    .from('diy_user_profiles')
    .update({
      deleted_at: new Date().toISOString(),
      browse_history: [],
      search_keywords: [],
      purchase_history: [],
      session_quality_history: [],
      abandonment_history: [],
      source_channel_history: [],
      feedback_signals: {},
    })
    .eq('session_id', sessionId)
  if (error) console.error('[supabase] deleteUserProfile error:', error)
}

// ============================================================
// Event logging
// ============================================================
export async function logEvent(event: {
  session_id: string
  user_id?: string
  event_type: string
  event_data?: Record<string, unknown>
  page_url?: string
}) {
  const supabase = getServerClient()
  const { error } = await supabase.from('diy_events').insert(event)
  if (error) console.error('[supabase] logEvent error:', error)
}

// ============================================================
// Popular products (top viewed in last 7 days)
// ============================================================
export async function getPopularHandles(limit = 12): Promise<string[]> {
  const supabase = getServerClient()
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from('diy_events')
    .select('event_data')
    .eq('event_type', 'product_view')
    .gte('created_at', since7d)
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    const handle = (row.event_data as Record<string, unknown>)?.handle as string | undefined
    if (handle) counts[handle] = (counts[handle] ?? 0) + 1
  }
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([h]) => h)
}

// ============================================================
// Newsletter subscribers
// ============================================================
export async function addSubscriber(email: string): Promise<{ ok: boolean; duplicate: boolean }> {
  const supabase = getServerClient()
  const { error } = await supabase
    .from('diy_subscribers')
    .insert({ email })
  if (error) {
    if (error.code === '23505') return { ok: false, duplicate: true }
    console.error('[supabase] addSubscriber error:', error)
    return { ok: false, duplicate: false }
  }
  return { ok: true, duplicate: false }
}
