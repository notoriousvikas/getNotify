
import { emailQueue } from "../email.queue.js";

export const enqueueEmail = async (notificationId) => {
  return await emailQueue.add(
    "send-email",
    {
      notificationId: notificationId.toString(),
    },
    {
      jobId: `email-${notificationId}`,
    }
  );
};
