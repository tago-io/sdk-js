import { GenericID, TagsObj, Query } from "../../common/common.types";

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
  created_at: Date;
  updated_at: Date;
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

interface ListVariablesOptions {
  /**
   * return amount of each variable
   */
  showAmount?: boolean;
  /**
   * return array of async deleted
   */
  showDeleted?: boolean;
  /**
   * Change origins to array of object with id and name
   */
  resolveOriginName?: boolean;
}

type BucketQuery = Query<BucketInfo, "name" | "visible" | "data_retention" | "created_at" | "updated_at">;

export {
  BucketInfo,
  BucketCreateInfo,
  VariablesInfo,
  BucketDeviceInfo,
  ExportBucket,
  ExportBucketOption,
  BucketQuery,
  ListVariablesOptions,
};
