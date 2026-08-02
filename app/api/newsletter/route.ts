import { NextRequest } from 'next/server'

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!

// There is no static SHOPIFY_ADMIN_TOKEN in this project — it's minted fresh
// via the client_credentials grant, same as every scripts/*.ts admin script.
// A prior version of this route read a static SHOPIFY_ADMIN_TOKEN env var
// that was never actually set in Vercel, and never checked the Shopify
// response status — every signup silently failed while showing "Subscribed"
// (confirmed 2026-08-02: test email returned {ok:true} but never appeared as
// a Shopify customer).
async function getAdminToken(): Promise<string> {
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SHOPIFY_CLIENT_ID!,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET!,
    }).toString(),
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok || !json.access_token) {
    throw new Error(`Failed to mint Shopify admin token: ${JSON.stringify(json)}`)
  }
  return json.access_token
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  let token: string
  try {
    token = await getAdminToken()
  } catch (err) {
    console.error('Newsletter signup: could not mint Shopify admin token', err)
    return Response.json({ error: 'Could not subscribe that address. Try again.' }, { status: 500 })
  }

  // Create or update Shopify customer with acceptsMarketing: true
  const res = await fetch(
    `https://${DOMAIN}/admin/api/2025-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({
        query: `
          mutation customerCreate($input: CustomerInput!) {
            customerCreate(input: $input) {
              customer { id email }
              userErrors { field message }
            }
          }
        `,
        variables: {
          input: { email, acceptsMarketing: true },
        },
      }),
      cache: 'no-store',
    }
  )

  const json = await res.json()

  if (!res.ok) {
    console.error('Newsletter signup: Shopify request failed', res.status, JSON.stringify(json))
    return Response.json({ error: 'Could not subscribe that address. Try again.' }, { status: 502 })
  }

  const errors = json.data?.customerCreate?.userErrors ?? []

  // "Email has already been taken" is not a failure — they're already subscribed
  const alreadyExists = errors.some((e: { message: string }) =>
    e.message.toLowerCase().includes('already been taken')
  )

  if (errors.length && !alreadyExists) {
    return Response.json({ error: errors[0].message }, { status: 422 })
  }

  return Response.json({ ok: true })
}
