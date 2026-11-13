import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { Notification } from "../models/notification.model.js";
import connectDb from "../config/connectDb.js";
import {sendMail} from "../utils/mail/send.mail.js"

await connectDb();

const processEmail =   async (job) => {
    const { notificationId } = job.data;

    // Fetch notification

    const notification = await Notification.findById(notificationId);
  
    if (!notification) {
      throw new Error("Notification not found");
    }

    // Get email information from notification
    const { recipientId,title, subject,body, text, projectId,to } = notification;
  
     try {
          const email = await sendMail({projectId:projectId,subject:title,
      text: body|| text,
      to:to});
     } catch (error) {
  
      throw error;
     }
     
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