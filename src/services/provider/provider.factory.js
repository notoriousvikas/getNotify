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
   const host = typeof provider ==="object" ? provider.config.host :undefined;
      const port = typeof provider ==="object" ? provider.config.port :undefined;

      const fromEmail = typeof provider ==="object"?provider.config.fromEmail :undefined
      const pass = typeof provider ==="object"?provider.config.password :undefined
      if(providerType==="smtp" &&(!host || !fromEmail || !port || !pass)){
        const error = new Error("please provide smtp details")
        error.retryable=false;
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
        sendEmail: (to, subject, text) => sendSmtpEmail(to, subject, text,fromEmail,pass,host,port),
      };

    default:
      throw new Error(`Unsupported email provider: ${providerType}`);
  }
};

export const getEmailProvider = createEmailProvider;
export default createEmailProvider;


