import Redis from "ioredis";

const REDIS_OPTIONS = {
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
};

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, REDIS_OPTIONS)
  : new Redis({ host: "127.0.0.1", port: 6379, ...REDIS_OPTIONS });

redis.on("error", (error) => {
  console.error(`[redis] ${error.message}`);
});

export default redis;
