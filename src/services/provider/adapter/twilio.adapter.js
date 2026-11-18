import twilio from "twilio";

export const sendSms = async (to, body, credentials) => {
  const {
    accountSid = process.env.TWILIO_ACCOUNT_SID,
    apiKey,
    apiSecret,
    authToken = process.env.TWILIO_AUTH_TOKEN,
    from = process.env.TWILIO_PHONE_NUMBER,
  } = credentials || {};

  if (!accountSid) {
    const error = new Error("Twilio accountSid is required");
    error.retryable = false;
    throw error;
  }

  if (!from) {
    const error = new Error("Twilio sender 'from' phone number is required");
    error.retryable = false;
    throw error;
  }

  if (!to || !body) {
    const error = new Error("Recipient 'to' phone number and message 'body' are required");
    error.retryable = false;
    throw error;
  }

  let client;
  if (apiKey && apiSecret) {
    client = twilio(apiKey, apiSecret, { accountSid });
  } else if (authToken) {
    client = twilio(accountSid, authToken);
  } else {
    const error = new Error("Twilio credentials (apiKey + apiSecret or authToken) are required");
    error.retryable = false;
    throw error;
  }

  const message = await client.messages.create({
    from,
    to,
    body,
  });

  return message;
};
