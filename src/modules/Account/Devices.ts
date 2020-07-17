import {
  GenericID,
  GenericToken,
  ListTokenQuery,
  TokenCreateResponse,
  TokenData,
  TokenDataList,
} from "../../common/comum.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { ConfigurationParams, DeviceCreateInfo, DeviceCreateResponse, DeviceInfo, DeviceQuery } from "./devices.types";

class Devices extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all devices from the account
   *
   * @param {DeviceQuery} [query] Search query params;
   * Default:{
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   *   resolveBucketName: false
   * }
   * @return {Promise<DeviceInfo[]>}
   * @memberof Device
   */
  list(query?: DeviceQuery): Promise<DeviceInfo[]> {
    const result = this.doRequest<DeviceInfo[]>({
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
   *
   * @param {DeviceCreateInfo} data New device info
   * @returns {Promise<DeviceCreateResponse>}
   * @memberof Device
   */
  create(data: DeviceCreateInfo): Promise<DeviceCreateResponse> {
    const result = this.doRequest<DeviceCreateResponse>({
      path: "/device",
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * Edit the Device
   *
   * @param {GenericID} deviceID Device identification
   * @param {Partial<DeviceInfo>} data Device info to change
   * @returns {Promise<string>} String with status
   * @memberof Device
   */
  edit(deviceID: GenericID, data: Partial<DeviceInfo>): Promise<string> {
    const result = this.doRequest<string>({
      path: `/device/${deviceID}`,
      method: "PUT",
      body: data,
    });

    return result;
  }

  /**
   * Delete the Device
   *
   * @param {GenericID} deviceID Device identification
   * @returns {Promise<string>} String with status
   * @memberof Device
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
   *
   * @param {GenericID} deviceID Device identification
   * @returns {Promise<DeviceInfo>}
   * @memberof Device
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
   *
   * @param {GenericID} deviceID Device identification
   * @param {Partial<ConfigurationParams>} data Param data to set
   * @param {GenericID} [paramID] Param id to edit if setted
   * @returns {Promise<string>}
   * @memberof Device
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
   *
   * @param {GenericID} deviceID Device identification
   * @param {Boolean} [sentStatus] Get only this status if setted
   * @returns {(Promise<ConfigurationParams>)}
   * @memberof Device
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
   *
   * @param {GenericID} deviceID Device identification
   * @param {GenericID} paramID Param identification
   * @returns {Promise<string>}
   * @memberof Device
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
   *
   * @param {GenericID} deviceID
   * @param {ListTokenQuery} [query] Search query params;
   * Default:{
   *   page: 1,
   *   fields: ["name", "token", "permission"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "created_at,desc",
   * }
   * @returns {Promise<Partial<TokenListResponse>[]>}
   * @memberof Token
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
   *
   * @param {GenericID} deviceID
   * @param {TokenData} data New Token info
   * @returns {Promise<TokenCreateResponse>} Token created info
   * @memberof Token
   */
  tokenCreate(deviceID: GenericID, data: TokenData): Promise<TokenCreateResponse> {
    const result = this.doRequest<TokenCreateResponse>({
      path: `/device/token`,
      method: "POST",
      body: { device: deviceID, ...data },
    });

    return result;
  }

  /**
   * Deletes a token
   *
   * @param {GenericToken} token Token
   * @returns {Promise<string>} String with status
   * @memberof Token
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
