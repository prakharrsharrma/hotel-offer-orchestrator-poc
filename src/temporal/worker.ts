import { NativeConnection, Worker } from "@temporalio/worker";

import { TEMPORAL_CONFIG } from "../config";
import * as activities from "./activities";

async function runWorker(): Promise<void> {
  const connection = await NativeConnection.connect({
    address: TEMPORAL_CONFIG.ADDRESS,
  });

  const worker = await Worker.create({
    connection,
    namespace: TEMPORAL_CONFIG.NAMESPACE,
    taskQueue: TEMPORAL_CONFIG.TASK_QUEUE,
    workflowsPath: require.resolve("./workflows"),
    activities,
  });

  await worker.run();
}

runWorker().catch((error: unknown) => {
  console.error("Temporal worker failed to start", error);
  process.exit(1);
});
