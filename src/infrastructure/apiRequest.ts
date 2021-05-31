import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import config from "../config";
import sleep from "../common/sleep";
import isBrowser from "./isBrowser";
import envParams from "./envParams.json";
import { addRequestInProgress, isRequestInProgress, removeRequestInProgress } from "../common/RequestInProgress";
import { addCache, getCache } from "../common/Cache";

/**
 * Handle the TagoIO Response
 * @internal
 * @param result Axios Result
 */
function resultHandler(result: AxiosResponse) {
  if (!result.data) {
    throw result.statusText;
  }

  if (result.status === 200 && result.config.url.includes("/data/export")) {
    return { data: result.data };
  }

  if (result.data.status !== true) {
    return result.data.message || result.data.result || result.data;
  }

  return { data: result.data.result };
}

/**
 * Handle all request to TagoIO API
 * @internal
 * @param axiosObj Axios Object
 */
async function apiRequest(axiosObj: AxiosRequestConfig, cacheTTL?: number): Promise<any> {
  if (cacheTTL) {
    if (isRequestInProgress(axiosObj)) {
      await sleep(100);
      return apiRequest(axiosObj, cacheTTL);
    }

    const objCached = getCache(axiosObj);
    if (objCached) {
      return objCached;
    }
  }

  addRequestInProgress(axiosObj);

  axiosObj.timeout = config.requestTimeout;

  if (isBrowser()) {
    // Prevent cache on Browsers
    axiosObj.headers = {
      ...axiosObj.headers,
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    };
  } else if (typeof process !== "undefined") {
    const banner = !process.env.TAGO_RUNTIME
      ? `(External; Node.js/${process.version} ${process.platform}/${process.arch})`
      : `(Running at TagoIO)`;

    axiosObj.headers = {
      ...axiosObj.headers,
      "User-Agent": `TagoIO-SDK|JS|${envParams.version} ${banner}`,
    };
  }

  const request = () => {
    return axios(axiosObj)
      .then(resultHandler)
      .catch((error) => ({ error }));
  };

  let result;
  let resulterror;
  for (let i = 1; i <= config.requestAttempts; i += 1) {
    const { data, error } = await request();
    if (!error) {
      result = data;
      break;
    }

    if (error.response) {
      resulterror = {
        from: "SERVER_RESPONSE",
        url: error.config.url,
        method: String(error.config.method).toUpperCase(),
        status: error.response.status,
        code: error.code || "UNKNOWN",
        statusText: error.response.statusText,
      };
    } else {
      resulterror = {
        from: "CLIENT_REQUEST",
        url: error.config.url,
        method: String(error.config.method).toUpperCase(),
        status: -1,
        code: error.code || "UNKNOWN",
        statusText: "UNKNOWN",
      };
    }

    // ? Requests with client errors not retry.
    if (error.response && (error.response.status >= 400 || error.response.status < 500)) {
      resulterror = resultHandler(error.response);
      break;
    }

    await sleep(1500);
  }

  if (cacheTTL && result && !resulterror) {
    addCache(axiosObj, result, cacheTTL);
  }

  removeRequestInProgress(axiosObj);

  if (!result && resulterror) {
    throw resulterror;
  }

  return result;
}

export default apiRequest;
