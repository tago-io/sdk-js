import { AxiosRequestConfig, Method } from "axios";
import qs from "qs";
import apiRequest from "../infraestrucure/apiRequest";
import regions, { Regions } from "../regions";

interface GenericModuleParams {
  token?: string;
  region?: Regions;
  options?: Object;
}

interface doRequestParams {
  path: string;
  method: Method;
  body?: any;
  params?: any;
  overwriteAxiosConfig?: AxiosRequestConfig;
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

    if (!this.params.region) {
      throw new Error("Invalid Region");
    }

    if (this.params.options && typeof this.params.options !== "object") {
      throw new Error("Invalid Params");
    }
  }

  protected doRequest<TR>(requestObj: doRequestParams): Promise<TR> {
    const region = regions[this.params.region]?.api;
    if (!region) {
      throw new Error("Invalid region");
    }

    const axiosObj: AxiosRequestConfig = {
      url: `${region}${requestObj.path}`,
      method: requestObj.method,
      data: requestObj.body,
      params: requestObj.params,
      paramsSerializer: (p) => qs.stringify(p),
      headers: {
        token: this.params.token,
      },
      ...requestObj.overwriteAxiosConfig,
    };

    return apiRequest(axiosObj) as Promise<TR>;
  }
}

export default TagoIOModule;
export { GenericModuleParams, doRequestParams };
