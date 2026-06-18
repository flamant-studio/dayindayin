/**
 * Vercel Edge Middleware — Fluid inference pipeline for DayInDayIn.
 * Runs before every page request. Reads user profile from Supabase,
 * derives content directives, writes them to a cookie for server components.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { serialiseDirectives, deriveDirectives } from '@/lib/inference/engine'
import { extractSignals } from '@/lib/inference/signals'

const SKIP_PATHS = ['/_next/', '/favicon', '/api/', '/robots.txt', '/sitemap']

const SESSION_COOKIE = 'diy_sid'
const DIRECTIVES_COOKIE = 'diy_dir'
const CONSENT_COOKIE = 'diy_consent'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (SKIP_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next()

  const response = NextResponse.next()

  // Get or create session ID
  let sessionId = request.cookies.get(SESSION_COOKIE)?.value
  if (!sessionId) {
    sessionId = `diy_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    response.cookies.set(SESSION_COOKIE, sessionId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  }

  // No personalisation without consent
  const consent = request.cookies.get(CONSENT_COOKIE)?.value
  if (consent === 'declined') return response

  // Skip Supabase fetch when directives are fresh (<30s old)
  const existingDir = request.cookies.get(DIRECTIVES_COOKIE)?.value
  const existingAge = (() => {
    if (!existingDir) return null
    try {
      const d = JSON.parse(Buffer.from(existingDir, 'base64').toString('utf-8'))
      return typeof d._t === 'number' ? Math.floor(Date.now() / 1000) - d._t : null
    } catch { return null }
  })()
  if (existingAge !== null && existingAge < 30) return response

  // Fetch profile from Supabase via REST (Edge-compatible)
  let userProfile = null
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (supabaseUrl && supabaseKey) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/diy_user_profiles?session_id=eq.${encodeURIComponent(sessionId)}&deleted_at=is.null&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(2000),
        }
      )
      if (res.ok) {
        const profiles = await res.json()
        userProfile = profiles[0] ?? null
      }
    }
  } catch {
    // Degrade gracefully to defaults
  }

  const signals = extractSignals(userProfile, sessionId)
  const directives = deriveDirectives(signals)

  response.cookies.set(DIRECTIVES_COOKIE, serialiseDirectives(directives), {
    maxAge: 60 * 5,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
