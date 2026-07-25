import nodemailer from 'nodemailer'
import { NextRequest } from 'next/server'

// Simply.com SMTP — see app/api/contact/route.ts for why this isn't Resend.
function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  })
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

  const productLine = variantTitle && variantTitle !== 'Default Title'
    ? `${title} — ${variantTitle}`
    : title

  try {
    await getTransport().sendMail({
      from: `DayInDayIn <${process.env.SMTP_USER}>`,
      to,
      subject: `Back-in-stock request: ${productLine}`,
      text: `Someone wants to be notified when "${productLine}" is back in stock.\n\nEmail: ${email}\nProduct: https://dayindayin.dk/shop/${handle}`,
    })
  } catch {
    return Response.json({ error: 'Failed to send' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
