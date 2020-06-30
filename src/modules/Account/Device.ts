import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";
import Middlewares from "./Middlewares";
import Tags from "./Tags";
import QueryString from "qs";
import { TagsObj } from "../../comum/comum.types";
import { DeviceData } from "../Device/device.types";

interface ListResponse {
  id: string;
  profile: string;
  bucket: string;
  name: string;
  description: string | void;
  visible: boolean;
  active: boolean;
  last_output: string;
  last_input: string;
  connector: string;
  connector_parse: boolean;
  parse_function: string;
  tags: TagsObj;
  updated_at: string;
  created_at: string;
  inspected_at: string;
}

interface ListQuery {
  /** Page of list starting from 1
   *  Default: 1
   */
  page?: number;
  /** Array of field names.
   *  Default: ["id", "name"]
   */
  fields?: (keyof ListResponse)[];
  /** Filter object.
   *  Example: {name: 'Motor'}
   */
  filter?: { [name in keyof ListResponse]: string | number };
  /** Amount of items will return.
   *  Default: 20
   */
  amount?: number;
  /** Amount of items will return.
   * Default: 20
   */
  orderBy?: string;
  /** It add a field called 'bucket_name'.
   */
  resolveBucketName?: boolean;
}

class Device extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all devices from the account
   *
   * @param {ListQuery} [query] Search query params
   * @return {Promise<Partial<ListResponse>>}
   * @memberof Device
   */
  list(query?: ListQuery): Promise<Partial<ListResponse>> {
    const result = this.doRequest<Partial<ListResponse>>({
      path: "/device",
      method: "GET",
      params: {
        page: query?.page || 1,
        fields: query?.fields || ["id", "name"],
        filter: query?.filter || {},
        amount: query?.amount || 20,
        orderBy: query?.orderBy || "name,asc",
        resolveBucketName: query?.resolveBucketName || false,
      },
    });

    return result;
  }

  /**
   * Create a Device
   *
   * @param {DeviceData} data New device info
   * @returns {Promise<{ device_id: string; bucket_id: string; token: string }>}
   * @memberof Device
   */
  create(data: DeviceData): Promise<{ device_id: string; bucket_id: string; token: string }> {
    const result = this.doRequest<{ device_id: string; bucket_id: string; token: string }>({
      path: "/device",
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * Edit the Device
   *
   * @param {string} device_id Device identification
   * @param {DeviceData} data Device info to change
   * @returns {Promise<string>} String with status
   * @memberof Device
   */
  edit(device_id: string, data: DeviceData): Promise<string> {
    const result = this.doRequest<string>({
      path: `/device/${device_id}`,
      method: "PUT",
      body: data,
    });

    return result;
  }

  /**
   * Delete the Device
   *
   * @param {string} device_id Device identification
   * @returns {Promise<string>} String with status
   * @memberof Device
   */
  delete(device_id: string): Promise<string> {
    const result = this.doRequest<string>({
      path: `/device/${device_id}`,
      method: "DELETE",
    });

    return result;
  }
}

export default Device;
