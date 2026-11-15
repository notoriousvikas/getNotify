import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../../config/rediscache.js"

export const loginLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "ratelimit:login",
    analytics: true,
})

export const messageLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "ratelimit:message",
});
export const registerLimiter = new Ratelimit({
    redis,
    limititer: Ratelimit.slidingWindow(5,"15 m"),
    prefix:"ratelimit:register"
})
export const likeLimiter = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(30,"1 m"),
    prefix:"ratelimit:like"
})
