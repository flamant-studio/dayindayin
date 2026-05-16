import { Resend } from "resend";
import { NextRequest } from "next/server";

// Lazy init — avoids build-time throw when RESEND_API_KEY is not set
function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY ?? "re_placeholder_key");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, message, website } = body;

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

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: "DayInDayIn <noreply@dayindayin.dk>",
    to,
    replyTo: email,
    subject: `New message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
