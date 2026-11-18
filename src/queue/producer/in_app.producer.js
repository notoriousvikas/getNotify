import { inappQueue } from "../in_app.queue.js";

export const enqueueInApp = async (notification, scheduleAt = null) => {
  let delay = 0;
  if (scheduleAt) {
    const targetTime = new Date(scheduleAt).getTime();
    if (Number.isNaN(targetTime)) {
      throw new Error(`Invalid scheduleAt value: ${scheduleAt}`);
    }
    delay = Math.max(0, targetTime - Date.now());
  }

  return await inappQueue.add(
    "process-inapp",
    {
      notificationId: notification.toString(),
    },
    {
      delay,
      jobId: `inapp-${notification.toString()}-${Date.now()}`,
    }
  );
};
