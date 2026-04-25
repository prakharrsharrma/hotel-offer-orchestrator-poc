import { NativeConnection, Worker } from "@temporalio/worker";

import { TEMPORAL_CONFIG } from "../config";
import * as activities from "./activities";

const MAX_CONNECT_ATTEMPTS = Number(process.env.TEMPORAL_CONNECT_ATTEMPTS) || 30;
const CONNECT_RETRY_DELAY_MS =
  Number(process.env.TEMPORAL_CONNECT_RETRY_MS) || 2000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function connectWithRetry(): Promise<NativeConnection> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt += 1) {
    try {
      return await NativeConnection.connect({
        address: TEMPORAL_CONFIG.ADDRESS,
      });
    } catch (error: unknown) {
      lastError = error;

      if (attempt === MAX_CONNECT_ATTEMPTS) {
        break;
      }

      console.warn(
        `Temporal not reachable at ${TEMPORAL_CONFIG.ADDRESS} (attempt ${attempt}/${MAX_CONNECT_ATTEMPTS}), retrying in ${CONNECT_RETRY_DELAY_MS}ms...`,
      );
      await delay(CONNECT_RETRY_DELAY_MS);
    }
  }

  throw lastError;
}

async function runWorker(): Promise<void> {
  const connection = await connectWithRetry();

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
