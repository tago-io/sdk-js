import chunk from "lodash.chunk";
import Batch from "../../common/BatchRequest";
import { Data, GenericID } from "../../common/common.types";
import sleep from "../../common/sleep";
import TagoIOModule from "../../common/TagoIOModule";
import { ConfigurationParams } from "../Account/devices.types";
import { DataQuery, DataToSend, DeviceConstructorParams, DeviceInfo } from "./device.types";

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

  public batch = new Batch(this.params);
}

export default Device;
