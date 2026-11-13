import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { Notification } from "../models/notification.model.js";
import {sendMail} from "../utils/mail/send.mail.js"

const processEmail =   async (job) => {
    const { notificationId } = job.data;

    // Fetch notification
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      throw new Error("Notification not found");
    }

    // Get email information from notification
    const { to, subject, text, projectId } = notification;
     const email = await sendMail(to,subject,text);

    // Send email
    // await sendMail(projectId, to, subject, text);
  }

export const emailWorker = new Worker(
  "email-queue",
  processEmail,
  {
    connection:redisConnection,
    concurrency: 10,
    limiter:{
        duration:1000,
        max:10

    }
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
  console.error(`Email job ${job?.id} failed:`, error.message);
});

emailWorker.on("error", (error) => {
  console.error("Worker error:", error);
});