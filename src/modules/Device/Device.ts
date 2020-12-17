import chunk from "lodash.chunk";
import Batch from "../../common/BatchRequest";
import { Data, GenericID } from "../../common/common.types";
import sleep from "../../common/sleep";
import TagoIOModule from "../../common/TagoIOModule";
import { ConfigurationParams } from "../Account/devices.types";
import {
  DataQuery,
  DataQueryStreaming,
  DataToSend,
  DeviceConstructorParams,
  DeviceInfo,
  OptionsStreaming,
} from "./device.types";

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
    const result = await this.doRequest<DeviceInfo>({
      path: "/info",
      method: "GET",
    });

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
  public async sendData(data: DataToSend | DataToSend[]): Promise<string> {
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

    return result.map((item) => {
      item.time = new Date(item.time);
      if (item.created_at) {
        item.created_at = new Date(item.created_at);
      }

      return item;
    });
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
  public async getParameters(onlyUnRead?: boolean): Promise<ConfigurationParams[]> {
    const params: { sent_status?: boolean } = {};

    if (onlyUnRead === true) {
      params.sent_status = true;
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
    });

    return result;
  }

  /**
   * Get Data Streaming
   *
   * @experimental
   * @param qtyOfDataBySecond Qty of Data by second
   * @param params Data Query
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
    const qtyOfDataBySecond = options?.qtyOfDataBySecond || 1000;
    const neverStop = options?.neverStop || false;

    // TODO: split qtyOfDataBySecond and resolve it using Promise.all
    if (qtyOfDataBySecond > 10000) {
      throw new Error("The maximum of qtyOfDataBySecond is 10000");
    }

    const qty: number = Math.ceil(qtyOfDataBySecond);
    let skip: number = 0;
    let stop: boolean = false;

    while (!stop) {
      await sleep(1000);

      yield (async () => {
        const data = await this.getData({ ...params, qty, skip, query: "default", ordination: "ascending" });
        skip += data.length;

        if (!neverStop) {
          stop = data.length === 0 || data.length < qtyOfDataBySecond;
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
   * @param qtyOfDataBySecond Quantity of data per second to be sent
   * @example
   * ```js
   * const myDevice = new Device({ token: "my_device_token" });
   *
   * const result = await myDevice.sendDataStreaming(
   *   {
   *     variable: "temperature",
   *     unit: "F",
   *     value: 55,
   *     time: "2015-11-03 13:44:33",
   *     location: { lat: 42.2974279, lng: -85.628292 },
   *   },
   *   2000
   * );
   * ```
   */
  public async sendDataStreaming(data: DataToSend[], options: Omit<OptionsStreaming, "neverStop">) {
    const qtyOfDataBySecond = options?.qtyOfDataBySecond || 1000;

    if (!Array.isArray(data)) {
      return Promise.reject("Only data array is allowed");
    }

    const dataChunk = chunk(data, qtyOfDataBySecond);
    for (const items of dataChunk) {
      await this.sendData(items);

      await sleep(1000);
    }

    return `${data.length} Data added.`;
  }

  public batch = new Batch(this.params);
}

export default Device;
