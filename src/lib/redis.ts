import * as Redis from "redis";

export const USE_REDIS = process.env.USE_REDIS === "true";

export const redis = Redis.createClient({
  url: process.env.REDIS_URL,
});
if (USE_REDIS && process.env.NEXT_PHASE !== "phase-production-build") {
  await redis.connect();
}
