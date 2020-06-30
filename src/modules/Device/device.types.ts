import { Regions } from "../../regions";
import { Data } from "../../comum/comum.types";
import { Key } from "readline";

interface DeviceInfo {
  name: string;
}

interface DeviceConstructorParams {
  token: string;
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

interface Tags {
  key: string;
  value: string | number | boolean;
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
  tags?: Tags[];
}

export { DeviceConstructorParams, DeviceInfo, DataToSend, DataQuery, DeviceData };
