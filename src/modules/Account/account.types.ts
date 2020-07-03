import { TagsObj } from "../../comum/comum.types";

interface AccountInfo {
  active: Boolean;
  blocked: Boolean;
  company: String;
  created_at: String;
  email: String;
  id: String;
  language: String;
  last_login: String;
  name: String;
  newsletter: Boolean;
  options: {
    user_view_welcome: Boolean;
    decimal_separator: string;
    thousand_separator: String;
    last_whats_new: String;
  };
  phone: String | null;
  send_invoice: Boolean;
  stripe_id: String | null;
  timezone: String;
  type: String;
  updated_at: String;
  plan: String;
}

interface BucketInfo {
  id: string;
  name: string;
  description: string | void;
  visible: boolean;
  data_retention: string;
  data_retention_ignore: [];
  profile: string;
  tags: TagsObj[];
  database: string | void;
  last_backup: string | void;
  last_retention: string | void;
  created_at: string;
  updated_at: string;
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

interface BucketDeviceInfo {
  id: string;
  name: string;
}
interface VariablesInfo {
  variable: string;
  unitis: string[];
  origins: string[] | BucketDeviceInfo[];
  amount?: number;
  deleted?: {
    origin: string;
    created_at: string;
  }[];
}

type ExportBucket = {
  id: string;
  origin: string;
  variables: string[];
}[];

interface ExportBucketOption {
  start_date?: string;
  end_date?: string;
}

export { AccountInfo, BucketInfo, BucketCreateInfo, VariablesInfo, BucketDeviceInfo, ExportBucket, ExportBucketOption };
