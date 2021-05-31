import { AxiosRequestConfig } from "axios";
import { generateRequestID } from "./HashGenerator";
import { addRequestInProgress, isRequestInProgress } from "./RequestInProgress";
import sleep from "./sleep";

type requestID = number;
type expireTimestamp = number;

const cacheObj = new Map<[requestID, expireTimestamp], any>();

function clearCacheTTL() {
  for (const item of cacheObj.keys()) {
    if (item[1] < Date.now()) {
      cacheObj.delete(item);
    }
  }
}

function addCache(axiosObj: AxiosRequestConfig, obj: any, ttlMS = 5000) {
  clearCacheTTL();
  cacheObj.set([generateRequestID(axiosObj), Date.now() + ttlMS], obj);
}

async function getCache(axiosObj: AxiosRequestConfig): Promise<any> {
  clearCacheTTL();
  const key = generateRequestID(axiosObj);

  if (isRequestInProgress(axiosObj)) {
    await sleep(100);
    return getCache(axiosObj);
  }

  for (const item of cacheObj.keys()) {
    if (item[0] === key) {
      return cacheObj.get(item);
    }
  }

  addRequestInProgress(axiosObj);

  return undefined;
}

function clearCache() {
  cacheObj.clear();
}

export { addCache, getCache, clearCache };
