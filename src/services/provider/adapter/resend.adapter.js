import { Resend } from "resend";

export const sendEmail = async (to, subject, text, apiKey) => {
  const key = apiKey || process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing Resend API key");
  }

  const resend = new Resend(key);

  return await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    to,
    subject,
    text,
  });
};
