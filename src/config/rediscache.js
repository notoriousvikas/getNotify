import { Redis } from "@upstash/redis"
import dotenv from "dotenv";
dotenv.config({
  path:""
})
const redis = Redis.fromEnv()
console.log("redis cache connected")
export  {redis};


