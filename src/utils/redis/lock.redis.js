
import { redis } from "../../config/rediscache.js";

export const acquireLock = async (key, token, ttl = 10) => {
  const result = await redis.set(
    key,
    token,
    {
      nx: true,
      ex: ttl
    }
  );

  return result === "OK";
};

export const releaseLock = async (key, token) => {
  // Release only if this request owns the lock
  const script = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
      return redis.call("DEL", KEYS[1])
    else
      return 0
    end
  `;

  return await redis.eval(script, [key], [token]);
};
