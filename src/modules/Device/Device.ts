import TagoIOModule from "../../common/TagoIOModule";
import { Data } from "../../common/common.types";
import { DeviceInfo, DeviceConstructorParams, DataToSend, DataQuery } from "./device.types";

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

  public async getData(params: Omit<DataQuery, "query"> & { query: "count" }): Promise<number>; // Overload
  public async getData(params?: DataQuery): Promise<Data[]>; // Overload
  public async getData(params?: DataQuery) {
    if (params?.query === "default") {
      delete params.query;
    }

    const result = await this.doRequest<Data[] | number>({
      path: "/data",
      method: "GET",
      params: params,
    });

    return result;
  }

  public async deleteData(params?: DataQuery) {
    if (!params || !params?.query) {
      params = { query: "last_item" };
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

  public async sendDataStreaming() {}
}

export default Device;
