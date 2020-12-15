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
}

export { INetworkInfo };
