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
          input: {
            email,
            tags: ['newsletter-signup'],
            emailMarketingConsent: {
              marketingState: 'SUBSCRIBED',
              marketingOptInLevel: 'SINGLE_OPT_IN',
            },
          },
        },
      }),
      cache: 'no-store',
    }
  )

  const json = await res.json()

  // GraphQL execution errors (bad query/schema mismatch) return HTTP 200 with
  // no `data` and a top-level `errors` array — a plain res.ok check misses
  // these entirely, which is exactly how this route silently failed before.
  if (!res.ok || json.errors) {
    console.error('Newsletter signup: Shopify request failed', res.status, JSON.stringify(json))
    return Response.json({ error: 'Could not subscribe that address. Try again.' }, { status: 502 })
  }

  const errors = json.data?.customerCreate?.userErrors ?? []

  // "Email has already been taken" means an existing customer (e.g. a past
  // buyer) — customerCreate can't touch them, so tag + opt them in directly
  // via a separate call rather than silently doing nothing.
  const alreadyExists = errors.some((e: { message: string }) =>
    e.message.toLowerCase().includes('already been taken')
  )

  if (errors.length && !alreadyExists) {
    return Response.json({ error: errors[0].message }, { status: 422 })
  }

  if (alreadyExists) {
    const ok = await tagAndSubscribeExistingCustomer(token, email)
    if (!ok) {
      return Response.json({ error: 'Could not subscribe that address. Try again.' }, { status: 502 })
    }
  }

  return Response.json({ ok: true })
}

async function tagAndSubscribeExistingCustomer(token: string, email: string): Promise<boolean> {
  const findRes = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // customerByIdentifier takes a plain scalar, not a search-query string
      // — email is public-endpoint user input, avoid interpolating it into
      // Shopify's search DSL (customers(query: "email:...")) entirely.
      query: `
        query($identifier: CustomerIdentifierInput!) {
          customerByIdentifier(identifier: $identifier) { id }
        }
      `,
      variables: { identifier: { emailAddress: email } },
    }),
    cache: 'no-store',
  })
  const findJson = await findRes.json()
  const customerId = findJson.data?.customerByIdentifier?.id
  if (!findRes.ok || findJson.errors || !customerId) {
    console.error('Newsletter signup: could not look up existing customer', JSON.stringify(findJson))
    return false
  }

  // tagsAdd is additive — unlike CustomerInput.tags on customerUpdate, it
  // won't wipe out any tags the customer already has.
  const tagRes = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation tagsAdd($id: ID!, $tags: [String!]!) {
          tagsAdd(id: $id, tags: $tags) {
            userErrors { field message }
          }
        }
      `,
      variables: { id: customerId, tags: ['newsletter-signup'] },
    }),
    cache: 'no-store',
  })
  const tagJson = await tagRes.json()
  if (!tagRes.ok || tagJson.errors || tagJson.data?.tagsAdd?.userErrors?.length) {
    console.error('Newsletter signup: tagsAdd failed', JSON.stringify(tagJson))
    return false
  }

  const consentRes = await fetch(`https://${DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation customerUpdate($input: CustomerInput!) {
          customerUpdate(input: $input) {
            userErrors { field message }
          }
        }
      `,
      variables: {
        input: {
          id: customerId,
          emailMarketingConsent: { marketingState: 'SUBSCRIBED', marketingOptInLevel: 'SINGLE_OPT_IN' },
        },
      },
    }),
    cache: 'no-store',
  })
  const consentJson = await consentRes.json()
  if (!consentRes.ok || consentJson.errors || consentJson.data?.customerUpdate?.userErrors?.length) {
    console.error('Newsletter signup: customerUpdate consent failed', JSON.stringify(consentJson))
    return false
  }

  return true
}
