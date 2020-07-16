import {
  TagsObj,
  GenericID,
  Conditionals,
  PermissionOption,
  ExpireTimeOption,
  RunTypeOptions,
  Base64,
} from "../../common/comum.types";

interface AccountCreateInfo {
  name: string;
  email: string;
  password: string;
  cpassword: string;
  country?: string;
  timezone: string;
  company?: string;
  newsletter?: boolean;
  developer?: boolean;
}

interface AccountInfo extends Readonly<Omit<AccountCreateInfo, "passord" | "cpassword" | "country">> {
  active: Boolean;
  blocked: Boolean;
  created_at: String;
  id: GenericID;
  language: String;
  last_login: String;
  options: {
    user_view_welcome: Boolean;
    decimal_separator: string;
    thousand_separator: String;
    last_whats_new: String;
  };
  phone: String | null;
  send_invoice: Boolean;
  stripe_id: String | null;
  type: String;
  updated_at: String;
  plan: String;
}

interface BucketInfo {
  id: GenericID;
  name: string;
  description: string | void;
  visible: boolean;
  data_retention: string;
  data_retention_ignore: [];
  profile: GenericID;
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
  id: GenericID;
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

type ActionType = "condition" | "resource" | "interval" | "schedule" | "mqtt_topic";

type ActionTypeParams =
  | {
      script: GenericID[];
      type: "script";
    }
  | {
      message: string;
      subject: string;
      type: "notification";
    }
  | {
      message: string;
      subject: string;
      run_user: GenericID;
      type: "notification_run";
    }
  | {
      message: string;
      subject: string;
      to: string;
      type: "email";
    }
  | {
      message: string;
      to: string;
      type: "sms";
    }
  | {
      bucket: string;
      payload: string;
      topic: string;
      type: "mqtt";
    }
  | {
      headers: {};
      type: "post";
      url: string;
    };

interface ActionInfo {
  id: GenericID;
  active: boolean;
  blocked: boolean;
  company: string;
  created_at: string;
  email: string;
  language: string;
  last_login: string;
  name: string;
  newsletter: boolean;
  options: {
    user_view_welcome: boolean;
    decimal_separator: string;
    thousand_separator: string;
    last_whats_new: string;
  };
  phone: string;
  send_invoice: boolean;
  stripe_id: string;
  timezone: string;
  type: string;
  updated_at: string;
  plan: string;
}

type ActionTriggerType =
  | {
      resource: "device" | "bucket" | "file" | "analysis" | "action" | "am" | "user" | "financial" | "profile";
      when: "create" | "update" | "delete";
      tag_key: string;
      tag_value: string;
    }
  | {
      interval: string;
    }
  | {
      timezone: string | Date;
      cron: string;
    }
  | {
      device: string;
      variable: string;
      is: Conditionals;
      value: string;
      second_value?: string;
      value_type: "string" | "number" | "boolean" | "*";
      unlock?: boolean;
    };

interface ActionCreateInfo {
  /**
   * The name for the action.
   */
  name: string;
  /**
   * Profile identification
   */
  profile?: GenericID;
  /**
   * True if the action is active or not. The default is true.
   */
  active?: boolean;
  /**
   * An array of tags.
   */
  tags?: TagsObj[];
  /**
   * Description of the action.
   */
  description?: string | null;
  lock?: boolean;
  /**
   * Type of action
   */
  type?: ActionType;
  /**
   * Array of trigger configuration according to type
   */
  trigger?: ActionTriggerType[];
  /**
   * Action configuration
   */
  action?: ActionTypeParams;
  /**
   * Action action.
   */
  id?: GenericID;
}

interface ConnectorCreateInfo {
  name: string;
  description_short?: string;
  description_full?: string;
  description_end?: string;
  logo_url?: string;
  options?: {};
}

interface ConnectorInfo extends Readonly<ConnectorCreateInfo> {
  id: GenericID;
  public: boolean;
  categories: string[];
  created_at: string;
  updated_at: string;
  parent: GenericID;
  hidden_parse: boolean;
}

interface ConnectorTokenCreateInfo {
  name: string;
  expire_time?: ExpireTimeOption;
  permission?: PermissionOption;
}

interface ConnectorTokenInfo extends Readonly<ConnectorTokenCreateInfo> {
  created_at: string;
  updated_at: string;
  connector: GenericID;
  type: "type" | "connector";
}

interface AnalysisCreateInfo {
  name: string;
  description?: string | null;
  interval?: string;
  run_on?: "tago" | "external";
  file_name?: string;
  runtime?: RunTypeOptions;
  active?: true;
  profile?: GenericID;
  variables?: TagsObj[];
  tags?: TagsObj[];
}
interface AnalysisInfo extends Readonly<AnalysisCreateInfo> {
  id: GenericID;
  token: string;
  last_run: string;
  created_at: string;
  updated_at: string;
  locked_at: any;
  console?: string[];
}

interface ScriptFile {
  name: string;
  content: Base64;
  language: RunTypeOptions;
}

interface InviteResponse {
  expire_time: ExpireTimeOption;
  id: GenericID;
}

interface InviteInfo {
  permission?: PermissionOption;
  status?: string;
  copy_me?: boolean;
  expire_time?: ExpireTimeOption;
  allow_share?: boolean;
  allow_tags?: boolean;
  id?: GenericID;
  name?: string;
  email: string;
}
export {
  AccountInfo,
  BucketInfo,
  BucketCreateInfo,
  VariablesInfo,
  BucketDeviceInfo,
  ExportBucket,
  ExportBucketOption,
  ActionInfo,
  ActionCreateInfo,
  ConnectorInfo,
  ConnectorCreateInfo,
  ConnectorTokenCreateInfo,
  ConnectorTokenInfo,
  AnalysisInfo,
  AnalysisCreateInfo,
  ScriptFile,
  InviteResponse,
  InviteInfo,
  AccountCreateInfo,
};
