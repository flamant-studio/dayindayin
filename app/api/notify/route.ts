import { Resend } from 'resend'
import { NextRequest } from 'next/server'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 're_placeholder_key')
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, handle, title, variantTitle } = body

  if (!email || !handle) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const to = process.env.CONTACT_EMAIL_TO
  if (!to) {
    // Log locally but return ok — don't break the UX when email isn't configured
    console.warn('[notify] CONTACT_EMAIL_TO not set — notification not sent', { email, handle })
    return Response.json({ ok: true })
  }

  const resend = getResend()
  const productLine = variantTitle && variantTitle !== 'Default Title'
    ? `${title} — ${variantTitle}`
    : title

  const { error } = await resend.emails.send({
    from: 'DayInDayIn <noreply@dayindayin.dk>',
    to,
    subject: `Back-in-stock request: ${productLine}`,
    text: `Someone wants to be notified when "${productLine}" is back in stock.\n\nEmail: ${email}\nProduct: https://dayindayin.dk/shop/${handle}`,
  })

  if (error) {
    return Response.json({ error: 'Failed to send' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
