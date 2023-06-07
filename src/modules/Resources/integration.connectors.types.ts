import { GenericID, Query, TokenData } from "../../common/common.types";

interface IDeviceParameters {
  name?: string;
  label?: string;
  type?: "text" | "dropdown" | "switch" | "number";
  default?: any;
  group?: "default" | "main" | "advanced" | "hide";
  options?: any[]; // optional, only for dropdown
}

interface ConnectorCreateInfo {
  name?: string;
  description?: string;
  logo_url?: string;
  device_parameters?: IDeviceParameters[];
  networks?: string[];
  payload_decoder?: string;
  install_text?: string;
  install_end_text?: string;
  device_annotation?: string;
}

interface ConnectorInfo extends ConnectorCreateInfo {
  id: GenericID;
  public: boolean;
  description?: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
  device_parameters?: IDeviceParameters[];
  networks?: string[];
  install_text?: string;
  install_end_text?: string;
  device_annotation?: string;
}

type ConnectorQuery = Query<
  ConnectorInfo,
  | "name"
  | "id"
  | "description"
  | "logo_url"
  | "install_text"
  | "install_end_text"
  | "device_annotation"
  | "payload_decoder"
  | "networks"
>;

export { ConnectorInfo, ConnectorCreateInfo, ConnectorQuery };
