import { Query } from "../../common/common.types";
import { DeviceInfo } from "../Device/device.types";

interface IDeviceParameters {
  name?: string;
  label?: string;
  type?: "text" | "dropdown" | "switch" | "number";
  default?: any;
  group?: "default" | "main" | "advanced" | "hide";
  options?: any[]; // optional, only for dropdown
}

interface INetworkInfo {
  id?: string;
  name?: string;
  description?: string;
  logo_url?: string;
  icon_url?: string;
  banner_url?: string;
  device_parameters?: IDeviceParameters[];
  middleware_endpoint?: string;
  payload_encoder?: string;
  payload_decoder?: string;
  public?: boolean;
  documentation_url?: string;
  serial_number?: {
    mask?: string;
    label?: string;
    image?: string;
    case?: string;
    help?: string;
    required?: boolean;
  };
  require_devices_access?: boolean;
}

interface NetworkDeviceListQuery
  extends Omit<
    Query<DeviceInfo, "name" | "visible" | "last_input" | "last_output" | "created_at" | "updated_at">,
    "fields"
  > {}

interface NetworkDeviceListQueryInfo extends DeviceInfo {
  token: string;
}

export { INetworkInfo, NetworkDeviceListQuery, NetworkDeviceListQueryInfo };
