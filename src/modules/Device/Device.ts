import { chunk } from "lodash";
import { Data, DataCreate, DataEdit, GenericID } from "../../common/common.types";
import sleep from "../../common/sleep";
import TagoIOModule from "../../common/TagoIOModule";
import { ConfigurationParams } from "../Account/devices.types";
import dateParser from "../Utils/dateParser";
import { DataQuery, DataQueryStreaming, DeviceConstructorParams, DeviceInfo, OptionsStreaming } from "./device.types";

class Device extends TagoIOModule<DeviceConstructorParams> {
  /**
   * Get information about the current device
   * @example
   * ```js
   * const myDevice = new Device({ token: "my_device_token" });
   *
   * const result = await myDevice.info();
   * ```
   */
  public async info(): Promise<DeviceInfo> {
    let result = await this.doRequest<DeviceInfo>({
      path: "/info",
      method: "GET",
    });

    result = dateParser(result, ["created_at", "updated_at", "last_input", "last_output"]);
    return result;
  }

  /**
   * Send data to device
   * @param data An array or one object with data to be send to TagoIO using device token
   * @example
   * ```js
   * const myDevice = new Device({ token: "my_device_token" });
   *
   * const result = await myDevice.sendData({
   *   variable: "temperature",
   *   unit: "F",
   *   value: 55,
   *   time: "2015-11-03 13:44:33",
   *   location: { lat: 42.2974279, lng: -85.628292 },
   * });
   * ```
   */
  public async sendData(data: DataCreate | DataCreate[]): Promise<string> {
    data = Array.isArray(data) ? data : [data];

    const result = await this.doRequest<string>({
      path: "/data",
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * Get data from TagoIO Device.
   * @param queryParams Object with query params
   * @returns An array of TagoIO registers
   * @example
   * ```js
   * const myDevice = new Device({ token: "my_device_token" });
   *
   * const result = await myDevice.getData({
   *   query: "last_item",
   *   variable: "humidity",
   * });
   * ```
   */
  public async getData(queryParams?: DataQuery): Promise<Data[]> {
    if (queryParams?.query === "default") {
      delete queryParams.query;
    }

    let result = await this.doRequest<Data[] | number>({
      path: "/data",
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
   * Edit data in a Mutable-type device.
   *
   * @param data Array or object with the data to be edited, each object with the data's ID.
   *
   * @example
   * ```ts
   * const myDevice = new Device({ token: "my_device_token" });
   *
   * const result = await myDevice.editData({
   *   id: "id_of_the_data_item",
   *   value: 123,
   *   time: "2022-04-01 12:34:56",
   *   location: { lat: 42.2974279, lng: -85.628292 },
   * });
   * ```
   *
   * @returns Success message with the amount of data items updated.
   */
  public async editData(data: DataEdit | DataEdit[]): Promise<string> {
    data = Array.isArray(data) ? data : [data];

    const result = await this.doRequest<string>({
      path: "/data",
      method: "PUT",
      body: data,
    });

    return result;
  }

  /**
   * Delete data from device
   * @param queryParams
   * @example
   * ```js
   * const myDevice = new Device({ token: "my_device_token" });
   *
   * const result = await myDevice.deleteData({
   *   query: "last_item",
   *   variable: "humidity",
   *   value: 10
   * });
   * ```
   */
  public async deleteData(queryParams?: DataQuery): Promise<string> {
    if (!queryParams) {
      queryParams = { query: "last_item" };
    }

    if (queryParams?.query === "default") {
      delete queryParams.query;
    }

    const result = await this.doRequest<string>({
      path: "/data",
      method: "DELETE",
      params: queryParams,
    });

    return result;
  }

  /**
   * Get parameters from device
   * @param onlyUnRead set true to get only unread parameters
   * @example
   * ```js
   * const myDevice = new Device({ token: "my_device_token" });
   *
   * const result = await myDevice.getParameters();
   * ```
   */
  public async getParameters(status: "all" | "onlyUnRead" | "onlyRead"): Promise<ConfigurationParams[]> {
    const params: { sent_status?: boolean } = {};

    if (status === "onlyRead") {
      params.sent_status = true;
    } else if (status === "onlyUnRead") {
      params.sent_status = false;
    }

    // ? Support for old call (onlyUnRead?: boolean)
    // @ts-expect-error
    if (status === true) {
      params.sent_status = false;
    }

    const result = await this.doRequest<ConfigurationParams[]>({
      path: "/device/params",
      method: "GET",
      params: params,
    });

    return result;
  }

  /**
   * Mark parameter as read
   * @param parameterID Parameter identification
   * @example
   * ```js
   * const myDevice = new Device({ token: "my_device_token" });
   *
   * const result = await myDevice.setParameterAsRead("parameter_id");
   * ```
   *
   */
  public async setParameterAsRead(parameterID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/params/${parameterID}`,
      method: "PUT",
      body: { sent: true },
    });

    return result;
  }

  /**
   * Get Data Streaming
   *
   * @experimental
   * @param params Data Query
   * @param options Stream options
   * @example
   * ```js
   * const myDevice = new Device({ token: "my_device_token" });
   *
   * for await (const items of myDevice.getDataStreaming()) {
   *  console.log(items);
   * }
   * ```
   */
  public async *getDataStreaming(params?: DataQueryStreaming, options?: OptionsStreaming) {
    const poolingRecordQty = options?.poolingRecordQty || 1000;
    const poolingTime = options?.poolingTime || 1000; // 1 seg
    const neverStop = options?.neverStop || false;

    if (poolingRecordQty > 10000) {
      throw new Error("The maximum of poolingRecordQty is 10000");
    }

    const qty: number = Math.ceil(poolingRecordQty);
    let skip: number = 0;
    let stop: boolean = false;

    while (!stop) {
      await sleep(poolingTime);

      yield (async () => {
        const data = await this.getData({ ...params, qty, skip, query: "default", ordination: "ascending" });
        skip += data.length;

        if (!neverStop) {
          stop = data.length === 0 || data.length < poolingRecordQty;
        }

        return data;
      })();
    }
  }

  /**
   * Stream data to device
   *
   * @experimental
   * @param data An array or one object with data to be send to TagoIO using device token
   * @param options Stream options
   * @example
   * ```js
   * const myDevice = new Device({ token: "my_device_token" });
   *
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
   *   const result = await myDevice.sendDataStreaming(data, {
   *     poolingRecordQty: 1000,
   *     poolingTime: 1000,
   *   });
   * ```
   */
  public async sendDataStreaming(data: DataCreate[], options: Omit<OptionsStreaming, "neverStop">) {
    const poolingRecordQty = options?.poolingRecordQty || 1000;
    const poolingTime = options?.poolingTime || 1000; // 1 seg

    if (!Array.isArray(data)) {
      return Promise.reject("Only data array is allowed");
    }

    const dataChunk = chunk(data, poolingRecordQty);
    for (const items of dataChunk) {
      await this.sendData(items);

      await sleep(poolingTime);
    }

    return `${data.length} Data added.`;
  }
}

export default Device;
