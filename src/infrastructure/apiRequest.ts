import { HttpError, withHttpError, withTimeout } from "fetch-extras";
import qs from "qs";
import { addCache, getCache } from "../common/Cache";
import { addRequestInProgress, isRequestInProgress, removeRequestInProgress } from "../common/RequestInProgress";
import type { RequestConfig } from "../common/common.types";
import sleep from "../common/sleep";
import config from "../config";
import envParams from "./envParams.json";
import isBrowser from "./isBrowser";

interface ResponseData {
  data: any;
  status: number;
  statusText: string;
}

interface ErrorResult {
  from: "CLIENT_REQUEST" | "SERVER_RESPONSE";
  url: string;
  method: string;
  status: number;
  code: "TIMEOUT" | "NETWORK_ERROR" | "HTTP_ERROR" | "UNKNOWN";
  statusText: string;
}

interface RequestResult {
  error: any;
}

/**
 * Checks if the given object is an error result from the request function
 */
function isErrorResult(result: any): result is RequestResult {
  return typeof result === "object" && result !== null && "error" in result && Object.keys(result).length === 1;
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

  // If status is not true, return the message/result/data directly
  if (result.data.status !== true) {
    return result.data.message || result.data.result || result.data;
  }

  return result.data.result;
}

/**
 * Prepares request headers with appropriate cache and user-agent settings
 */
function prepareHeaders(requestHeaders: Record<string, string> = {}): Record<string, string> {
  let headers = { ...requestHeaders };

  if (isBrowser()) {
    headers = {
      ...headers,
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    };
  } else if (typeof process !== "undefined") {
    const banner =
      process.env.T_ANALYSIS_CONTEXT === "tago-io"
        ? "(Running at TagoIO)"
        : `(External; Node.js/${process.version} ${process.platform}/${process.arch})`;

    headers = {
      ...headers,
      "User-Agent": `TagoIO-SDK|JS|${envParams.version} ${banner}`,
    };
  }

  return headers;
}

/**
 * Builds the full URL with query parameters
 */
function buildUrl(baseUrl: string, params?: Record<string, any>): string {
  let url = baseUrl || "";

  if (params) {
    const paramString = qs.stringify(params);
    if (paramString) {
      url += (url.includes("?") ? "&" : "?") + paramString;
    }
  }

  return url;
}

/**
 * Prepares fetch options for the request
 */
function prepareFetchOptions(requestConfig: RequestConfig, headers: Record<string, string>): RequestInit {
  const fetchOptions: RequestInit = {
    method: requestConfig.method || "GET",
    headers,
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

  return fetchOptions;
}

/**
 * Extracts and parses response data based on content type
 */
async function extractResponseData(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return await response.json();
  }

  return await response.text();
}

/**
 * Attempts to extract error data from HttpError response
 */
async function extractHttpErrorData(error: HttpError): Promise<any> {
  try {
    const errorText = await error.response.clone().text();
    try {
      return JSON.parse(errorText);
    } catch {
      return errorText;
    }
  } catch {
    return null;
  }
}

/**
 * Creates an error result object with standardized properties
 */
function createErrorResult(
  type: ErrorResult["from"],
  code: ErrorResult["code"],
  url: string,
  method: string,
  status: number,
  statusText: string
): ErrorResult {
  return {
    from: type,
    url,
    method: String(method).toUpperCase(),
    status,
    code,
    statusText,
  };
}

/**
 * Handles timeout errors
 */
function handleTimeoutError(url: string, method: string): ErrorResult {
  return createErrorResult("CLIENT_REQUEST", "TIMEOUT", url, method, -1, "Request timeout");
}

/**
 * Handles network errors (fetch failures)
 */
function handleNetworkError(error: TypeError, url: string, method: string): ErrorResult {
  // Normalize different fetch error messages to "fetch failed" for consistency
  const statusText =
    error.message?.includes("fetch") || error.message?.includes("Failed to fetch") ? "fetch failed" : error.message;
  return createErrorResult("CLIENT_REQUEST", "NETWORK_ERROR", url, method, -1, statusText);
}

/**
 * Handles HTTP errors from fetch-extras or server responses
 */
