import { Client, Connection } from "@temporalio/client";

import { TEMPORAL_CONFIG } from "./index";

class TemporalClientProvider {
  private temporalClientPromise: Promise<Client> | undefined;

  async getClient(): Promise<Client> {
    if (!this.temporalClientPromise) {
      this.temporalClientPromise = Connection.connect({
        address: TEMPORAL_CONFIG.ADDRESS,
      })
        .then(
          (connection) =>
            new Client({
              connection,
              namespace: TEMPORAL_CONFIG.NAMESPACE,
            }),
        )
        .catch((error) => {
          this.temporalClientPromise = undefined;
          throw error;
        });
    }

    return this.temporalClientPromise;
  }
}

export default new TemporalClientProvider();
