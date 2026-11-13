
import { Queue } from "bullmq";
import { redisConnection } from "./connection.js";

export const inappQueue = new Queue("inapp-queue", {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 1000,
    },

    removeOnComplete: {
      age: 24 * 60 * 60,
      count: 1000,
    },

    removeOnFail: false,
  },
});
