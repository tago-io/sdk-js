import { GenericID, GenericToken, Query, TagsObj, PermissionOption, ExpireTimeOption } from "../../common/common.types";
import { DataStorageType } from "./buckets.types";

interface DeviceQuery
  extends Query<
    DeviceInfo,
    "name" | "visible" | "active" | "last_input" | "last_output" | "created_at" | "updated_at"
  > {
  resolveBucketName?: boolean;
}

interface DeviceCreateInfo {
  /**
   * Device name.
   */
  name: string;
  /**
   * Connector ID.
   */
  connector: GenericID;
  /**
   * Network ID.
   */
  network: GenericID;

  /**
   * Device's data storage (bucket) type.
   *
   * @default "legacy"
   */
  type?: DataStorageType;
  /**
   * Description of the device.
   */
  description?: string | null;
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
  /**
   * Device serial number.
   */
  serie_number?: string;
  /**
   * If device will use connector parser
   */
  connector_parse?: boolean;
  /**
   * Javascript code for use as payload parser
   */
  parse_function?: string;
  /**
   * Data retention for the device's data storage.
   */
  data_retention?: string;
}

interface DeviceInfo extends Required<Omit<DeviceCreateInfo, "configuration_params">> {
  /**
   * Device ID.
   */
  id: GenericID;
  /**
   * Device's data storage (bucket) type.
   */
  type: DataStorageType;
  /**
   * ID of the profile that owns the device.
   */
  profile: GenericID;
  /**
   * Bucket storing the device's data.
   */
  bucket: {
    id: GenericID;
    name: string;
  };
  /**
   * Date for the device's last output.
   */
  last_output: Date | null;
  /**
   * Date for the device's last input.
   */
  last_input: Date | null;
  /**
   * Date for the device's last update.
   */
  updated_at: Date;
  /**
   * Date for the device's creation.
   */
  created_at: Date;
  /**
   * Date for the device's last inspection.
   */
  inspected_at: Date | null;
  /**
   * Date for the device's last data retention.
   */
  last_retention: Date | null;
}

interface ConfigurationParams {
  sent: boolean;
  key: string;
  value: string;
  id?: string;
}

type DeviceCreateResponse = { device_id: GenericID; bucket_id: GenericID; token: GenericToken };

type DeviceListItem = Omit<DeviceInfo, "bucket"> & { bucket: GenericID };

interface DeviceTokenDataList {
  token: GenericToken;
  device_id: GenericID;
  network_id: GenericID;
  name: string;
  permission: PermissionOption;
  serie_number: string | void;
  last_authorization: string | void;
  expire_time: ExpireTimeOption;
  created_at: string;
}
interface ListDeviceTokenQuery
  extends Query<DeviceTokenDataList, "name" | "permission" | "serie_number" | "last_authorization" | "created_at"> {}

export {
  DeviceQuery,
  DeviceCreateInfo,
  ConfigurationParams,
  DeviceInfo,
  DeviceCreateResponse,
  DeviceListItem,
  DeviceTokenDataList,
  ListDeviceTokenQuery,
};
