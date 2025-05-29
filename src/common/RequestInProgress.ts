import { RequestConfig } from "./common.types";
import { generateRequestID } from "./HashGenerator";

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
