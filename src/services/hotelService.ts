import { Client, Connection } from "@temporalio/client";

import { TEMPORAL_CONFIG } from "../config";
import type { NormalizedHotel } from "../temporal/types";
import * as workflows from "../temporal/workflows";
import { cacheService } from "./cacheService";

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = Number.MAX_SAFE_INTEGER;

let temporalClientPromise: Promise<Client> | undefined;

async function getTemporalClient(): Promise<Client> {
  if (!temporalClientPromise) {
    temporalClientPromise = Connection.connect({
      address: TEMPORAL_CONFIG.ADDRESS,
    }).then(
      (connection) =>
        new Client({
          connection,
          namespace: TEMPORAL_CONFIG.NAMESPACE,
        }),
    );
  }

  return temporalClientPromise;
}

export const hotelsService = {
  async getHotelsByCity(
    city: string,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<NormalizedHotel[]> {
    const lowerBound = minPrice ?? DEFAULT_MIN_PRICE;
    const upperBound = maxPrice ?? DEFAULT_MAX_PRICE;

    const cachedHotels = await cacheService.getCachedHotels(
      city,
      lowerBound,
      upperBound,
    );

    if (cachedHotels.length > 0) {
      return cachedHotels;
    }

    const workflowClient = await getTemporalClient();

    const hotels = await workflowClient.workflow.execute(
      workflows.getFilteredHotelsWorkflow,
      {
        taskQueue: TEMPORAL_CONFIG.TASK_QUEUE,
        args: [city, lowerBound, upperBound],
        workflowId: `get-hotels-${city.toLowerCase()}-${Date.now()}`,
      },
    );

    await cacheService.cacheHotels(city, hotels);

    return hotels;
  },
};
