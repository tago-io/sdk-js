import { RequestConfig } from "./common.types";
import { generateRequestID } from "./HashGenerator";

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

function addCache(requestConfig: RequestConfig, obj: any, ttlMS = 5000) {
  clearCacheTTL();
  cacheObj.set([generateRequestID(requestConfig), Date.now() + ttlMS], obj);
}

function getCache(requestConfig: RequestConfig): any {
  clearCacheTTL();
  const key = generateRequestID(requestConfig);

  for (const item of cacheObj.keys()) {
    if (item[0] === key) {
      return cacheObj.get(item);
    }
  }

  return undefined;
}

function clearCache() {
  cacheObj.clear();
}

export { addCache, getCache, clearCache };
