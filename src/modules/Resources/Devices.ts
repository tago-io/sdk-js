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
   * @description Lists all devices from your application with pagination support.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/3-devices} Devices
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Gets a streaming list of devices from the application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/3-devices} Devices
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Creates a new device in your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/3-devices#Adding_devices} Adding Devices
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Modifies properties of an existing device.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/3-devices#Managing_and_customizing_your_device} Managing and Customizing Your Device
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Deletes a device from your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/3-devices} Devices
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Retrieves detailed information about a specific device.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/3-devices} Devices
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Creates or updates device parameters.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/configuration-parameters-for-devices} Configuration Parameters for Devices
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Lists all parameters for a device.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/configuration-parameters-for-devices} Configuration Parameters for Devices
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Removes a parameter from a device.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/configuration-parameters-for-devices} Configuration Parameters for Devices
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Lists all tokens for a device with pagination support.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/4-device-token} Device Token
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Creates a new token for a device.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/4-device-token} Device Token
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Deletes a device token.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/4-device-token} Device Token
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Gets the amount of data stored in a device.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/device-data#Amount_of_data_records} Amount of data records
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Retrieves data from all variables in the device.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/device-data} Device data management
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Retrieves data from device using streaming approach.
   *
   * @experimental
   * @see {@link https://help.tago.io/portal/en/kb/articles/device-data} Device data management
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Removes all data from a device.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/device-data#Emptying_your_Device_Data} Emptying your Device Data
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Sends data to a device.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/95-device-emulator} Device Emulator
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Streams data to a device in chunks.
   *
   * @experimental
   * @see {@link https://help.tago.io/portal/en/kb/articles/95-device-emulator} Device Emulator
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Edit data records in a device using the profile token and device ID.
   *
   * The `updatedData` can be a single data record or an array of records to be updated,
   * each of the records must have the `id` of the record and the fields to be updated.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/device-data#Editing_and_deleting_variables_individually} Editing and deleting variables individually
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Delete data records in a device using the profile token and device ID.
   *
   * See the example to understand how to use this method properly to have full control on what to delete.
   *
   * ! If query parameters are empty, last 15 data for the device will be deleted.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/device-data#Editing_and_deleting_variables_individually} Editing and deleting variables individually
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Retrieves chunk information from a device.
   *
   * @experimental
   * @see {@link https://help.tago.io/portal/en/kb/articles/chunk-management} Chunk Management
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Deletes a chunk from a device.
   *
   * @experimental
   * @see {@link https://help.tago.io/portal/en/kb/articles/chunk-management#Delete_chunks} Delete chunks
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Schedule to export the Device's data to TagoIO Files.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/55-data-export} Data Export
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Restores data to a device from a CSV file in TagoIO Files.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/device-data#Importing} Importing
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
