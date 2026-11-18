import cron from "node-cron"
import { Notification } from "../models/notification.model.js";

import { enqueueEmail } from "../queue/producer/email.producer.js";

export const notificationScheduler = () =>{
    cron.schedule("* * * *",async () =>{
   try {
      const now = new Date();
     const dueNotifications = await Notification.find({status:"schedule",
        scheduleAt: { $lte: now }
     }).limit(100);
      for (const notification of dueNotifications) {
        // Atomic lock prevents duplicate queueing
        const locked = await Notification.findOneAndUpdate(
          { _id: notification._id, status: "scheduled" },
          { $set: { status: "queued" } }
        );

        if (locked) {
          await enqueueEmail.add(
            "send-email",
            { notificationId: notification._id.toString() },
            {
              jobId: `email-${notification._id.toString()}`,
              attempts: 3,
              backoff: { type: "exponential", delay: 2000 },
              removeOnComplete: true,
            }
          );
        }
      }
   } catch (error) {
      console.error("Scheduler cron error:", err);
   }
    })
     console.log("Notification scheduler started");
}