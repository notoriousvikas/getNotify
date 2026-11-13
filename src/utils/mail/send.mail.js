import { Provider } from "../../models/provider.model.js";
import { createEmailProvider } from "../../services/provider/provider.factory.js";
import { Notification } from "../../models/notification.model.js";
import "dotenv/config";

export const sendMail = async (projectid, to, subject, text, recipientId) => {
  const provider = await Provider.findOne({
    projectId: projectid,
    channel: "email",
    isActive: true,
  });

  if (!provider) {
    throw new Error("No active email provider found for this project.");
  }
  const emailProvider = createEmailProvider(provider);

  console.log("emailProvider", emailProvider);

  const result = await emailProvider.sendEmail(recipientId, subject, text);
   console.log(result)
  

  if (result.messageId) {
    // const notification = new Notification({
    //   projectId: projectid,
    //   recipientId: "helloee",
    //   channel: "email",
    //   to,
    //   subject,
    //   text,
    //   status: "sent",
    // });
    // await notification.save();
    console.log(notification)
  }
  return result;
};
