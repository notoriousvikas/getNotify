import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { Notification } from "../models/notification.model.js";
import {addTodlq} from "../queue/dlq/dlqueue.js"
import connectDb from "../config/connectDb.js";
import {sendMail} from "../utils/mail/send.mail.js"
import {notificationScheduler} from "../schedulers/notification.scheduler"
await connectDb();
notificationScheduler();
const processEmail =   async (job) => {
    const { notificationId } = job.data;

    // Fetch notification
    console.log(notificationId)
    const notification = await Notification.findByIdAndUpdate(notificationId,{$set:{status:"processing"}},{new:true, runValidators:true});
    
    if (!notification) {
      throw new Error("Notification not found");
    }

    // Get email information from notification
    const { recipientId,title, subject,body, text, projectId,to } = notification;
     
     try {
          const email = await sendMail({projectId:projectId,subject:title,
      text: body|| text,
      to:to});
      if(email){
        await Notification.findByIdAndUpdate(notificationId,{$set:{status:"sent"}},{new:true, runValidators:true});
      }
     } catch (err) {
      
     throw err;
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
    drainDelay:5,
    limiter:{
        duration:1000,
        max:10

    }
  }
);

emailWorker.on("completed", async(job) => {
  console.log(`Email job ${job.id} completed`);
  await Notification.findByIdAndUpdate(job.data.notificationId,{$set:{status:"delivered"}},{new:true, runValidators:true});
});

emailWorker.on("failed", async(job, error) => {
  console.error(`Email job ${job?.id} failed:`, error.message);
  const maxattempts = job.opts.attempts
  if(job.attemptsMade>=maxattempts){
     await addTodlq(job,error)
  await Notification.findByIdAndUpdate(job.data.notificationId,{$set:{status:"failed"}},{new:true, runValidators:true});
  }
 


});

emailWorker.on("error", (error) => {
  console.error("Worker error:", error);
});