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
  name: string;
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
   * Device Serie Number
   */
  serie_number?: string;
  /**
   * Verification code
   */
  verification_code?: string;
  /**
   * Connector ID
   */
  connector?: GenericID;
  /**
   * If device will use connector parser
   */
  connector_parse?: boolean;
  /**
   * Javascript code for use as payload parser
   */
  parse_function?: string;
}

interface DeviceInfo extends Omit<DeviceCreateInfo, "configuration_params"> {
  id: GenericID;
  profile: GenericID;
  bucket: {
    id: GenericID;
    name: string;
  };
  last_output: Date | string;
  last_input: Date | string;
  updated_at: Date;
  created_at: Date;
  inspected_at: Date | void;
}

interface ConfigurationParams {
  sent: boolean;
  key: string;
  value: string | number | boolean;
}

type DeviceCreateResponse = { device_id: GenericID; bucket_id: GenericID; token: GenericToken };
type DeviceListItem = Omit<DeviceInfo, "bucket"> & { bucket: GenericID };

export { DeviceQuery, DeviceCreateInfo, ConfigurationParams, DeviceInfo, DeviceCreateResponse, DeviceListItem };
