import { GenericID, Query } from "../../common/common.types";

interface QRCodeFormat {
  type: string;
  schema_id: string;
  join_eui: string;
  dev_eui: string;
  profile_id: string;
  owner_token?: string;
  sn_number?: string;
  proprietary?: string;
  checksum?: string;
}

interface UploadFileOptions {
  filename: string;
  file_base64: string;
  public?: boolean;

  /**
   * Path where the file will be stored. Such as /reports/
   */
  path?: string;
}

type HexadecimalPayload = string;
interface DownlinkOptions {
  payload: HexadecimalPayload;
  port: string;
  confirmed?: boolean;
}

export { QRCodeFormat, UploadFileOptions, DownlinkOptions };
