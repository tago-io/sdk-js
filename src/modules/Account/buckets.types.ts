import { GenericID, TagsObj, Query } from "../../common/common.types";

type ExportBucket = {
  id: string;
  origin: string;
  variables: string[];
}[];

interface ExportBucketOption {
  start_date?: string;
  end_date?: string;
}

interface BucketCreateInfo {
  /**
   * A name for the bucket.
   */
  name: string;
  /**
   * Description for the bucket.
   */
  description?: string | void;
  /**
   * Set if the bucket will be visible or not. Default True.
   */
  visible?: boolean;
  /**
   * An array of tags.
   */
  tags?: TagsObj[];
}

interface BucketInfo extends BucketCreateInfo {
  id: GenericID;
  data_retention: string;
  data_retention_ignore: [];
  profile: GenericID;
  database: string | void;
  last_backup: string | void;
  last_retention: string | void;
  created_at: string;
  updated_at: string;
}

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

type BucketQuery = Query<BucketInfo, "name" | "visible" | "data_retention" | "created_at" | "updated_at">;

export { BucketInfo, BucketCreateInfo, VariablesInfo, BucketDeviceInfo, ExportBucket, ExportBucketOption, BucketQuery };
