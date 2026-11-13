import { tryCatch } from "bullmq";
import { Provider } from "../../models/provider.model.js";
import { createEmailProvider } from "../../services/provider/provider.factory.js";

import "dotenv/config";

export const sendMail = async ({projectId,  subject, text, to}) => {
    if (!projectId || !to || !subject || !text) {
    const error = new Error("Missing required email fields");
    error.retryable = false;
    throw error;
  }
  console.log(projectId,subject,text,to)
    const projectIdStr = projectId?.toString();

  const provider = await Provider.findOne({
    projectId: projectIdStr,
    channel: "email",
    isActive: true,
  });

  if (!provider) {
    const error =new Error("No active  email provider found for this project.");
    error.retryable = false;
    throw error
  }
  try {
      const emailProvider = createEmailProvider(provider);

  // console.log("emailProvider", emailProvider);

  const result = await emailProvider.sendEmail(to, subject, text);
   console.log(result)
  

  if (!result || result.error) {
      const error = new Error(
        result?.error?.message || "Email provider failed"
      );

      error.retryable = true;
      throw error;

  }
  return result;
  } catch (error) {
    console.error("Email sending failed");
    throw error;
  }
};
