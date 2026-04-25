import { CACHE_TTL } from "../config";
import type { NormalizedHotel } from "../temporal/types";

import redis from "./redisClient";

function isRedisUnavailableError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("ECONNREFUSED") ||
    error.message.includes("Connection is closed") ||
    error.message.includes("max retries per request")
  );
}

function getCityHotelsKey(city: string): string {
  return `hotels:city:${city.toLowerCase()}`;
}

export const cacheService = {
  async getCachedHotels(
    city: string,
    minPrice: number,
    maxPrice: number,
  ): Promise<NormalizedHotel[]> {
    const key = getCityHotelsKey(city);
    let cachedHotels: string[];

    try {
      cachedHotels = await redis.zrangebyscore(key, minPrice, maxPrice);
    } catch (error) {
      if (isRedisUnavailableError(error)) {
        console.warn(
          "[cache] Redis unavailable during read. Continuing without cache.",
        );
        return [];
      }

      throw error;
    }

    return cachedHotels.map((hotel) => JSON.parse(hotel) as NormalizedHotel);
  },

  async cacheHotels(city: string, hotels: NormalizedHotel[]): Promise<void> {
    const key = getCityHotelsKey(city);
    const pipeline = redis.pipeline();

    hotels.forEach((hotel) => {
      pipeline.zadd(key, hotel.price, JSON.stringify(hotel));
    });

    pipeline.expire(key, CACHE_TTL);

    try {
      await pipeline.exec();
    } catch (error) {
      if (isRedisUnavailableError(error)) {
        console.warn(
          "[cache] Redis unavailable during write. Skipping cache update.",
        );
        return;
      }

      throw error;
    }
  },
};
