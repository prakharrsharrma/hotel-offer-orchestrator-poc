import { Client, Connection } from "@temporalio/client";

import { TEMPORAL_CONFIG } from "../config";
import type { NormalizedHotel } from "../temporal/types";
import * as workflows from "../temporal/workflows";

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
  async getHotelsByCity(city: string): Promise<NormalizedHotel[]> {
    const workflowClient = await getTemporalClient();

    return workflowClient.workflow.execute(
      workflows.getFilteredHotelsWorkflow,
      {
        taskQueue: TEMPORAL_CONFIG.TASK_QUEUE,
        args: [city],
        workflowId: `get-hotels-${city.toLowerCase()}-${Date.now()}`,
      },
    );
  },
};
