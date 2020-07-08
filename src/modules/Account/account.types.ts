import {
  TagsObj,
  GenericID,
  Conditionals,
  PermissionOption,
  ExpireTimeOption,
  RunTypeOptions,
  Base64,
} from "../../comum/comum.types";

interface AccountInfo {
  active: Boolean;
  blocked: Boolean;
  company: String;
  created_at: String;
  email: String;
  id: GenericID;
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
  id: string;
  name: string;
  type: ActionType;
  description: string | null;
  active: boolean;
  lock: boolean;
  last_triggered: "never" | string;
  profile: GenericID;
  action: ActionTypeParams;
  tags: TagsObj[];
  created_at: string;
  updated_at: string;
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
};
