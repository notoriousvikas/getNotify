import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { Notification } from "../models/notification.model.js";
import { addTodlq } from "../queue/dlq/dlqueue.js";
import connectDb from "../config/connectDb.js";
import { sendMail } from "../utils/mail/send.mail.js";
import { sendSms } from "../utils/sms/send.sms.js";
import { notificationScheduler } from "../schedulers/notification.scheduler.js";

await connectDb()
  .then(() => {
    notificationScheduler();
  })
  .catch((error) => {
    console.error("Worker DB init error:", error);
  });

const workerOptions = {
  connection: redisConnection,
  concurrency: 10,
  drainDelay: 5,
  blockTimeout: 5000,
  stalledInterval: 5000,
  limiter: {
    duration: 1000,
    max: 10,
  },
};


const processEmail = async (job) => {
  const { notificationId } = job.data;
  console.log("Processing email for notification:", notificationId);

  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { $set: { status: "processing" } },
    { new: true, runValidators: true }
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  const { title, body, text, projectId, to } = notification;

  try {
    const emailResult = await sendMail({
      projectId,
      subject: title,
      text: body || text,
      to,
    });
    console.log(emailResult)
   
    if (emailResult) {
      await Notification.findByIdAndUpdate(
        notificationId,
        { $set: { status: "sent" } },
        { new: true, runValidators: true }
      );
    }
  } catch (err) {
    throw err;
  }
};

export const emailWorker = new Worker("email-queue", processEmail, workerOptions);

emailWorker.on("completed", async (job) => {
  console.log(`Email job ${job.id} completed`);
  await Notification.findByIdAndUpdate(
    job.data.notificationId,
    { $set: { status: "delivered" } },
    { new: true, runValidators: true }
  );
});

emailWorker.on("failed", async (job, error) => {
  console.error(`Email job ${job?.id} failed:`, error.message);
  const maxAttempts = job?.opts?.attempts || 5;
  if (job?.attemptsMade >= maxAttempts) {
    await addTodlq(job, error);
    await Notification.findByIdAndUpdate(
      job.data.notificationId,
      { $set: { status: "failed" } },
      { new: true, runValidators: true }
    );
  }
});

emailWorker.on("error", (error) => {
  console.error("Email worker error:", error);
});

// ==================== SMS PROCESSOR ====================
const processSms = async (job) => {
  const { notificationId } = job.data;
  console.log("Processing SMS for notification:", notificationId);

  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { $set: { status: "processing" } },
    { new: true, runValidators: true }
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  const { body, text, projectId, to } = notification;

  try {
    const smsResult = await sendSms({
      projectId,
      to,
      body: body || text,
    });

    if (smsResult) {
      await Notification.findByIdAndUpdate(
        notificationId,
        { $set: { status: "sent" } },
        { new: true, runValidators: true }
      );
    }
  } catch (err) {
    throw err;
  }
};

export const smsWorker = new Worker("sms-queue", processSms, workerOptions);

smsWorker.on("completed", async (job) => {
  console.log(`SMS job ${job.id} completed`);
  await Notification.findByIdAndUpdate(
    job.data.notificationId,
    { $set: { status: "delivered" } },
    { new: true, runValidators: true }
  );
});

smsWorker.on("failed", async (job, error) => {
  console.error(`SMS job ${job?.id} failed:`, error.message);
  const maxAttempts = job?.opts?.attempts || 5;
  if (job?.attemptsMade >= maxAttempts) {
    await addTodlq(job, error);
    await Notification.findByIdAndUpdate(
      job.data.notificationId,
      { $set: { status: "failed" } },
      { new: true, runValidators: true }
    );
  }
});

smsWorker.on("error", (error) => {
  console.error("SMS worker error:", error);
});

// ==================== IN-APP PROCESSOR ====================
const processInApp = async (job) => {
  const { notificationId } = job.data;
  console.log("Processing In-App notification:", notificationId);

  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { $set: { status: "delivered" } },
    { new: true, runValidators: true }
  );

  if (!notification) {
    throw new Error("Notification not found");
  }
};

export const inappWorker = new Worker("inapp-queue", processInApp, workerOptions);

inappWorker.on("completed", async (job) => {
  console.log(`In-app job ${job.id} delivered`);
});

inappWorker.on("failed", async (job, error) => {
  console.error(`In-app job ${job?.id} failed:`, error.message);
  const maxAttempts = job?.opts?.attempts || 3;
  if (job?.attemptsMade >= maxAttempts) {
    await addTodlq(job, error);
    await Notification.findByIdAndUpdate(
      job.data.notificationId,
      { $set: { status: "failed" } },
      { new: true, runValidators: true }
    );
  }
});

inappWorker.on("error", (error) => {
  console.error("In-app worker error:", error);
});


smsWorker.on("error", (error) => {
  console.error("SMS worker error:", error);
});

// ==================== IN-APP PROCESSOR ====================
