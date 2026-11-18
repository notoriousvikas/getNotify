
import { emailQueue } from "../email.queue.js";

export const enqueueEmail = async (notification,scheduleAt=null) => {
  console.log("scheduler ",scheduleAt)
     let delay = 0;

  if (scheduleAt) {
    const targetTime = new Date(scheduleAt).getTime();

    if (Number.isNaN(targetTime)) {
      throw new Error(`Invalid scheduleAt value: ${scheduleAt}`);
    }

    delay = Math.max(0, targetTime - Date.now());
  }
  return await emailQueue.add(
    "send-email",
    {
      notificationId: notification.toString(),
    },
    {
      delay,
      jobId: `email-${notification.toString()}-${Date.now()}`,
    },
  );
};
