import chunk from "lodash.chunk";
import TagoIOModule from "../../common/TagoIOModule";
import { Data } from "../../common/common.types";
import { DeviceInfo, DeviceConstructorParams, DataToSend, DataQuery } from "./device.types";
import sleep from "../../common/sleep";

class Device extends TagoIOModule<DeviceConstructorParams> {
  public async info() {
    const result = await this.doRequest<DeviceInfo>({
      path: "/info",
      method: "GET",
    });

    return result;
  }

  public async sendData(data: DataToSend | DataToSend[]) {
    data = Array.isArray(data) ? data : [data];

    const result = await this.doRequest<string>({
      path: "/data",
      method: "POST",
      body: data,
    });

    return result;
  }

  public async getData(params?: DataQuery): Promise<Data[]> {
    if (params?.query === "default") {
      delete params.query;
    }

    let result = await this.doRequest<Data[] | number>({
      path: "/data",
      method: "GET",
      params: params,
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

  public async deleteData(params?: DataQuery) {
    if (!params) {
      params = { query: "last_item" };
    }

    if (params?.query === "default") {
      delete params.query;
    }

    const result = await this.doRequest<string>({
      path: "/data",
      method: "DELETE",
      params: params,
    });

    return result;
  }

  public async getParameters(onlyNoRead?: boolean) {
    const params: { sent_status?: boolean } = {};

    if (onlyNoRead === true) {
      params.sent_status = true;
    }

    const result = await this.doRequest<string>({
      path: "/device/params",
      method: "GET",
      params: params,
    });

    return result;
  }

  public async setParameterAsRead(parameterID: string) {
    const result = await this.doRequest<string>({
      path: `/device/params/${parameterID}`,
      method: "PUT",
    });

    return result;
  }

  /**
   * Get Data Streaming
   *
   * ! WARNING: not working yet.
   * In development.
   * @param params Data Query
   * @param qtyOfDataBySecond Qty of Data by second
   * @internal
   * @hidden
   */
  public async getDataStreaming(params?: DataQuery, qtyOfDataBySecond = 1000): Promise<Data[]> {
    if (!params.qty || (params.qty <= qtyOfDataBySecond && params.qty <= 10000)) {
      return this.getData(params);
    }
    const qtyByRequest = Math.ceil(params.qty / qtyOfDataBySecond);
    const data: Data[] = [];

    for (const _ of Array.from(Array(qtyByRequest).keys())) {
      data.push(...(await this.getData({ ...params, qty: qtyByRequest })));
      await sleep(1000);
    }

    return data;
  }

  public async sendDataStreaming(data: DataToSend[], qtyOfDataBySecond = 1000) {
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
}

export default Device;
