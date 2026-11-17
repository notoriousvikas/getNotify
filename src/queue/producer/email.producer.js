
import { emailQueue } from "../email.queue.js";

export const enqueueEmail = async (notification) => {
  return await emailQueue.add(
    "send-email",
    {
      notificationId: notification,
    },
    {
      jobId: `email-${notification.id}`,
    }
  );
};
