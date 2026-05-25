import { NextRequest } from 'next/server'

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const TOKEN  = process.env.SHOPIFY_ADMIN_TOKEN!

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Create or update Shopify customer with acceptsMarketing: true
  const res = await fetch(
    `https://${DOMAIN}/admin/api/2025-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': TOKEN,
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
