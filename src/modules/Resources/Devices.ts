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
   * Lists all devices from your application with pagination support.
   *
   * @param {number} queryObj.page - Page number
   * @param {string[]} queryObj.fields - Fields to be returned
   * @param {object} queryObj.filter - Filter conditions
   * @param {number} queryObj.amount - Number of items per page
   * @param {[string, 'asc' | 'desc']} queryObj.orderBy - Field and direction to sort by
   * @param {boolean} queryObj.resolveBucketName - Resolve bucket names
   * @param {boolean} queryObj.resolveConnectorName - Resolve connector names
   * @returns {Promise<DeviceListItem[]>} List of devices
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const list = await Resources.devices.list({
   *   page: 1,
   *   fields: ["id", "name"],
   *   amount: 10,
   *   orderBy: ["name", "asc"]
   * });
   * console.log(list);
   * ```
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
   * Gets a streaming list of devices from the application.
   *
   * @param {Omit<DeviceQuery, "page" | "amount">} queryObj - Query parameters for filtering
   * @param {OptionsStreaming} options - Streaming configuration options
   * @returns {AsyncGenerator<DeviceListItem[]>} Generator yielding device lists
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * for await (const items of await Resources.devices.listStreaming({ name: "*sensor*" })) {
   *   console.log(items);
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
   * Creates a new device in your application.
   *
   * @param {DeviceCreateInfo} deviceObj - Device configuration data
   * @returns {Promise<DeviceCreateResponse>} Created device information
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const newDevice = await Resources.devices.create({
   *   name: "My Device",
   *   connector: "custom-mqtt",
   *   type: "mutable"
   * });
   * console.log(newDevice);
   * ```
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
   * Modifies properties of an existing device.
   *
   * @param {GenericID} deviceID - ID of the device to modify
   * @param {DeviceEditInfo} deviceObj - Object containing the properties to be updated
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.devices.edit("device-id-123", {
   *   name: "Updated Device Name",
   *   active: true
   * });
   * console.log(result);
   * ```
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
   * Deletes a device from your application.
   *
   * @param {GenericID} deviceID - ID of the device to delete
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.devices.delete("device-id-123");
   * console.log(result);
   * ```
   */
  public async delete(deviceID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Retrieves detailed information about a specific device.
   *
   * @param {GenericID} deviceID - ID of the device
   * @returns {Promise<DeviceInfo>} Device information
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const deviceInfo = await Resources.devices.info("device-id-123");
   * console.log(deviceInfo);
   * ```
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
   * Creates or updates device parameters.
   *
   * @param {GenericID} deviceID - ID of the device
   * @param {ConfigurationParams | ConfigurationParams[]} configObj - Parameter configuration
   * @param {GenericID} [paramID] - Optional parameter ID for updating specific parameter
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.devices.paramSet("device-id-123", {
   *   key: "config-key",
   *   value: "config-value"
   * });
   * console.log(result);
   * ```
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
   * Lists all parameters for a device.
   *
   * @param {GenericID} deviceID - ID of the device
   * @param {Boolean} sentStatus - Filter by sent status
   * @returns {Promise<Required<ConfigurationParams>[]>} List of device parameters
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const params = await Resources.devices.paramList("device-id-123");
   * console.log(params);
   * ```
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
   * Removes a parameter from a device.
   *
   * @param {GenericID} deviceID - ID of the device
   * @param {GenericID} paramID - ID of the parameter to remove
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.devices.paramRemove("device-id-123", "param-id-123");
   * console.log(result);
   * ```
   */
  public async paramRemove(deviceID: GenericID, paramID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceID}/params/${paramID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Lists all tokens for a device with pagination support.
   *
   * @param {GenericID} deviceID - ID of the device
   * @param {ListDeviceTokenQuery} queryObj - Query parameters
   * @param {number} queryObj.page - Page number
   * @param {string[]} queryObj.fields - Fields to return
   * @param {object} queryObj.filter - Filter conditions
   * @param {number} queryObj.amount - Items per page
   * @returns {Promise<DeviceTokenDataList[]>} List of device tokens
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const tokens = await Resources.devices.tokenList("device-id-123", {
   *   page: 1,
   *   fields: ["name", "token"],
   *   amount: 10
   * });
   * console.log(tokens);
   * ```
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
   * Creates a new token for a device.
   *
   * @param {GenericID} deviceID - ID of the device
   * @param {TokenData} tokenParams - Token configuration
   * @returns {Promise<TokenCreateResponse>} Created token information
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const token = await Resources.devices.tokenCreate("device-id-123", {
   *   name: "My Token",
   *   permission: "full"
   * });
   * console.log(token);
   * ```
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
   * Deletes a device token.
   *
   * @param {GenericToken} token - Token to delete
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.devices.tokenDelete("token-123");
   * console.log(result);
   * ```
   */
  public async tokenDelete(token: GenericToken): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/token/${token}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Gets the amount of data stored in a device.
   *
   * @param {GenericID} deviceID - ID of the device
   * @returns {Promise<number>} Number of records stored in the device
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const amount = await Resources.devices.amount("device-id-123");
   * console.log(amount);
   * ```
   */
  public async amount(deviceID: GenericID): Promise<number> {
    const result = await this.doRequest<number>({
      path: `/device/${deviceID}/data_amount`,
      method: "GET",
    });

    return result;
  }

  /**
   * Retrieves data from all variables in the device.
   *
   * @param {GenericID} deviceId - ID of the device
   * @param {DataQuery} queryParams - Query parameters to filter the results
   * @returns {Promise<Data[]>} Array with the data values stored in the device
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const data = await Resources.devices.getDeviceData("device-id-123", {
   *   qty: 10,
   *   variables: ["temperature"]
   * });
   * console.log(data);
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
   * Retrieves data from device using streaming approach.
   *
   * @experimental
   * @param {GenericID} deviceId - ID of the device
   * @param {DataQueryStreaming} params - Query parameters
   * @param {OptionsStreaming} options - Streaming configuration options
   * @returns {AsyncGenerator<Data[]>} Generator yielding arrays of data
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * for await (const data of await Resources.devices.getDeviceDataStreaming("device-id-123")) {
   *   console.log(data);
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
   * Removes all data from a device.
   *
   * @param {GenericID} deviceId - ID of the device
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.devices.emptyDeviceData("device-id-123");
   * console.log(result);
   * ```
   */
  public async emptyDeviceData(deviceId: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceId}/empty`,
      method: "POST",
    });

    return result;
  }

  /**
   * Sends data to a device.
   *
   * @param {GenericID} deviceId - ID of the device
   * @param {DataCreate | DataCreate[]} data - Single data record or array of records
   * @returns {Promise<string>} Success message with amount of records added
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.devices.sendDeviceData("device-id-123", {
   *   variable: "temperature",
   *   unit: "F",
   *   value: 55,
   *   time: "2015-11-03 13:44:33",
   *   location: { lat: 42.2974279, lng: -85.628292 }
   * });
   * console.log(result);
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
   * Streams data to a device in chunks.
   *
   * @experimental
   * @param {GenericID} deviceId - ID of the device
   * @param {DataCreate[]} data - Array of data records
   * @param {Omit<OptionsStreaming, "neverStop">} options - Streaming options
   * @returns {Promise<string>} Success message with amount of records added
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.devices.sendDeviceDataStreaming("device-id-123",
   *   [{
   *     variable: "temperature",
   *     value: 55,
   *     unit: "F",
   *   }],
   *   { poolingRecordQty: 1000 }
   * );
   * console.log(result);
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
   * @param {GenericID} deviceId - ID of the device
   * @param {DataEdit | DataEdit[]} updatedData - Data records to update
   * @returns {Promise<string>} Success message with amount of records updated
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```ts
   * const result = await Resources.devices.editDeviceData("myDeviceId", {
   *  id: "idOfTheRecord",
   *  value: "new value",
   *  unit: "new unit"
   * });
   * console.log(result);
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
   * @param {GenericID} deviceId - ID of the device
   * @param {DataQuery} queryParams - Parameters to specify what should be deleted
   * @returns {Promise<string>} Success message with amount of records deleted
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```ts
   * const result = await Resources.devices.deleteDeviceData("device-id-123", {
   *   ids: ["record-id-1", "record-id-2"]
   * });
   * console.log(result);
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
   * Retrieves chunk information from a device.
   *
   * @experimental
   * @param {GenericID} deviceID - ID of the device
   * @returns {Promise<DeviceChunkData[]>} Array of chunk information
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const chunks = await Resources.devices.getChunk("device-id-123");
   * console.log(chunks);
   * ```
   */
  public async getChunk(deviceID: GenericID): Promise<DeviceChunkData[]> {
    const result = await this.doRequest<DeviceChunkData[]>({
      path: `/device/${deviceID}/chunk`,
      method: "GET",
    });

    return result;
  }

  /**
   * Deletes a chunk from a device.
   *
   * @experimental
   * @param {GenericID} deviceID - ID of the device
   * @param {GenericID} chunkID - ID of the chunk
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.devices.deleteChunk("device-id-123", "chunk-id-123");
   * console.log(result);
   * ```
   */
  public async deleteChunk(deviceID: GenericID, chunkID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceID}/chunk/${chunkID}`,
      method: "DELETE",
    });

    return result;
  }

  /** @deprecated Use `dataBackup` instead. */
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

  /**
   * Schedule to export the Device's data to TagoIO Files.
   *
   * @param {DeviceDataBackup} params - Backup configuration
   * @param {GenericID} params.deviceID - ID of the device
   * @param {string} params.file_address - Destination file address (use $DEVICE$ and $TIMESTAMP$ as variables)
   * @param {boolean} params.headers - Include headers in backup
   * @param {GenericID} [chunkID] - Optional chunk ID for immutable device data
   * @returns {Promise<DeviceDataBackupResponse>} Backup operation result
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.devices.dataBackup({
   *   deviceID: "device-id-123",
   *   file_address: "/backups/$DEVICE$/$TIMESTAMP$",
   *   headers: true
   * });
   * console.log(result);
   * ```
   */
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

  /**
   * Restores data to a device from a CSV file in TagoIO Files.
   *
   * @param {DeviceDataRestore} params - Restore configuration parameters
   * @param {string} params.deviceID - Target device ID
   * @param {string} params.file_address - Path to CSV file in TagoIO Files
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.devices.dataRestore({
   *   deviceID: "device-id-123",
   *   file_address: "/backups/backup.csv"
   * });
   * console.log(result);
   * ```
   */
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
