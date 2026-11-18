import { sendEmail as sendResendEmail } from "./adapter/resend.adapter.js";
import { sendEmail as sendSmtpEmail } from "./adapter/smtp.adapter.js";
import { sendSms as sendTwilioSms } from "./adapter/twilio.adapter.js";

export const createEmailProvider = (provider) => {
  const providerType =
    typeof provider === "string" ? provider : provider?.provider;

  const apiKey =
    typeof provider === "object"
      ? provider?.apiKey || provider?.credentials?.apiKey
      : undefined;

  const config = provider?.config || {};
  const host = config.host;
  const port = config.port;
  const fromEmail = config.fromEmail;
  const pass = config.password;

  if (providerType === "smtp" && (!host || !fromEmail || !port || !pass)) {
    const error = new Error("Please provide complete SMTP details (host, port, fromEmail, password)");
    error.retryable = false;
    throw error;
  }

  switch (providerType?.toLowerCase()) {
    case "resend":
      return {
        sendEmail: (to, subject, text) =>
          sendResendEmail(to, subject, text, apiKey),
      };

    case "smtp":
      return {
        sendEmail: (to, subject, text) =>
          sendSmtpEmail(to, subject, text, fromEmail, pass, host, port),
      };

    default:
      throw new Error(`Unsupported email provider: ${providerType}`);
  }
};

export const createSmsProvider = (provider) => {
  const providerType =
    typeof provider === "string" ? provider : provider?.provider;

  const config = provider?.config || {};
  const credentials = {
    accountSid: config.accountSid || provider?.apiKey,
    apiKey: config.apiKey || provider?.apiKey,
    apiSecret: config.apiSecret || config.password,
    authToken: config.authToken || config.password || provider?.apiKey,
    from: config.from || config.fromNumber,
  };

  switch (providerType?.toLowerCase()) {
    case "twilio":
      return {
        sendSms: (to, body) => sendTwilioSms(to, body, credentials),
      };

    default:
      throw new Error(`Unsupported SMS provider: ${providerType}`);
  }
};

export const getEmailProvider = createEmailProvider;
export const getSmsProvider = createSmsProvider;
export default createEmailProvider;
