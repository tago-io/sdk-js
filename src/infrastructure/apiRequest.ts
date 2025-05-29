import config from "../config";
import sleep from "../common/sleep";
import isBrowser from "./isBrowser";
import envParams from "./envParams.json";
import qs from "qs";
import { addRequestInProgress, isRequestInProgress, removeRequestInProgress } from "../common/RequestInProgress";
import { addCache, getCache } from "../common/Cache";
import { RequestConfig } from "../common/common.types";

interface ResponseData {
  data: any;
  status: number;
  statusText: string;
}

/**
 * Handle the TagoIO Response
 * @internal
 * @param result Fetch Response
 */
function resultHandler(result: ResponseData) {
  if (!result.data) {
    throw result.statusText;
  }

  if (result.data.status !== true) {
    return result.data.message || result.data.result || result.data;
  }

  return { data: result.data.result };
}

/**
 * Handle all request to TagoIO API
 * @internal
 * @param requestConfig Request Configuration Object
 */
async function apiRequest(requestConfig: RequestConfig, cacheTTL?: number): Promise<any> {
  if (cacheTTL) {
    if (isRequestInProgress(requestConfig)) {
      await sleep(100);
      return apiRequest(requestConfig, cacheTTL);
    }

    const objCached = getCache(requestConfig);
    if (objCached) {
      return objCached;
    }
  }

  addRequestInProgress(requestConfig);

  // Prepare headers
  let headers = { ...requestConfig.headers };

  if (isBrowser()) {
    // Prevent cache on Browsers
    headers = {
      ...headers,
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    };
  } else if (typeof process !== "undefined") {
    const banner =
      process.env.T_ANALYSIS_CONTEXT === "tago-io"
        ? `(Running at TagoIO)`
        : `(External; Node.js/${process.version} ${process.platform}/${process.arch})`;

    headers = {
      ...headers,
      "User-Agent": `TagoIO-SDK|JS|${envParams.version} ${banner}`,
    };
  }

  // Build URL with params
  let url = requestConfig.url || "";
  if (requestConfig.params) {
    const paramString = qs.stringify(requestConfig.params);
    if (paramString) {
      url += (url.includes("?") ? "&" : "?") + paramString;
    }
  }

  const request = async () => {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, requestConfig.timeout || config.requestTimeout);

      const fetchOptions: RequestInit = {
        method: requestConfig.method || "GET",
        headers,
        signal: controller.signal,
      };

      // Add body for non-GET requests
      if (requestConfig.data && requestConfig.method && requestConfig.method.toUpperCase() !== "GET") {
        if (typeof requestConfig.data === "string") {
          fetchOptions.body = requestConfig.data;
        } else {
          fetchOptions.body = JSON.stringify(requestConfig.data);
          headers["Content-Type"] = headers["Content-Type"] || "application/json";
        }
      }

      // console.debug(
      //   `Request: ${fetchOptions.method} ${url} - Headers: ${JSON.stringify(fetchOptions.headers)} - Body: ${fetchOptions.body}`
      // );

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const result: ResponseData = {
        data,
        status: response.status,
        statusText: response.statusText,
      };

      return resultHandler(result);
    } catch (error: any) {
      return { error };
    }
  };

  let result;
  let resulterror;
  for (let i = 1; i <= config.requestAttempts; i += 1) {
    const { data, error } = await request();
    if (!error) {
      result = data;
      break;
    }

    // Handle fetch errors
    if (error.name === "AbortError") {
      resulterror = {
        from: "CLIENT_REQUEST",
        url,
        method: String(requestConfig.method || "GET").toUpperCase(),
        status: -1,
        code: "TIMEOUT",
        statusText: "Request timeout",
      };
    } else if (error instanceof TypeError && error.message.includes("fetch")) {
      resulterror = {
        from: "CLIENT_REQUEST",
        url,
        method: String(requestConfig.method || "GET").toUpperCase(),
        status: -1,
        code: "NETWORK_ERROR",
        statusText: error.message,
      };
    } else if (error.status) {
      // HTTP error response
      resulterror = {
        from: "SERVER_RESPONSE",
        url,
        method: String(requestConfig.method || "GET").toUpperCase(),
        status: error.status,
        code: "HTTP_ERROR",
        statusText: error.statusText || "HTTP Error",
      };

      // For client errors (4xx), don't retry and use resultHandler
      if (error.status >= 400 && error.status < 500) {
        try {
          resulterror = resultHandler({
            data: error.data,
            status: error.status,
            statusText: error.statusText,
          });
        } catch (handlerError) {
          resulterror = handlerError;
        }
        break;
      }
    } else {
      resulterror = {
        from: "CLIENT_REQUEST",
        url,
        method: String(requestConfig.method || "GET").toUpperCase(),
        status: -1,
        code: "UNKNOWN",
        statusText: error.message || "Unknown error",
      };
    }

    await sleep(1500);
  }

  if (cacheTTL && result && !resulterror) {
    addCache(requestConfig, result, cacheTTL);
  }

  removeRequestInProgress(requestConfig);

  if (!result && resulterror) {
    throw resulterror;
  }

  return result;
}

export default apiRequest;
