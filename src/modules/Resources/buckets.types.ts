import type { GenericID, Query, TagsObj } from "../../common/common.types.ts";

type ExportBucket = {
  id: string;
  origin: string;
  variables: string[];
}[];

interface ExportBucketOption {
  start_date?: Date;
  end_date?: Date;
}

interface BucketCreateInfo {
  /** A name for the bucket. */
  name: string;
  /** Description for the bucket. */
  description?: string | undefined;
  /** Set if the bucket will be visible or not. Default True. */
  visible?: boolean;
  /** An array of tags. */
  tags?: TagsObj[];
}

/**
 * Type of data storage for a device (bucket).
 */
type DataStorageType = "immutable" | "mutable" | "legacy" | "hybrid";
type ChunkPeriod = "day" | "week" | "month" | "quarter";
interface BucketInfoBasic extends BucketCreateInfo {
  id: GenericID;
  /** Data storage type for the bucket. */
  profile: GenericID;
  last_retention: string | undefined;
  created_at: Date;
  updated_at: Date;
  chunk_period?: ChunkPeriod;
  chunk_retention?: number;
  data_retention?: string;
  data_retention_ignore?: [];
}

type BucketInfoImmutable = Omit<BucketInfoBasic, "data_retention" | "data_retention_ignore"> & {
  type: "immutable";
  /**
   * Chunk division to retain data in the device.
   *
   * Always returned for Immutable devices.
   */
  chunk_period: ChunkPeriod;
  /**
   * Amount of chunks to retain data according to the `chunk_period`.
   *
   * Always returned for Immutable devices.
   */
  chunk_retention: number;
};
type BucketInfoHybrid = Omit<BucketInfoBasic, "data_retention" | "data_retention_ignore"> & {
  type: "hybrid";
  /**
   * Chunk division to retain data in the device.
   *
   * Always returned for Hybrid devices.
   */
  chunk_period: ChunkPeriod;
  /**
   * Amount of chunks to retain data according to the `chunk_period`.
   *
   * Always returned for Hybrid devices.
   */
  chunk_retention: number;
  /**
   * Regex that routes each variable to the mutable side at insert time (unanchored
   * substring match).
   *
   * Always returned for Hybrid devices.
   */
  mutable_variable_regex: string;
};
type BucketInfoMutable = Omit<
  BucketInfoBasic,
  "chunk_period" | "chunk_retention" | "data_retention" | "data_retention_ignore"
> & {
  type: "mutable";
};
/**
 * @deprecated
 */
type BucketInfoLegacy = Omit<BucketInfoBasic, "chunk_period" | "chunk_retention"> & {
  type: "legacy";
  data_retention: string;
  data_retention_ignore: [];
};

type BucketInfo = BucketInfoImmutable | BucketInfoMutable | BucketInfoLegacy | BucketInfoHybrid;

interface BucketDeviceInfo {
  id: GenericID;
  name: string;
}

interface VariablesInfo {
  variable: string;
  origin: GenericID;
  origin_name?: string;
  amount?: number;
  deleted?: {
    origin: string;
    created_at: string;
  }[];
}

interface ListVariablesOptions {
  /** return amount of each variable */
  showAmount?: boolean;
  /** return array of async deleted */
  showDeleted?: boolean;
  /** Change origins to array of object with id and name */
  resolveOriginName?: boolean;
}

type BucketQuery = Query<BucketInfo, "name" | "visible" | "data_retention" | "created_at" | "updated_at">;

export type {
  BucketInfo,
  BucketCreateInfo,
  VariablesInfo,
  BucketDeviceInfo,
  ExportBucket,
  ExportBucketOption,
  BucketQuery,
  ListVariablesOptions,
  DataStorageType,
};