async function handleHttpError(
  error: HttpError | ServerErrorResponse<any> | any,
  url: string,
  method: string
): Promise<{ errorResult: ErrorResult | any; shouldBreak: boolean }> {
  const status = error instanceof HttpError ? error.response.status : error.status;
  const statusText = error instanceof HttpError ? error.response.statusText : error.statusText || "HTTP Error";

  let errorData: any;
  if (error instanceof HttpError) {
    errorData = await extractHttpErrorData(error);
  } else {
    errorData = error.data;
  }

  const errorResult = createErrorResult("SERVER_RESPONSE", "HTTP_ERROR", url, method, status, statusText);

  // For client errors (4xx), don't retry and use resultHandler
  if (status >= 400 && status < 500) {
    try {
      const handledError = resultHandler({
        data: errorData,
        status,
        statusText,
      });
      return { errorResult: handledError, shouldBreak: true };
    } catch (handlerError) {
      return { errorResult: handlerError, shouldBreak: true };
    }
  }

  return { errorResult, shouldBreak: false };
}

/**
 * Handles unknown errors
 */
function handleUnknownError(error: any, url: string, method: string): ErrorResult {
  return createErrorResult("CLIENT_REQUEST", "UNKNOWN", url, method, -1, error?.message || "Unknown error");
}

/**
 * Classifies and handles different types of errors
 */
async function handleError(
  error: any,
  url: string,
  method: string
): Promise<{ errorResult: ErrorResult | any; shouldBreak: boolean }> {
  // Check for timeout errors
  if (error?.name === "AbortError" || error?.message?.includes("timeout")) {
    return { errorResult: handleTimeoutError(url, method), shouldBreak: false };
  }

  // Check for network errors
  if (error instanceof TypeError && (error.message?.includes("fetch") || error.message?.includes("Failed to fetch"))) {
    return { errorResult: handleNetworkError(error, url, method), shouldBreak: false };
  }

  // Check for HTTP errors
  if (error instanceof HttpError || error instanceof ServerErrorResponse || error.status) {
    return await handleHttpError(error, url, method);
  }

  // Handle unknown errors
  return { errorResult: handleUnknownError(error, url, method), shouldBreak: false };
}

/**
 * Performs a single HTTP request attempt
 */
async function performRequest(
  url: string,
  requestConfig: RequestConfig,
  headers: Record<string, string>
): Promise<any | RequestResult> {
  try {
    const enhancedFetch = withHttpError(withTimeout(fetch, requestConfig.timeout || config.requestTimeout));
    const fetchOptions = prepareFetchOptions(requestConfig, headers);

    const response = await enhancedFetch(url, fetchOptions);
    const data = await extractResponseData(response);

    const result: ResponseData = {
      data,
      status: response.status,
      statusText: response.statusText,
    };

    try {
      return resultHandler(result);
    } catch (handlerError) {
      // If resultHandler throws, it's expected behavior (non-JSON, empty data, etc.)
      // We should throw it directly, not wrap it as an error result
      // biome-ignore lint/complexity/noUselessCatch: This is intentional to handle specific cases
      throw handlerError;
    }
  } catch (error: any) {
    // Only wrap actual network/fetch errors, not handler errors
    if (typeof error === "string") {
      // This is likely from resultHandler, throw it directly
      throw error;
    }
    return { error };
  }
}

class ServerErrorResponse<ErrorData extends { message?: string }> extends Error {
  constructor(
    public data: ErrorData,
    public status: number,
    public statusText: string
  ) {
    super(data.message || "Received an error from the server");
    this.name = "ServerErrorResponse";
  }
}

/**
 * Handle all request to TagoIO API
 * @internal
 * @param requestConfig Request Configuration Object
 */
async function apiRequest(requestConfig: RequestConfig, cacheTTL?: number): Promise<any> {
  // Handle caching
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

  // Prepare request components
  const headers = prepareHeaders(requestConfig.headers);
  const url = buildUrl(requestConfig.url, requestConfig.params);

  let result: any;
  let resulterror: any;

  // Retry loop
  for (let i = 1; i <= config.requestAttempts; i += 1) {
    const requestResult = await performRequest(url, requestConfig, headers);

    if (isErrorResult(requestResult)) {
      const { errorResult, shouldBreak } = await handleError(requestResult.error, url, requestConfig.method || "GET");

      resulterror = errorResult;

      if (shouldBreak) {
        break;
      }
    } else {
      // Success case
      result = requestResult;
      break;
    }

    // Wait before retry (except on last attempt)
    if (i < config.requestAttempts) {
      await sleep(1500);
    }
  }

  // Handle caching for successful results
  if (cacheTTL && result && !resulterror) {
    addCache(requestConfig, result, cacheTTL);
  }

  removeRequestInProgress(requestConfig);

  // Throw error if no successful result
  if (!result && resulterror) {
    throw resulterror;
  }

  return result;
}

export default apiRequest;
