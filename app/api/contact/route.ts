import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

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
