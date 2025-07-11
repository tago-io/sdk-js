/**
 * CommonJS-compatible fetch utilities to replace fetch-extras
 * This maintains backward compatibility while avoiding ESM-only dependencies
 *
 * Original implementation: https://github.com/sindresorhus/fetch-extras
 * This is a CommonJS-compatible reimplementation of the fetch-extras functionality
 * to avoid ESM-only dependency issues while maintaining full API compatibility.
 */

export class HttpError extends Error {
  public code: string;
  public response: Response;

  constructor(response: Response) {
    const status = `${response.status} ${response.statusText}`.trim();
    const reason = status ? `status code ${status}` : 'an unknown error';

    super(`Request failed with ${reason}: ${response.url}`);
    // Capture stack trace if available (Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'HttpError';
    this.code = 'ERR_HTTP_RESPONSE_NOT_OK';
    this.response = response;
  }
}

/**
 * Throws HttpError if response is not ok
 */
export async function throwIfHttpError(responseOrPromise: Response | Promise<Response>): Promise<Response> {
  let response: Response;

  if (!(responseOrPromise instanceof Response)) {
    response = await responseOrPromise;
  } else {
    response = responseOrPromise;
  }

  if (!response.ok) {
    throw new HttpError(response);
  }

  return response;
}

/**
 * Wraps fetch with HTTP error handling
 */
export function withHttpError(fetchFunction: typeof fetch): typeof fetch {
  return async (urlOrRequest: RequestInfo | URL, options: RequestInit = {}) => {
    const response = await fetchFunction(urlOrRequest, options);
    return throwIfHttpError(response);
  };
}

/**
 * Wraps fetch with timeout functionality
 */
export function withTimeout(fetchFunction: typeof fetch, timeout: number): typeof fetch {
  return async (urlOrRequest: RequestInfo | URL, options: RequestInit = {}) => {
    const providedSignal = options.signal ?? (urlOrRequest instanceof Request && urlOrRequest.signal);

    // Use AbortSignal.timeout if available (Node.js 18+), otherwise fallback to manual timeout
    let timeoutSignal: AbortSignal;
    if (typeof AbortSignal.timeout === 'function') {
      timeoutSignal = AbortSignal.timeout(timeout);
    } else {
      // Fallback for older Node.js versions
      const controller = new AbortController();
      setTimeout(() => controller.abort(), timeout);
      timeoutSignal = controller.signal;
    }

    const signal = providedSignal ? AbortSignal.any([providedSignal, timeoutSignal]) : timeoutSignal;
    return fetchFunction(urlOrRequest, { ...options, signal });
  };
}
