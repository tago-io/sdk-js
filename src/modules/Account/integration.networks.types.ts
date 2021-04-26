import { GenericID, Query, TokenData } from "../../common/common.types";

interface IDeviceParameters {
  name?: string;
  label?: string;
  type?: "text" | "dropdown" | "switch" | "number";
  default?: any;
  group?: "default" | "main" | "advanced" | "hide";
  options?: any[]; // optional, only for dropdown
}

interface NetworkCreateInfo {
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

interface NetworkInfo extends NetworkCreateInfo {
  id: GenericID;
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
}

interface NetworkTokenInfo extends TokenData {
  created_at: Date;
  updated_at: Date;
  Network: GenericID;
  type: "type" | "Network";
}

type NetworkQuery = Query<
  NetworkInfo,
  | "name"
  | "description"
  | "logo_url"
  | "icon_url"
  | "banner_url"
  | "device_parameters"
  | "middleware_endpoint"
  | "payload_encoder"
  | "payload_decoder"
  | "serial_number"
  | "documentation_url"
  | "public"
  | "created_at"
  | "updated_at"
>;

export { NetworkInfo, NetworkCreateInfo, NetworkTokenInfo, NetworkQuery };
