import { AxiosRequestConfig, Method } from "axios";
import qs from "qs";
import apiRequest from "../infrastructure/apiRequest";
import regions, { Regions } from "../regions";
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
  maxContentLength?: number;
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
    maxContentLength: requestObj.maxContentLength,
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

    const result = await apiRequest(axiosObj, requestObj.cacheTTL);

    return result as Promise<TR>;
  }

  protected static async doRequestAnonymous<TR>(requestObj: doRequestParams, region?: Regions): Promise<TR> {
    const apiURI = regions(region)?.api;
    if (!apiURI) {
      throw new Error("Invalid region");
    }

    const axiosObj = mountAxiosRequest(apiURI, requestObj);

    const result = await apiRequest(axiosObj, requestObj.cacheTTL);

    return result as Promise<TR>;
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
