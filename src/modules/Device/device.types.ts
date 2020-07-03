import { Regions } from "../../regions";
import {
  Data,
  Query,
  GenericID,
  GenericToken,
  ExpireTimeOption,
  PermissionOption,
  TagsObj,
} from "../../comum/comum.types";
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

interface TokenDataList {
  token: GenericToken;
  name: string;
  type: string;
  permission: PermissionOption;
  serie_number: string | void;
  last_authorization: string | void;
  verification_code: string | void;
  expire_time: string;
  ref_id: string;
  created_at: string;
  created_by: string | void;
}

type TokenListResponse = TokenDataList[];

interface ListQuery
  extends Query<
    DeviceInfo,
    "name" | "visible" | "active" | "last_input" | "last_output" | "created_at" | "updated_at"
  > {
  resolveBucketName?: boolean;
}

interface ListTokenQuery
  extends Query<TokenDataList, "name" | "permission" | "serie_number" | "verification_code" | "created_at"> {}

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

interface TokenData {
  /**
   * A name for the token.
   */
  name: string;
  /**
   * The time for when the token should expire.
   * It will be randomly generated if not included.
   * Accepts “never” as value.
   */
  expire_time?: ExpireTimeOption;
  /**
   * Token permission should be 'write', 'read' or 'full'.
   */
  permission: PermissionOption;
  /**
   * [optional] The serial number of the device.
   */
  serie_number?: string;
  /**
   * [optional] Verification code to validate middleware requests.
   */
  verification_code?: string;
  /**
   * [optional] Middleware or type of the device that will be added.
   */
  middleware?: string;
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
  ListTokenQuery,
  TokenListResponse,
  TokenData,
  PermissionOption,
  ExpireTimeOption,
};
