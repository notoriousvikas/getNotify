import { Queue } from "bullmq";
import { redisConnection } from "./connection.js";

export const emailQueue = new Queue("email-queue",{
    connection:redisConnection,

  defaultJobOptions: {
    attempts: 5,

    backoff: {
      type: "exponential",
      delay: 2000,
    },

    removeOnComplete: {
      age: 24 * 60 * 60,
      count: 1000,
    },

    removeOnFail: false,
  },
})