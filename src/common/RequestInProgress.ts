import { AxiosRequestConfig } from "axios";
import { generateRequestID } from "./HashGenerator";

const requestsInProgress = new Set<number>();

function addRequestInProgress(axiosObj: AxiosRequestConfig): void {
  requestsInProgress.add(generateRequestID(axiosObj));
}

function removeRequestInProgress(axiosObj: AxiosRequestConfig): void {
  requestsInProgress.delete(generateRequestID(axiosObj));
}

function isRequestInProgress(axiosObj: AxiosRequestConfig): boolean {
  return requestsInProgress.has(generateRequestID(axiosObj));
}

export { addRequestInProgress, removeRequestInProgress, isRequestInProgress };
