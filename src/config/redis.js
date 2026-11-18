
import IORedis from "ioredis";
import dotenv from "dotenv"
dotenv.config({
  path: ".env"
})

// console.log(process.env.REDIS_URL)
const parsedUrl = new URL(process.env.REDIS_URL);

export const redisConnection = {
  host: parsedUrl.hostname,
  port: Number(parsedUrl.port) || 6379,
  username: parsedUrl.username || undefined,
  password: parsedUrl.password || undefined,
  tls: parsedUrl.protocol === "rediss:" ? {} : undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false, // Required for Upstash
  keepAlive: 10000,        // Keeps TCP socket alive so Upstash proxy doesn't drop BZPOPMIN
};
