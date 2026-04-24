import { CACHE_TTL } from "../config";
import type { NormalizedHotel } from "../temporal/types";

import redis from "./redisClient";

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
    const cachedHotels = await redis.zrangebyscore(key, minPrice, maxPrice);

    return cachedHotels.map((hotel) => JSON.parse(hotel) as NormalizedHotel);
  },

  async cacheHotels(city: string, hotels: NormalizedHotel[]): Promise<void> {
    const key = getCityHotelsKey(city);
    const pipeline = redis.pipeline();

    hotels.forEach((hotel) => {
      pipeline.zadd(key, hotel.price, JSON.stringify(hotel));
    });

    pipeline.expire(key, CACHE_TTL);

    await pipeline.exec();
  },
};
