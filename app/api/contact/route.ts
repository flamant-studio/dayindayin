import { Resend } from "resend";
import { NextRequest } from "next/server";

// Simply.com SMTP does not work from Vercel's serverless runtime — confirmed
// via a live test (consistent "getaddrinfo EBUSY" on every attempt, works
// fine from a normal machine). Raw SMTP is broadly unreliable on serverless
// platforms, which is exactly why HTTPS-based services like Resend exist.
//
// 2026-08-02: dayindayin.dk verified as the Resend sending domain (freed up
// the free tier's one-domain slot by dropping mikofu.com's — Mikofu has no
// live send activity, dayindayin is the priority project). Sending from
// hello@dayindayin.dk now.
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
    from: "DayInDayIn <hello@dayindayin.dk>",
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
