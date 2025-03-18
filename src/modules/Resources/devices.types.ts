import { ExpireTimeOption, GenericID, GenericToken, PermissionOption, Query, TagsObj } from "../../common/common.types";
import { DataStorageType } from "./buckets.types";

interface DeviceQuery
  extends Query<DeviceInfo, "name" | "visible" | "active" | "last_input" | "created_at" | "updated_at"> {
  resolveBucketName?: boolean;
  resolveConnectorName?: boolean;
  serial?: string;
}

interface DeviceCreateInfoBasic {
  /**
   * Device name.
   */
  name: string;
  /**
   * Connector ID.
   */
  connector: GenericID;
  /**
   * Network ID.
   */
  network: GenericID;
  /**
   * Device's data storage (bucket) type.
   *
   * @default "legacy"
   */
  type?: DataStorageType;
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
   * Device serial number.
   */
  serie_number?: string;
  /**
   * If device will use connector parser
   */
  connector_parse?: boolean;
  /**
   * Javascript code for use as payload parser
   */
  parse_function?: string;
}

interface DeviceCreateInfoMutable extends Omit<DeviceCreateInfoBasic, "type"> {
  type: "mutable";
}

interface DeviceCreateInfoImmutable extends Omit<DeviceCreateInfoBasic, "type"> {
  type: "immutable";

  /**
   * Chunk division to retain data in the device.
   *
   * Required for Immutable devices.
   */
  chunk_period: "day" | "week" | "month" | "quarter";

  /**
   * Amount of chunks to retain data according to the `chunk_period`.
   * Integer between in the range of 0 to 36 (inclusive).
   *
   * Required for Immutable devices.
   */
  chunk_retention: number;
}
/**
 * @deprecated
 */
interface DeviceCreateInfoLegacy extends Omit<DeviceCreateInfoBasic, "type"> {
  type: "legacy";
}
type DeviceCreateInfo = DeviceCreateInfoLegacy | DeviceCreateInfoMutable | DeviceCreateInfoImmutable;
type DeviceEditInfo = Partial<Omit<DeviceCreateInfo, "chunk_period" | "type"> & { chunk_retention: number }>;

interface DeviceInfoBase {
  /**
   * Device ID.
   */
  id: GenericID;
  /**
   * ID of the profile that owns the device.
   */
  profile: GenericID;
  /**
   * Bucket storing the device's data.
   *
   * @deprecated
   */
  bucket: {
    id: GenericID;
    name: string;
  };
  /**
   * Payload parser.
   *
   * Encoded string when enabled, `null` when not enabled.
   */
  payload_decoder: string | null;
  /**
   * Date for the device's creation.
   */
  created_at: Date;
  /**
   * Date for the device's last update.
   */
  updated_at: Date;
  /**
   * Date for the device's last input.
   */
  last_input: Date | null;
  /**
   * Device-specific soft limits on RPM.
   *
   * `rpm` is `null` when not set or when the profile doesn't have the add-on.
   */
  rpm: {
    data_input?: number;
    data_output?: number;
  } | null;
}

type DeviceInfoImmutable = Required<
  DeviceInfoBase &
    Omit<DeviceCreateInfoImmutable, "configuration_params" | "serie_number" | "connector_parse" | "parse_function">
>;

type DeviceInfoMutable = Required<
  DeviceInfoBase &
    Omit<DeviceCreateInfoMutable, "configuration_params" | "serie_number" | "connector_parse" | "parse_function">
>;

type DeviceInfo = DeviceInfoImmutable | DeviceInfoMutable;

interface ConfigurationParams {
  sent: boolean;
  key: string;
  value: string;
  id?: string;
}

type DeviceCreateResponse = { device_id: GenericID; bucket_id: GenericID; token: GenericToken };

type DeviceListItem<T extends DeviceQuery["fields"][number] = "id"> = Pick<
  Omit<DeviceInfo, "bucket"> & { bucket: GenericID },
  "id" | "name" | "tags" | T
> &
  Partial<DeviceInfo>;

// "id" | "name" | "tags" |
interface DeviceTokenData {
  token: GenericToken;
  device_id: GenericID;
  network_id: GenericID;
  name: string;
  permission: PermissionOption;
  serie_number: string | void;
  last_authorization: string | void;
  expire_time: ExpireTimeOption;
  created_at: string;
}
interface ListDeviceTokenQuery
  extends Query<DeviceTokenDataList, "name" | "permission" | "serie_number" | "last_authorization" | "created_at"> {}

type DeviceTokenDataList<T extends ListDeviceTokenQuery["fields"][number] = null> = Pick<DeviceTokenData, T> &
  Partial<DeviceTokenData>;

interface DeviceChunkData {
  amount: number | null;
  id: string;
  from: string;
  to: string;
}

interface DeviceDataRestore {
  deviceID: GenericID;
  file_address: string;
  notification?: boolean;
}

interface DeviceDataBackup {
  deviceID: GenericID;
  /**
   *
   * The file address is the string template used to compose,
   * the chunk's file path on TagoIO Files.
   *
   * You can use the keys $DEVICE$, $CHUNK$, $FROM$ and $TO$ that
   * will be automatically replaced when building the path.
   *
   * $DEVICE$ - Device ID
   *
   * $CHUNK$ - Chunk ID
   *
   * $FROM$ - The chunk from date (ex: 2022-05-1)
   *
   * $TO$ - The chunk to date (ex: 2022-05-2)
   *
   * @example
   *
   * /devices/$DEVICE$/$FROM$_$TO$
   *
   */
  file_address: string;
  /**
   *
   * Enable headers to the CSV-generated files.
   * Headers will describe the variable's
   * data in each column.
   */
  headers?: boolean;
}

interface DeviceDataBackupResponse {
  chunk_id?: string;
  file_address: string;
  status: "scheduled";
}

/** @deprecated */
interface DeviceChunkParams {
  deviceID: GenericID;
  chunkID: string;
  /**
   *
   * Enable headers to the CSV-generated files.
   * Headers will describe the variable's
   * data in each column.
   */
  headers: boolean;
  /**
   *
   * The file address is the string template used to compose,
   * the chunk's file path on TagoIO Files.
   *
   * You can use the keys $DEVICE$, $CHUNK$, $FROM$ and $TO$ that
   * will be automatically replaced when building the path.
   *
   * $DEVICE$ - Device ID
   *
   * $CHUNK$ - Chunk ID
   *
   * $FROM$ - The chunk from date (ex: 2022-05-1)
   *
   * $TO$ - The chunk to date (ex: 2022-05-2)
   *
   * @example
   *
   * /devices/$DEVICE$/$FROM$_$TO$
   *
   */
  file_address: string;
}

/** @deprecated */
interface DeviceChunkCopyResponse {
  chunk_id: string;
  file_address: string;
  status: "scheduled";
}

export {
  DeviceQuery,
  DeviceCreateInfo,
  ConfigurationParams,
  DeviceInfo,
  DeviceEditInfo,
  DeviceCreateResponse,
  DeviceListItem,
  DeviceTokenData,
  DeviceTokenDataList,
  DeviceChunkData,
  ListDeviceTokenQuery,
  DeviceChunkParams,
  DeviceChunkCopyResponse,
  DeviceDataBackup,
  DeviceDataRestore,
  DeviceDataBackupResponse,
};
