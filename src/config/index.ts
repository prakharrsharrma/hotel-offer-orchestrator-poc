export const APP_PORT = Number(process.env.PORT) || 8000;

export const TEMPORAL_CONFIG = {
  ADDRESS: process.env.TEMPORAL_ADDRESS || "localhost:7233",
  NAMESPACE: process.env.TEMPORAL_NAMESPACE || "default",
  TASK_QUEUE: process.env.TEMPORAL_TASK_QUEUE || "hotel-offers-task-queue",
};

export const CACHE_TTL = process.env.CACHE_TTL || 600;

export { default as temporalClient } from "./temporalClient";
