import { GenericID, GenericToken, Query, TagsObj, PermissionOption, ExpireTimeOption } from "../../common/common.types";
import { DataStorageType } from "./buckets.types";

interface DeviceQuery
  extends Query<
    DeviceInfo,
    "name" | "visible" | "active" | "last_input" | "last_output" | "created_at" | "updated_at"
  > {
  resolveBucketName?: boolean;
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
  description?: string | void;
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

interface DeviceInfo extends Required<Omit<DeviceCreateInfoBasic, "configuration_params">> {
  /**
   * Device ID.
   */
  id: GenericID;
  /**
   * Device's data storage (bucket) type.
   */
  type: DataStorageType;
  /**
   * ID of the profile that owns the device.
   */
  profile: GenericID;
  /**
   * Bucket storing the device's data.
   */
  bucket: {
    id: GenericID;
    name: string;
  };
  /**
   * Date for the device's last output.
   */
  last_output: Date | null;
  /**
   * Date for the device's last input.
   */
  last_input: Date | null;
  /**
   * Date for the device's last update.
   */
  updated_at: Date;
  /**
   * Date for the device's creation.
   */
  created_at: Date;
  /**
   * Date for the device's last inspection.
   */
  inspected_at: Date | null;
  /**
   * Date for the device's last data retention.
   */
  last_retention: Date | null;
}

interface ConfigurationParams {
  sent: boolean;
  key: string;
  value: string;
  id?: string;
}

type DeviceCreateResponse = { device_id: GenericID; bucket_id: GenericID; token: GenericToken };

type DeviceListItem = Omit<DeviceInfo, "bucket"> & { bucket: GenericID };

interface DeviceTokenDataList {
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

interface DeviceChunkData {
  amount: number | null;
  id: string;
  from: string;
  to: string;
}

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
   * will be automically replaced when building the path.
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
  DeviceTokenDataList,
  DeviceChunkData,
  ListDeviceTokenQuery,
  DeviceChunkParams,
  DeviceChunkCopyResponse,
};
