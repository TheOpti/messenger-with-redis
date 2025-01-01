import { Redis } from "ioredis";

export const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
  reconnectOnError: (err) => {
    console.error("Reconnect on error:", err.message);
    return false;
  },
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    console.error(`[ioredis] Retry attempt #${times}`);
    return null;
  },
  lazyConnect: true,
});
