import { smsQueue } from "../sms.queue.js";

export const enqueueSms = async (notification, scheduleAt = null) => {
  let delay = 0;
  if (scheduleAt) {
    const targetTime = new Date(scheduleAt).getTime();
    if (Number.isNaN(targetTime)) {
      throw new Error(`Invalid scheduleAt value: ${scheduleAt}`);
    }
    delay = Math.max(0, targetTime - Date.now());
  }

  return await smsQueue.add(
    "send-sms",
    {
      notificationId: notification.toString(),
    },
    {
      delay,
      jobId: `sms-${notification.toString()}-${Date.now()}`,
    }
  );
};
