import {
  GenericID,
  GenericToken,
  ListTokenQuery,
  TokenCreateResponse,
  TokenData,
  TokenDataList,
} from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import {
  ConfigurationParams,
  DeviceCreateInfo,
  DeviceCreateResponse,
  DeviceInfo,
  DeviceQuery,
  DeviceListItem,
} from "./devices.types";

class Devices extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all devices from the account
   * @example
   * Default Query: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   *   resolveBucketName: false
   * }
   * @param query Search query params
   */
  list(query?: DeviceQuery): Promise<DeviceListItem[]> {
    const result = this.doRequest<DeviceListItem[]>({
      path: "/device",
      method: "GET",
      params: {
        page: query?.page || 1,
        fields: query?.fields || ["id", "name"],
        filter: query?.filter || {},
        amount: query?.amount || 20,
        orderBy: query?.orderBy ? `${query.orderBy[0]},${query.orderBy[1]}` : "name,asc",
        resolveBucketName: query?.resolveBucketName || false,
      },
    });

    return result;
  }

  /**
   * Create a Device
   * @param createParams Params of new device
   */
  create(createParams: DeviceCreateInfo): Promise<DeviceCreateResponse> {
    const result = this.doRequest<DeviceCreateResponse>({
      path: "/device",
      method: "POST",
      body: createParams,
    });

    return result;
  }

  /**
   * Edit the Device
   * @param deviceID Device ID
   * @param deviceObject Device object with fields to replace
   */
  edit(deviceID: GenericID, deviceObject: Partial<DeviceInfo>): Promise<string> {
    const result = this.doRequest<string>({
      path: `/device/${deviceID}`,
      method: "PUT",
      body: deviceObject,
    });

    return result;
  }

  /**
   * Delete the Device
   * @param deviceID Device ID
   */
  delete(deviceID: GenericID): Promise<string> {
    const result = this.doRequest<string>({
      path: `/device/${deviceID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Get Info of the Device
   * @param deviceID Device ID
   */
  info(deviceID: GenericID): Promise<DeviceInfo> {
    const result = this.doRequest<DeviceInfo>({
      path: `/device/${deviceID}`,
      method: "GET",
    });

    return result;
  }

  /**
   * Create or edit param for the Device
   * @param deviceID Device ID
   * @param data Configuration Data
   * @param paramID Parameter ID
   */
  paramSet(deviceID: GenericID, data: Partial<ConfigurationParams>, paramID?: GenericID): Promise<string> {
    const result = this.doRequest<string>({
      path: `/device/${deviceID}/params`,
      method: "POST",
      body: paramID
        ? {
            id: paramID,
            ...data,
          }
        : data,
    });

    return result;
  }

  /**
   * List Params for the Device
   * @param deviceID Device ID
   * @param sentStatus True return only sent=true, False return only sent=false
   */
  paramList(deviceID: GenericID, sentStatus?: Boolean): Promise<ConfigurationParams> {
    const result = this.doRequest<ConfigurationParams>({
      path: `/device/${deviceID}/params`,
      method: "GET",
      params: { sent_status: sentStatus },
    });

    return result;
  }

  /**
   * Remove param for the Device
   * @param deviceID Device ID
   * @param paramID Parameter ID
   */
  paramRemove(deviceID: GenericID, paramID: GenericID): Promise<string> {
    const result = this.doRequest<string>({
      path: `/device/${deviceID}/params/${paramID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Retrieves a list of all tokens
   * @example
   * Default Query: {
   *   page: 1,
   *   fields: ["name", "token", "permission"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "created_at,desc",
   * }
   * @param deviceID Device ID
   * @param query Search query params
   */
  tokenList(deviceID: GenericID, query?: ListTokenQuery): Promise<Partial<TokenDataList>[]> {
    const result = this.doRequest<Partial<TokenDataList>[]>({
      path: `/device/token/${deviceID}`,
      method: "GET",
      params: {
        page: query?.page || 1,
        fields: query?.fields || ["name", "token", "permission"],
        filter: query?.filter || {},
        amount: query?.amount || 20,
        orderBy: query?.orderBy ? `${query.orderBy[0]},${query.orderBy[1]}` : "created_at,desc",
      },
    });

    return result;
  }

  /**
   * Generates and retrieves a new token
   * @param deviceID Device ID
   * @param tokenParams Params for new token
   */
  tokenCreate(deviceID: GenericID, tokenParams: TokenData): Promise<TokenCreateResponse> {
    const result = this.doRequest<TokenCreateResponse>({
      path: `/device/token`,
      method: "POST",
      body: { device: deviceID, ...tokenParams },
    });

    return result;
  }

  /**
   * Delete a token
   * @param token Token
   */
  tokenDelete(token: GenericToken): Promise<string> {
    const result = this.doRequest<string>({
      path: `/device/token/${token}`,
      method: "DELETE",
    });

    return result;
  }
}

export default Devices;
