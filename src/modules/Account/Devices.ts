import { GenericID, GenericToken, TokenCreateResponse, TokenData } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import {
  ConfigurationParams,
  DeviceCreateInfo,
  DeviceCreateResponse,
  DeviceInfo,
  DeviceQuery,
  DeviceListItem,
  DeviceTokenDataList,
  ListDeviceTokenQuery,
} from "./devices.types";

class Devices extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all devices from the account
   * @default
   * queryObj: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   *   resolveBucketName: false
   * }
   * @param queryObj Search query params
   */
  public async list(queryObj?: DeviceQuery): Promise<DeviceListItem[]> {
    let result = await this.doRequest<DeviceListItem[]>({
      path: "/device",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "name"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
        resolveBucketName: queryObj?.resolveBucketName || false,
      },
    });

    result = result.map((data) =>
      dateParser(data, ["last_input", "last_output", "updated_at", "created_at", "inspected_at"])
    );

    return result;
  }

  /**
   * Generates and retrieves a new action from the Device
   * @param deviceObj Object data to create new device
   */
  public async create(deviceObj: DeviceCreateInfo): Promise<DeviceCreateResponse> {
    const result = await this.doRequest<DeviceCreateResponse>({
      path: "/device",
      method: "POST",
      body: deviceObj,
    });

    return result;
  }

  /**
   * Modify any property of the device
   * @param deviceID Device ID
   * @param deviceObj Device object with fields to replace
   */
  public async edit(deviceID: GenericID, deviceObj: Partial<DeviceInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceID}`,
      method: "PUT",
      body: deviceObj,
    });

    return result;
  }

  /**
   * Deletes an device from the account
   * @param deviceID Device ID
   */
  public async delete(deviceID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Get Info of the Device
   * @param deviceID Device ID
   */
  public async info(deviceID: GenericID): Promise<DeviceInfo> {
    let result = await this.doRequest<DeviceInfo>({
      path: `/device/${deviceID}`,
      method: "GET",
    });

    result = dateParser(result, ["last_input", "last_output", "updated_at", "created_at", "inspected_at"]);

    return result;
  }

  /**
   * Create or edit param for the Device
   * @param deviceID Device ID
   * @param configObj Configuration Data
   * @param paramID Parameter ID
   */
  public async paramSet(
    deviceID: GenericID,
    configObj: Partial<ConfigurationParams>,
    paramID?: GenericID
  ): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceID}/params`,
      method: "POST",
      body: paramID
        ? {
            id: paramID,
            ...configObj,
          }
        : configObj,
    });

    return result;
  }

  /**
   * List Params for the Device
   * @param deviceID Device ID
   * @param sentStatus True return only sent=true, False return only sent=false
   */
  public async paramList(deviceID: GenericID, sentStatus?: Boolean): Promise<ConfigurationParams[]> {
    const result = await this.doRequest<ConfigurationParams[]>({
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
  public async paramRemove(deviceID: GenericID, paramID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceID}/params/${paramID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Retrieves a list of all tokens
   * @default
   * queryObj: {
   *   page: 1,
   *   fields: ["name", "token", "permission"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "created_at,desc",
   * }
   * @param deviceID Device ID
   * @param queryObj Search query params
   */

  public async tokenList(
    deviceID: GenericID,
    queryObj?: ListDeviceTokenQuery
  ): Promise<Partial<DeviceTokenDataList>[]> {
    let result = await this.doRequest<Partial<DeviceTokenDataList>[]>({
      path: `/device/token/${deviceID}`,
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["name", "token", "permission"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "created_at,desc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "last_authorization", "expire_time"]));

    return result;
  }

  /**
   * Generates and retrieves a new token
   * @param deviceID Device ID
   * @param tokenParams Params for new token
   */
  public async tokenCreate(deviceID: GenericID, tokenParams: TokenData): Promise<TokenCreateResponse> {
    let result = await this.doRequest<TokenCreateResponse>({
      path: `/device/token`,
      method: "POST",
      body: { device: deviceID, ...tokenParams },
    });

    result = dateParser(result, ["expire_date"]);

    return result;
  }

  /**
   * Delete a token
   * @param token Token
   */
  public async tokenDelete(token: GenericToken): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/token/${token}`,
      method: "DELETE",
    });

    return result;
  }
}

export default Devices;
