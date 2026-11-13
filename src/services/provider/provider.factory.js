import { sendEmail as sendResendEmail } from "./adapter/resend.adapter.js";
import { sendEmail as sendSmtpEmail } from "./adapter/smtp.adapter.js";

export const createEmailProvider = (provider) => {
  const providerType =
    typeof provider === "string" ? provider : provider?.provider;
   console.log("providerType",providerType)
  const apiKey =
    typeof provider === "object"
      ? provider?.apiKey || provider?.credentials?.apiKey
      : undefined;

  switch (providerType?.toLowerCase()) {
    case "resend":
      return {
        sendEmail: (to, subject, text) =>
          sendResendEmail(to, subject, text, apiKey),
      };

    case "smtp":
      return {
        sendEmail: (to, subject, text) => sendSmtpEmail(to, subject, text),
      };

    default:
      throw new Error(`Unsupported email provider: ${providerType}`);
  }
};

export const getEmailProvider = createEmailProvider;
export default createEmailProvider;


