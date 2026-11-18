import cron from "node-cron";
import { Notification } from "../models/notification.model.js";
import { enqueueEmail } from "../queue/producer/email.producer.js";
import { enqueueSms } from "../queue/producer/sms.producer.js";
import { enqueueInApp } from "../queue/producer/in_app.producer.js";

export const notificationScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const dueNotifications = await Notification.find({
        status: "scheduled",
        scheduleAt: { $lte: now },
      }).limit(100);

      for (const notification of dueNotifications) {
        // Atomic lock prevents duplicate queueing across worker instances
        const locked = await Notification.findOneAndUpdate(
          { _id: notification._id, status: "scheduled" },
          { $set: { status: "queued" } }
        );

        if (locked) {
          switch (notification.channel) {
            case "email":
              await enqueueEmail(notification._id);
              break;
            case "sms":
              await enqueueSms(notification._id);
              break;
            case "in_app":
              await enqueueInApp(notification._id);
              break;
            default:
              console.warn(`Unsupported channel in scheduler: ${notification.channel}`);
          }
        }
      }
    } catch (error) {
      console.error("Scheduler cron error:", error);
    }
  });

  console.log("Notification scheduler started");
};
