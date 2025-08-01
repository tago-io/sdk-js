import type { RequestConfig } from "./common.types.ts";
import { generateRequestID } from "./HashGenerator.ts";

/** Set to track ongoing requests by ID to prevent duplicates */
const requestsInProgress = new Set<number>();

/**
 * Adds a request to the in-progress tracking set
 * @param requestConfig Request configuration to track
 */
function addRequestInProgress(requestConfig: RequestConfig): void {
  requestsInProgress.add(generateRequestID(requestConfig));
}

/**
 * Removes a request from the in-progress tracking set
 * @param requestConfig Request configuration to remove
 */
function removeRequestInProgress(requestConfig: RequestConfig): void {
  requestsInProgress.delete(generateRequestID(requestConfig));
}

/**
 * Checks if a request is currently in progress
 * @param requestConfig Request configuration to check
 * @returns True if request is in progress, false otherwise
 */
function isRequestInProgress(requestConfig: RequestConfig): boolean {
  return requestsInProgress.has(generateRequestID(requestConfig));
}

export { addRequestInProgress, removeRequestInProgress, isRequestInProgress };
