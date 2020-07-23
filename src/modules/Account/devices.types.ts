import { GenericID, GenericToken, Query, TagsObj } from "../../common/common.types";

interface DeviceQuery
  extends Query<
    DeviceInfo,
    "name" | "visible" | "active" | "last_input" | "last_output" | "created_at" | "updated_at"
  > {
  resolveBucketName?: boolean;
}

interface DeviceCreateInfo {
  /**
   * A name for the device.
   */
  name?: string;
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
}

interface DeviceInfo extends Readonly<Omit<DeviceCreateInfo, "configuration_params">> {
  id: GenericID;
  profile: GenericID;
  bucket: {
    id: GenericID;
    name: string;
  };
  last_output: Date | string;
  last_input: Date | string;
  connector: GenericID;
  connector_parse: boolean;
  parse_function: string;
  updated_at: Date | string;
  created_at: Date | string;
  inspected_at: Date | string;
}

interface ConfigurationParams {
  sent: boolean;
  key: string;
  value: string | number | boolean;
}

type DeviceCreateResponse = { device_id: GenericID; bucket_id: GenericID; token: GenericToken };

export { DeviceQuery, DeviceCreateInfo, ConfigurationParams, DeviceInfo, DeviceCreateResponse };
