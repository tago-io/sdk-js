import TagoIOModule from "../../common/TagoIOModule";
import { Data, GenericID } from "../../common/common.types";
import { DeviceInfo, DeviceConstructorParams, DataToSend, DataQuery, DataQueryCount } from "./device.types";
import Batch from "../../common/BatchRequest";

class Device extends TagoIOModule<DeviceConstructorParams> {
  /**
   * Get information about the current device
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
   * Get number of TagoIO registers in Device.
   * @example
   * ```json
   * queryParams: {
   *  query: "count",
   *  variable: "humidity",
   *  value: 10,
   * }
   * ```
   * @param queryParams Object with query params
   * @returns Number of TagoIO registers
   */
  public async getData(queryParams: DataQueryCount): Promise<number>;
  /**
   * Get data from TagoIO Device.
   * @example
   * ```json
   * queryParams: {
   *  query: "last_item",
   *  variable: "humidity",
   *  value: 10,
   * }
   * ```
   * @param queryParams Object with query params
   * @returns An array of TagoIO registers
   */
  public async getData(queryParams?: DataQuery): Promise<Data[]>;
  public async getData(queryParams?: DataQuery): Promise<Data[] | number> {
    if (queryParams?.query === "default") {
      delete queryParams.query;
    }

    const result = await this.doRequest<Data[] | number>({
      path: "/data",
      method: "GET",
      params: queryParams,
    });

    return result;
  }

  /**
   * Delete data from device
   * @example
   * ```json
   * queryParams: {
   *  id: fffaf2f1f2f5f0f0fcfffaf1
   * }
   * ```
   * @param queryParams
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
   */
  public async getParameters(onlyUnRead?: boolean): Promise<string> {
    const params: { sent_status?: boolean } = {};

    if (onlyUnRead === true) {
      params.sent_status = true;
    }

    const result = await this.doRequest<string>({
      path: "/device/params",
      method: "GET",
      params: params,
    });

    return result;
  }

  /**
   * Mark parameter as read
   * @param parameterID Parameter identification
   */
  public async setParameterAsRead(parameterID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/params/${parameterID}`,
      method: "PUT",
    });

    return result;
  }

  public async sendDataStreaming() {}

  public batch = new Batch(this.params);
}

export default Device;
