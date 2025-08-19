import type { RequestConfig } from "./common.types.ts";
import { generateRequestID } from "./HashGenerator.ts";

/** Request ID type for cache keys */
type requestID = number;
/** Expiration timestamp type for cache TTL */
type expireTimestamp = number;

/** Internal cache storage map */
const cacheObj = new Map<[requestID, expireTimestamp], any>();

/**
 * Clears expired cache entries based on TTL
 */
function clearCacheTTL() {
  for (const item of cacheObj.keys()) {
    if (item[1] < Date.now()) {
      cacheObj.delete(item);
    }
  }
}

/**
 * Adds an item to the cache with TTL
 * @param requestConfig Request configuration to generate cache key
 * @param obj Object to cache
 * @param ttlMS Time to live in milliseconds (default 5000ms)
 */
function addCache(requestConfig: RequestConfig, obj: any, ttlMS = 5000): void {
  clearCacheTTL();
  cacheObj.set([generateRequestID(requestConfig), Date.now() + ttlMS], obj);
}

/**
 * Retrieves an item from the cache
 * @param requestConfig Request configuration to generate cache key
 * @returns Cached object or undefined if not found/expired
 */
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

/**
 * Clears all cache entries
 */
function clearCache(): void {
  cacheObj.clear();
}

export { addCache, getCache, clearCache };
