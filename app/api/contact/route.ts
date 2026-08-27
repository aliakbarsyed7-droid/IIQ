import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+() .\-]{7,30}$/;

const MAX_BODY_BYTES = 20_000;
const MAX_NAME = 120;
const MAX_COMPANY = 160;
const MAX_EMAIL = 254;
const MAX_PHONE = 30;
const MAX_MESSAGE = 3000;

function clean(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/\0/g, "")
    .replace(/[<>]/g, "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 415 }
      );
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);

    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Request too large." },
        { status: 413 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured.");

      return NextResponse.json(
        { error: "Message service is temporarily unavailable." },
        { status: 503 }
      );
    }

    const body = await request.json();

    /*
      Honeypot anti-spam field.
      The existing frontend already submits `website`.
      Real visitors never see or complete it.
    */
    if (clean(body.website, 200)) {
      return NextResponse.json({ ok: true });
    }

    const name = clean(body.name, MAX_NAME);
    const company = clean(body.company, MAX_COMPANY);
    const email = clean(body.email, MAX_EMAIL).toLowerCase();
    const phone = clean(body.phone, MAX_PHONE);
    const message = clean(body.message, MAX_MESSAGE);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (phone && !PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Please enter a little more detail in your message." },
        { status: 400 }
      );
    }

    const emailDomain =
      process.env.RESEND_EMAIL_DOMAIN?.trim() || "innovativeiq.co.uk";

    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: `Website Enquiries <website@${emailDomain}>`,
      to: ["info@innovativeiq.co.uk"],
      replyTo: email,
      subject: `New Innovative IQ Website Enquiry - ${name}`,
      text: [
        "New Innovative IQ website enquiry",
        "",
        `Name: ${name}`,
        `Company: ${company || "Not provided"}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    if (result.error) {
      console.error("Resend delivery error:", result.error);

      return NextResponse.json(
        { error: "Unable to send your message right now." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      { error: "Unable to process your message right now." },
      { status: 500 }
    );
  }
}
