import { Provider } from "../../models/provider.model.js";
import { createSmsProvider } from "../../services/provider/provider.factory.js";
import "dotenv/config";

export const sendSms = async ({ projectId, to, body, text }) => {
  const messageBody = body || text;
  if (!projectId || !to || !messageBody) {
    const error = new Error("Missing required SMS fields (projectId, to, body)");
    error.retryable = false;
    throw error;
  }

  const projectIdStr = projectId?.toString();

  const provider = await Provider.findOne({
    projectId: projectIdStr,
    channel: "sms",
    isActive: true,
  });

  if (!provider) {
    const error = new Error("No active SMS provider found for this project.");
    error.retryable = false;
    throw error;
  }

  try {
    const smsProvider = createSmsProvider(provider);
    const result = await smsProvider.sendSms(to, messageBody);

    if (!result || result.error) {
      const error = new Error(
        result?.error?.message || "SMS provider failed"
      );
      error.retryable = true;
      throw error;
    }

    return result;
  } catch (error) {
    console.error("SMS sending failed:", error.message);
    throw error;
  }
};
