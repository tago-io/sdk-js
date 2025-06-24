import { generateRequestID } from "./HashGenerator";
import type { RequestConfig } from "./common.types";

const requestsInProgress = new Set<number>();

function addRequestInProgress(requestConfig: RequestConfig): void {
  requestsInProgress.add(generateRequestID(requestConfig));
}

function removeRequestInProgress(requestConfig: RequestConfig): void {
  requestsInProgress.delete(generateRequestID(requestConfig));
}

function isRequestInProgress(requestConfig: RequestConfig): boolean {
  return requestsInProgress.has(generateRequestID(requestConfig));
}

export { addRequestInProgress, removeRequestInProgress, isRequestInProgress };
