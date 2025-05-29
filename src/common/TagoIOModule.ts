import apiRequest from "../infrastructure/apiRequest";
import regions, { Regions, RegionsObj } from "../regions";
import { RefType, GenericID, RequestConfig } from "./common.types";

interface GenericModuleParams {
  token?: string;
  region?: Regions | RegionsObj;
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
  method: string;
  body?: any;
  params?: any;
  headers?: any;
  overwriteRequestConfig?: RequestConfig;
  maxContentLength?: number;
  /**
   * Cache for request
   * default: false (disabled)
   */
  cacheTTL?: number;
}

/**
 * Create a Object for Request
 * @internal
 * @param uri URI
 * @param requestObj doRequestParams
 */
function mountRequestConfig(uri: string, requestObj: doRequestParams): RequestConfig {
  const requestConfig: RequestConfig = {
    url: `${uri}${requestObj.path}`,
    method: requestObj.method,
    data: requestObj.body,
    params: requestObj.params,
    headers: {
      ...requestObj.headers,
    },
    ...requestObj.overwriteRequestConfig,
  };

  return requestConfig;
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

    const requestConfig = mountRequestConfig(apiURI, requestObj);
    requestConfig.headers = {
      token: this.params.token,
      ...requestConfig.headers,
    };

    const result = await apiRequest(requestConfig, requestObj.cacheTTL);

    return result as Promise<TR>;
  }

  protected static async doRequestAnonymous<TR>(
    requestObj: doRequestParams,
    region?: Regions | RegionsObj
  ): Promise<TR> {
    const apiURI = regions(region)?.api;
    if (!apiURI) {
      throw new Error("Invalid region");
    }

    const requestConfig = mountRequestConfig(apiURI, requestObj);

    const result = await apiRequest(requestConfig, requestObj.cacheTTL);

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
