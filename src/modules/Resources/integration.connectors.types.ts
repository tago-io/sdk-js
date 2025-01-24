import { GenericID, Query, TokenData } from "../../common/common.types";

interface IDeviceParameters {
  name?: string;
  label?: string;
  type?: "text" | "dropdown" | "switch" | "number";
  default?: any;
  group?: "default" | "main" | "advanced" | "hide";
  /** Optional only for dropdown */
  options?: any[];
}

interface ConnectorCreateInfo {
  name?: string;
  description?: string;
  logo_url?: string;
  device_parameters?: IDeviceParameters[];
  networks?: GenericID[];
  payload_encoder?: string;
  /** Base64 decoded string */
  payload_decoder?: string;
  /** Refers to the **description** in the Documentation settings */
  install_text?: string;
  /** Refers to the **completion text** in the Documentation settings */
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
  networks?: GenericID[];
  /** Refers to the **description** in the Documentation settings */
  install_text?: string;
  /** Refers to the **completion text** in the Documentation settings */
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
