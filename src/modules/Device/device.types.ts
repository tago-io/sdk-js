import { Regions } from "../../regions";
import {
  Data,
  Query,
  GenericID,
  GenericToken,
  ExpireTimeOption,
  PermissionOption,
  TagsObj,
} from "../../common/comum.types";
import { Key } from "readline";

interface DeviceInfo {
  id: GenericID;
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
  tags: TagsObj[];
  updated_at: string;
  created_at: string;
  inspected_at: string;
  bucket_name?: string;
}

interface DeviceConstructorParams {
  token: GenericToken;
  region: Regions;
  // options?: any;
}

type DataToSend = Omit<Data, "id" | "created_at" | "origin">;

interface DataQuery {
  query?: "default" | "last_item" | "last_value" | "last_location" | "last_insert" | "min" | "max" | "count";
  qty?: number;
  details?: boolean;
  variables?: string[];
  origins?: string[];
  series?: string[];
  ids?: string[];
  values?: (string | number | boolean)[];
  start_date?: Date | string;
  end_date?: Date | string;
}

interface ConfigurationParams {
  sent: boolean;
  key: string;
  value: string | number | boolean;
}

type ListResponse = DeviceInfo[];

interface ListQuery
  extends Query<
    DeviceInfo,
    "name" | "visible" | "active" | "last_input" | "last_output" | "created_at" | "updated_at"
  > {
  resolveBucketName?: boolean;
}

interface DeviceData {
  /**
   * A name for the device.
   */
  name?: string;
  /**
   * Description of the device.
   */
  description?: string;
  /**
   * Set if the device will be active.
   */
  active?: boolean;
  /**
   * Set if the device will be visible.
   */
  visible?: boolean;
  /**
   * An array of configuration params
   */
  configuration_params?: ConfigurationParams[];
  /**
   * An array of tags
   */
  tags?: TagsObj[];
}

export {
  DeviceConstructorParams,
  DeviceInfo,
  ConfigurationParams,
  DataToSend,
  DataQuery,
  DeviceData,
  ListResponse,
  ListQuery,
  PermissionOption,
  ExpireTimeOption,
};
