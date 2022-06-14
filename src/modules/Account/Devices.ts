import type {
  Data,
  DataEdit,
  GenericID,
  GenericToken,
  TokenCreateResponse,
  TokenData,
} from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import type { DataQuery } from "../Device/device.types";
import dateParser from "../Utils/dateParser";
import type {
  ConfigurationParams,
  DeviceCreateInfo,
  DeviceCreateResponse,
  DeviceInfo,
  DeviceQuery,
  DeviceListItem,
  DeviceTokenDataList,
  ListDeviceTokenQuery,
  DeviceEditInfo,
  DeviceChunkData,
  DeviceChunkParams,
  DeviceChunkCopyResponse,
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
  public async edit(deviceID: GenericID, deviceObj: DeviceEditInfo): Promise<string> {
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

    result = dateParser(result, [
      "last_input",
      "last_output",
      "updated_at",
      "created_at",
      "inspected_at",
      "last_retention",
    ]);

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

  /**
   * Get data from all variables in the device.
   *
   * @param deviceId Device ID.
   * @param queryParams Query parameters to filter the results.
   *
   * @returns Array with the data values stored in the device.
   *
   * @example
   * ```ts
   * const myDevice = new Device({ token: "my_device_token" });
   *
   * const lastTenValues = await myDevice.getVariablesData("myDeviceId", { qty: 10 });
   * ```
   */
  public async getDeviceData(deviceId: GenericID, queryParams?: DataQuery): Promise<Data[]> {
    const result = await this.doRequest<Data[]>({
      path: `/device/${deviceId}/data`,
      method: "GET",
      params: queryParams,
    });

    return result.map((item) => dateParser(item, ["time", "created_at"]));
  }

  /**
   * Empty all data in a device.
   *
   * @param deviceId Device ID.
   *
   * @returns Success message.
   */
  public async emptyDeviceData(deviceId: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceId}/empty`,
      method: "POST",
    });

    return result;
  }

  /**
   * Edit data records in a device using the profile token and device ID.
   *
   * The `updatedData` can be a single data record or an array of records to be updated,
   * each of the records must have the `id` of the record and the fields to be updated.
   *
   * @param deviceId Device ID.
   * @param updatedData A single or an array of updated data records.
   *
   * @returns Success message indicating amount of records updated (can be 0).
   *
   * @example
   * ```ts
   * const myDevice = new Device({ token: "my_device_token" });
   *
   * await myDevice.editDeviceData("myDeviceId", { id: "idOfTheRecord", value: "new value", unit: "new unit" });
   * ```
   */
  public async editDeviceData(deviceId: GenericID, updatedData: DataEdit | DataEdit[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceId}/data`,
      method: "PUT",
      body: updatedData,
    });

    return result;
  }

  /**
   * Delete data records in a device using the profile token and device ID.
   *
   * See the example to understand how to use this method properly to have full control on what to delete.
   *
   * ! If query parameters are empty, all data for the device will be deleted.
   *
   * @param deviceId Device ID.
   * @param queryParams Parameters to specify what should be deleted on the device's data.
   *
   * @returns Success message indicating amount of records deleted (can be 0).
   *
   * @example
   * ```ts
   * const myDevice = new Device({ token: "my_device_token" });
   *
   * await myDevice.deleteDeviceData("myDeviceId", { ids: ["recordIdToDelete", "anotherRecordIdToDelete" ] });
   * ```
   */
  public async deleteDeviceData(deviceId: GenericID, queryParams?: DataQuery): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceId}/data`,
      method: "DELETE",
      params: queryParams,
    });

    return result;
  }

  /**
   * Get Info of the Device Chunks.
   * @experimental
   * @param deviceID Device ID
   */
  public async getChunk(deviceID: GenericID): Promise<DeviceChunkData[]> {
    const result = await this.doRequest<DeviceChunkData[]>({
      path: `/device/${deviceID}/chunk`,
      method: "GET",
    });

    return result;
  }

  /**
   * Delete the chunk data.
   * @experimental
   * @param deviceID Device ID
   * @param chunkID Chunk ID
   */
  public async deleteChunk(deviceID: GenericID, chunkID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceID}/chunk/${chunkID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Schedule to export the Device Chunk's data to the TagoIO's files.
   * @experimental
   */
  public async copyChunk(params: DeviceChunkParams): Promise<DeviceChunkCopyResponse> {
    const body = {
      chunk_id: params?.chunkID,
      headers: params?.headers,
      file_address: params?.file_address,
    };

    const result = await this.doRequest<DeviceChunkCopyResponse>({
      path: `/device/${params?.deviceID}/chunk/copy`,
      method: "POST",
      body,
    });

    return result;
  }
}

export default Devices;
