import { Resend } from "resend";
import { NextRequest } from "next/server";

// Simply.com SMTP does not work from Vercel's serverless runtime — confirmed
// via a live test (consistent "getaddrinfo EBUSY" on every attempt, works
// fine from a normal machine). Raw SMTP is broadly unreliable on serverless
// platforms, which is exactly why HTTPS-based services like Resend exist.
//
// Resend's free tier only allows one verified domain, already committed to
// mikofu.com — dayindayin.dk can't be added without a paid plan. Sending
// from Resend's shared sandbox domain works without any domain verification,
// but only delivers to the email address the Resend account is registered
// under. That means these two "notify the owner" emails land in Sebastian's
// personal inbox, not hello@dayindayin.dk — nothing customer-facing changes.
function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY ?? "re_placeholder_key");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, subject, message, website } = body;

  // Honeypot: bots fill the hidden "website" field
  if (website) {
    return Response.json({ ok: true });
  }

  if (!name || !email || !message) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const to = process.env.CONTACT_EMAIL_TO;
  if (!to) {
    return Response.json({ error: "Contact email not configured" }, { status: 500 });
  }

  const subjectLine = subject ? `${subject} — from ${name}` : `New message from ${name}`;

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: "DayInDayIn <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: subjectLine,
    text: `From: ${name} <${email}>\nSubject: ${subject || 'Not specified'}\n\n${message}`,
  });

  if (error) {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
