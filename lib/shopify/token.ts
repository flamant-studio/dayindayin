interface TokenCache {
  token: string
  expiresAt: number
}

let cache: TokenCache | null = null

export async function getAdminToken(): Promise<string> {
  const now = Date.now()
  const buffer = 60_000 // refresh 60s before expiry

  if (cache && cache.expiresAt - buffer > now) {
    return cache.token
  }

  const domain = process.env.SHOPIFY_STORE_DOMAIN!
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SHOPIFY_CLIENT_ID!,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET!,
    }).toString(),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Shopify token mint failed: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as { access_token: string; expires_in: number }
  cache = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  }

  return cache.token
}
