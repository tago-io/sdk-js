/**
 * CommonJS-compatible fetch utilities to replace fetch-extras
 * This maintains backward compatibility while avoiding ESM-only dependencies
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
  if (!(responseOrPromise instanceof Response)) {
    responseOrPromise = await responseOrPromise;
  }

  if (!responseOrPromise.ok) {
    throw new HttpError(responseOrPromise);
  }

  return responseOrPromise;
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
