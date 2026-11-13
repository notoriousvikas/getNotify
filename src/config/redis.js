
import IORedis from "ioredis";
import dotenv from "dotenv"
dotenv.config({
  path:"../../.env"
})

// console.log(process.env.REDIS_URL)
export const redisConnection = new IORedis(
  process.env.REDIS_URL,
  {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  }
);

redisConnection.on("connect", () => {
  console.log("Redis connected");
});

redisConnection.on("error", (error) => {
  console.error("Redis error:", error);
});
