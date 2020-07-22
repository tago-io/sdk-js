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
interface doRequestParams {
  path: string;
  method: Method;
  body?: any;
  params?: any;
  headers?: any;
  overwriteAxiosConfig?: AxiosRequestConfig;
}

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

  protected doRequest<TR>(requestObj: doRequestParams): Promise<TR> {
    const apiURI = regions(this.params.region)?.api;
    if (!apiURI) {
      throw new Error("Invalid region");
    }

    const axiosObj = mountAxiosRequest(apiURI, requestObj);
    axiosObj.headers = {
      token: this.params.token,
      ...axiosObj.headers,
    };

    return apiRequest(axiosObj) as Promise<TR>;
  }

  protected static doRequestAnonymous<TR>(requestObj: doRequestParams, region?: Regions): Promise<TR> {
    const apiURI = regions(region)?.api;
    if (!apiURI) {
      throw new Error("Invalid region");
    }

    const axiosObj = mountAxiosRequest(apiURI, requestObj);

    return apiRequest(axiosObj) as Promise<TR>;
  }
}

export default TagoIOModule;
export { GenericModuleParams, ShareModuleParams, doRequestParams, TokenModuleParams };