import type { GenericID, GenericToken, Query } from "../../common/common.types.ts";

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
  /** Base64 decoded string */
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
  /** Base64 decoded string */
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

interface NetworkTokenInfo {
  name: string;
  token: GenericToken;
}

interface NetworkTokenCreateResponse {
  token: GenericToken;
  name: string;
  network: GenericID;
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

export type { NetworkInfo, NetworkCreateInfo, NetworkTokenInfo, NetworkQuery, NetworkTokenCreateResponse };
