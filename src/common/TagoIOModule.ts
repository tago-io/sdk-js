import { AxiosRequestConfig, Method } from "axios";
import qs from "qs";
import apiRequest from "../infrastructure/apiRequest";
import regions, { Regions } from "../regions";
import { addCache, getCache, removeRequestInprogress } from "./Cache";
import { RefType, GenericID } from "./common.types";

interface GenericModuleParams {
  token?: string;
  region?: Regions;
  // options?: Object;
}

interface ShareModuleParams extends GenericModuleParams {
  type: RefType;
}

interface TokenModuleParams extends GenericModuleParams {
  path: string;
  id?: GenericID;
}

interface ConnectorModuleParams extends GenericModuleParams {
  details?: boolean;
}

interface AuthorizationModuleParams extends GenericModuleParams {
  details?: boolean;
}

/**
 * Object for generate request params
 * @internal
 */
interface doRequestParams {
  path: string;
  method: Method;
  body?: any;
  params?: any;
  headers?: any;
  overwriteAxiosConfig?: AxiosRequestConfig;
  /**
   * Cache for request
   * default: false (disabled)
   */
  cacheTTL?: number;
}

/**
 * Create a Object for Axios
 * @internal
 * @param uri URI
 * @param requestObj doRequestParams
 */
function mountAxiosRequest(uri: string, requestObj: doRequestParams): AxiosRequestConfig {
  const axiosObj: AxiosRequestConfig = {
    url: `${uri}${requestObj.path}`,
    method: requestObj.method,
    data: requestObj.body,
    params: requestObj.params,
    paramsSerializer: (p) => qs.stringify(p),
    headers: {
      ...requestObj.headers,
    },
    ...requestObj.overwriteAxiosConfig,
  };

  return axiosObj;
}

/**
 * Abstract class to wrap all TagoIO SDK Modules
 * @internal
 */
abstract class TagoIOModule<T extends GenericModuleParams> {
  protected params = {} as T;

  constructor(params: T) {
    this.params = params;

    this.validateParams();
  }

  private validateParams() {
    if (!this.params) {
      throw new Error("Invalid Params");
    }

    if (!this.params.token) {
      throw new Error("Invalid Token");
    }

    // if (this.params.options && typeof this.params.options !== "object") {
    //   throw new Error("Invalid Params");
    // }
  }

  protected async doRequest<TR>(requestObj: doRequestParams): Promise<TR> {
    const apiURI = regions(this.params.region)?.api;
    if (!apiURI) {
      throw new Error("Invalid region");
    }

    const axiosObj = mountAxiosRequest(apiURI, requestObj);
    axiosObj.headers = {
      token: this.params.token,
      ...axiosObj.headers,
    };

    const cacheKey = JSON.stringify(axiosObj);
    const objCached = requestObj.cacheTTL ? await getCache(cacheKey) : null;
    if (objCached) {
      return Promise.resolve<TR>(objCached);
    }

    let result;

    try {
      result = apiRequest(axiosObj);
    } catch (error) {
      removeRequestInprogress(cacheKey);
      return Promise.reject(error);
    }

    if (requestObj.cacheTTL) {
      addCache(cacheKey, result, requestObj.cacheTTL);
    }

    return result as Promise<TR>;
  }

  protected static doRequestAnonymous<TR>(requestObj: doRequestParams, region?: Regions): Promise<TR> {
    const apiURI = regions(region)?.api;
    if (!apiURI) {
      throw new Error("Invalid region");
    }

    const axiosObj = mountAxiosRequest(apiURI, requestObj);

    const cacheKey = JSON.stringify(axiosObj);
    const objCached = requestObj.cacheTTL ? getCache(cacheKey) : null;
    if (objCached) {
      return Promise.resolve<TR>(objCached);
    }

    return apiRequest(axiosObj).then((r) => {
      if (requestObj.cacheTTL) {
        addCache(cacheKey, r, requestObj.cacheTTL);
      }

      return r as TR;
    });
  }
}

export default TagoIOModule;
export {
  GenericModuleParams,
  ShareModuleParams,
  doRequestParams,
  TokenModuleParams,
  ConnectorModuleParams,
  AuthorizationModuleParams,
};
