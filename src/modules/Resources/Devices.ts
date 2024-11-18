import type {
  Data,
  DataCreate,
  DataEdit,
  GenericID,
  GenericToken,
  TokenCreateResponse,
  TokenData,
} from "../../common/common.types";
import { chunk } from "../../common/chunk";
import sleep from "../../common/sleep";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";

import type { DataQuery, DataQueryStreaming, OptionsStreaming } from "../Device/device.types";
import type {
  ConfigurationParams,
  DeviceChunkCopyResponse,
  DeviceChunkData,
  DeviceChunkParams,
  DeviceCreateInfo,
  DeviceCreateResponse,
  DeviceDataBackup,
  DeviceDataBackupResponse,
  DeviceDataRestore,
  DeviceEditInfo,
  DeviceInfo,
  DeviceListItem,
  DeviceQuery,
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
   *   resolveConnectorName: false
   * }
   * @param queryObj Search query params
   */
  public async list<T extends DeviceQuery>(queryObj?: T) {
    let result = await this.doRequest<
      DeviceListItem<T["fields"] extends DeviceQuery["fields"] ? T["fields"][number] : "id" | "name">[]
    >({
      path: "/device",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "name", "tags"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
        resolveBucketName: queryObj?.resolveBucketName || false,
        resolveConnectorName: queryObj?.resolveConnectorName || false,
        serial: queryObj?.serial,
      },
    });

    result = result.map((data) => dateParser(data, ["last_input", "updated_at", "created_at"]));

    return result;
  }

  /**
   * Get a Streaming list of Devices from the account
   *
   * @experimental
   * @param queryObj Search query params
   * @param options Stream options
   * @example
   * ```js
   * for await (const items of Resources.devices.listStreaming({ name: "*sensor*" })) {
   *  console.log(items);
   * }
   * ```
   */
  public async *listStreaming(queryObj?: Omit<DeviceQuery, "page" | "amount">, options?: OptionsStreaming) {
    const poolingRecordQty = options?.poolingRecordQty || 1000;
    const poolingTime = options?.poolingTime || 500; // 500 ms

    if (poolingRecordQty > 1000) {
      throw new Error("The maximum of poolingRecordQty is 1000");
    }

    // API will divide the poolingRecordQty by the number of variables
    const amount: number = Math.ceil(poolingRecordQty);
    let page: number = 0;
    let stop: boolean = false;

    while (!stop) {
      await sleep(poolingTime);

      const foundDevices = await this.list({
        ...queryObj,
        amount,
        page,
      });
      page += 1;

      stop = foundDevices.length < amount;

      yield foundDevices;
    }
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

    result = dateParser(result, ["last_input", "updated_at", "created_at"]);

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
    configObj: Partial<ConfigurationParams> | Partial<ConfigurationParams>[],
    paramID?: GenericID
  ): Promise<string> {
    let body = configObj;
    if (paramID && !Array.isArray(configObj)) {
      body = {
        id: paramID,
        ...configObj,
      };
    }

    const result = await this.doRequest<string>({
      path: `/device/${deviceID}/params`,
      method: "POST",
      body,
    });

    return result;
  }

  /**
   * List Params for the Device
   * @param deviceID Device ID
   * @param sentStatus True return only sent=true, False return only sent=false
   */
  public async paramList(deviceID: GenericID, sentStatus?: Boolean): Promise<Required<ConfigurationParams>[]> {
    const result = await this.doRequest<Required<ConfigurationParams>[]>({
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

  public async tokenList<T extends ListDeviceTokenQuery>(deviceID: GenericID, queryObj?: T) {
    let result = await this.doRequest<
      DeviceTokenDataList<
        T["fields"] extends ListDeviceTokenQuery["fields"] ? T["fields"][number] : "token" | "name" | "permission"
      >[]
    >({
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
   * Get amount of data stored in the Device.
   *
   * @param deviceID Device ID
   */
  public async amount(deviceID: GenericID): Promise<number> {
    const result = await this.doRequest<number>({
      path: `/device/${deviceID}/data_amount`,
      method: "GET",
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
   * const lastTenValues = await Resources.devices.getDeviceData("myDeviceId", { qty: 10 });
   * ```
   */
  public async getDeviceData(deviceId: GenericID, queryParams?: DataQuery): Promise<Data[]> {
    if (queryParams?.query === "default") {
      delete queryParams.query;
    }

    let result = await this.doRequest<Data[] | number>({
      path: `/device/${deviceId}/data`,
      method: "GET",
      params: queryParams,
    });

    if (typeof result === "number") {
      result = [
        {
          id: "none",
          origin: "?",
          time: new Date(),
          value: result,
          variable: "?",
        },
      ] as Data[];
    }

    return result.map((item) => dateParser(item, ["time", "created_at"]));
  }

  /**
   * Get Data Streaming
   *
   * @experimental
   * @param deviceId Device ID
   * @param params Data Query
   * @param options Stream options
   * @example
   * ```js
   * for await (const items of Resources.devices.getDeviceDataStreaming("myDeviceId")) {
   *  console.log(items);
   * }
   * ```
   */
  public async *getDeviceDataStreaming(deviceId: GenericID, params?: DataQueryStreaming, options?: OptionsStreaming) {
    const poolingRecordQty = options?.poolingRecordQty || 1000;
    const poolingTime = options?.poolingTime || 1000; // 1 sec
    const neverStop = options?.neverStop || false;
    const initialSkip = options?.initialSkip || 0;

    if (poolingRecordQty > 10000) {
      throw new Error("The maximum of poolingRecordQty is 10000");
    }

    // API will divide the poolingRecordQty by the number of variables
    const variableQty = Array.isArray(params?.variables) ? params.variables.length : 1;
    const qty: number = Math.ceil(poolingRecordQty / variableQty);
    let skip: number = initialSkip;
    let stop: boolean = false;

    while (!stop) {
      await sleep(poolingTime);

      const data = await this.getDeviceData(deviceId, {
        ...params,
        qty,
        skip,
        query: "default",
        ordination: "ascending",
      });
      skip += data.length;

      if (!neverStop) {
        stop = data.length === 0 || data.length < poolingRecordQty;
      }

      yield data;
    }
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
   * Send data to device
   *
   * @param deviceId Device ID.
   * @param data An array or one object with data to be send to TagoIO
   * @return amount of data added
   * @example
   * ```js
   * const result = await Resources.devices.sendDeviceData("myDeviceId", {
   *   variable: "temperature",
   *   unit: "F",
   *   value: 55,
   *   time: "2015-11-03 13:44:33",
   *   location: { lat: 42.2974279, lng: -85.628292 },
   * });
   * ```
   */
  public async sendDeviceData(deviceId: GenericID, data: DataCreate | DataCreate[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceId}/data`,
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * Stream data to device
   *
   * @experimental
   * @param deviceId Device ID.
   * @param data An array or one object with data to be send to TagoIO using device token
   * @param options Stream options
   * @example
   * ```js
   * const data = [
   *     {
   *       variable: "temperature",
   *       unit: "F",
   *       value: 55,
   *       time: "2015-11-03 13:44:33",
   *       location: { lat: 42.2974279, lng: -85.628292 },
   *     },
   *     {
   *       variable: "temperature",
   *       unit: "F",
   *       value: 53,
   *       time: "2015-11-03 13:44:33",
   *       location: { lat: 43.2974279, lng: -86.628292 },
   *     },
   *     // ...
   *   ];
   *
   *   const result = await Resources.devices.sendDeviceDataStreaming("myDeviceId", data, {
   *     poolingRecordQty: 1000,
   *     poolingTime: 1000,
   *   });
   * ```
   */
  public async sendDeviceDataStreaming(
    deviceId: GenericID,
    data: DataCreate[],
    options?: Omit<OptionsStreaming, "neverStop">
  ) {
    const poolingRecordQty = options?.poolingRecordQty || 1000;
    const poolingTime = options?.poolingTime || 1000; // 1 seg

    if (!Array.isArray(data)) {
      return Promise.reject("Only data array is allowed");
    }

    const dataChunk = chunk(data, poolingRecordQty);
    for (const items of dataChunk) {
      await this.sendDeviceData(deviceId, items);

      await sleep(poolingTime);
    }

    return `${data.length} Data added.`;
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
   * await Resources.devices.editDeviceData("myDeviceId", { id: "idOfTheRecord", value: "new value", unit: "new unit" });
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
   * ! If query parameters are empty, last 15 data for the device will be deleted.
   *
   * @param deviceId Device ID.
   * @param queryParams Parameters to specify what should be deleted on the device's data.
   *
   * @returns Success message indicating amount of records deleted (can be 0).
   *
   * @example
   * ```ts
   * await Resources.devices.deleteDeviceData("myDeviceId", { ids: ["recordIdToDelete", "anotherRecordIdToDelete" ] });
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
   *
   * @deprecated Use `dataBackup` instead.
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

  public async dataBackup(params: DeviceDataBackup, chunkID?: GenericID): Promise<DeviceDataBackupResponse> {
    const body = {
      chunk_id: chunkID,
      headers: params.headers,
      file_address: params.file_address,
    };

    const result = await this.doRequest<DeviceDataBackupResponse>({
      path: chunkID ? `/device/${params.deviceID}/chunk/backup` : `/device/${params.deviceID}/data/backup`,
      method: "POST",
      body,
    });

    return result;
  }

  public async dataRestore(params: DeviceDataRestore): Promise<string> {
    const body = {
      file_address: params.file_address,
    };

    const result = await this.doRequest<string>({
      path: `/device/${params.deviceID}/data/restore`,
      method: "POST",
      body,
    });

    return result;
  }
}

export default Devices;
