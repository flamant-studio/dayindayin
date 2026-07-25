import nodemailer from "nodemailer";
import { NextRequest } from "next/server";

// Sends via Simply.com SMTP using the real hello@dayindayin.dk mailbox.
// Not Resend: Resend's free tier is already committed to mikofu.com's domain,
// and dayindayin.dk can't be added as a second domain without a paid plan.
function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
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
  if (!to || !process.env.SMTP_HOST) {
    return Response.json({ error: "Contact email not configured" }, { status: 500 });
  }

  const subjectLine = subject ? `${subject} — from ${name}` : `New message from ${name}`;

  try {
    await getTransport().sendMail({
      from: `DayInDayIn <${process.env.SMTP_USER}>`,
      to,
      replyTo: email,
      subject: subjectLine,
      text: `From: ${name} <${email}>\nSubject: ${subject || 'Not specified'}\n\n${message}`,
    });
  } catch (e) {
    console.error("[contact] send failed:", e);
    // TEMP DEBUG — remove before final commit
    return Response.json({ error: "Failed to send email", debug: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }

  return Response.json({ ok: true });
}
