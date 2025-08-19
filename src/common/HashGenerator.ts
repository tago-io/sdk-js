import type { RequestConfig } from "./common.types.ts";

/**
 * Generates a hash number from any object using string conversion and bit manipulation
 * @param obj Object to hash
 * @returns Hash number (32-bit integer)
 */
function hashGenerator(obj: any): number {
  const objString = JSON.stringify(obj);

  let hash = 0;
  let chr: number;

  if (objString.length === 0) {
    return hash;
  }

  for (let i = 0; i < objString.length; i += 1) {
    chr = objString.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
}

/**
 * Generates a unique request ID based on request configuration for caching
 * @param requestConfig Request configuration object
 * @returns Unique request ID number
 */
function generateRequestID(requestConfig: RequestConfig): number {
  const objKey = {
    url: requestConfig.url,
    token: requestConfig.headers?.token,
    params: requestConfig.params,
    body: requestConfig.data,
    method: requestConfig.method,
  };

  const requestID = hashGenerator(objKey);

  return requestID;
}

export { hashGenerator, generateRequestID };
