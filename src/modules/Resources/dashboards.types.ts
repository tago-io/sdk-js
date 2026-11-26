import type { Data, ExpireTimeOption, GenericID, GenericToken, Query, TagsObj } from "../../common/common.types.ts";
import type { BucketDeviceInfo } from "./buckets.types.ts";

interface Arrangement {
  widget_id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tab?: string | null;
}

type DashboardType = "dashboard" | "blueprint" | "custom" | "ai";

interface DashboardCreateInfo {
  label: string;
  arrangement?: Arrangement[];
  tags?: TagsObj[];
  visible?: boolean;
  type?: DashboardType;
  /** Each run user gets an individual generated dashboard. Only valid on `type: "ai"`. */
  per_user?: boolean;
  /** Rules for the AI generator, up to 10,000 characters. */
  ai_instructions?: string | null;
}

interface DashboardInfo extends DashboardCreateInfo {
  id: GenericID;
  created_at: Date;
  updated_at: Date;
  last_access: Date | null;
  group_by: [];
  tabs: [];
  icon: {
    url: string;
    color?: string;
  };
  background: any;
  type: DashboardType;
  blueprint_device_behavior: "more_than_one" | "always";
  blueprint_selector_behavior: undefined | "open" | "closed" | "always_open" | "always_closed";
  blueprint_devices: [
    {
      conditions: [{ key: string; value: string }];
      name: string;
      id: string;
      label?: string;
      filter_conditions?: [
        {
          blueprint_device: string;
          tag_key: string;
          type: string;
        },
      ];
    },
  ];
  theme: any;
  setup: any;
  shared: {
    id: string;
    email: string;
    name: string;
    free_account: boolean;
    allow_tags: boolean;
    expire_time: string;
    allow_share: boolean;
  };
}

interface WidgetData {
  origin: GenericID;
  qty?: number;
  timezone?: string;
  variables?: string[];
  bucket?: GenericID;
  query?:
    | "min"
    | "max"
    | "count"
    | "avg"
    | "sum"
    | "last_value"
    | "last_item"
    | "last_insert"
    | "aggregate"
    | "conditional";
  start_date?: Date | string;
  end_date?: Date | string;
  overwrite?: boolean;
}

interface WidgetResource {
  filter: TagsObj[];
}

type ResourceTag = `tags.${string}`;
type ResourceParam = `param.${string}`;

type DeviceResourceView =
  | ResourceTag
  | ResourceParam
  | "name"
  | "id"
  | "bucket_name"
  | "network_name"
  | "connector_name"
  | "connector"
  | "network"
  | "bucket"
  | "last_input"
  | "created_at"
  | "active";

interface WidgetDeviceResource extends WidgetResource {
  type: "device";
  view: DeviceResourceView;
  editable: "name" | ResourceTag | ResourceParam;
}

/**
 * Allowed keys: tags.\* or param.\*
 *
 * The value must always be a string or boolean.
 */
type EditDeviceResource = {
  device: GenericID;
  name?: string;
  active?: boolean;
} & {
  [key: string]: string | boolean;
};

interface EditResourceOptions {
  /** Identifier to send to the Analysis scope in `widget_exec`. */
  identifier?: string;
}

interface WidgetInfo {
  analysis_run?: GenericID;
  dashboard?: GenericID;
  display: any;
  data?: WidgetData[];
  resource?: WidgetDeviceResource[];
  id?: GenericID;
  label: string;
  realtime?: boolean | null;
  type: string;
}
interface DevicesRelated extends BucketDeviceInfo {
  bucket: GenericID;
}

interface AnalysisRelated {
  id: GenericID;
  name: string;
}

interface PostDataModel extends Omit<Data, "id" | "created_at"> {
  origin: GenericID;
  variable: string;
}

interface GetDataModel {
  overwrite?: widgetOverwrite;
  blueprint_devices?: { origin: GenericID; id: GenericID; bucket?: GenericID }[];
  page?: number;
  amount?: number;
}

type EditDataModel = PostDataModel & { id: GenericID };

type DashboardQuery = Query<DashboardInfo, "name" | "label" | "active" | "created_at" | "updated_at">;

interface DashboardGenerateHistoryEntry {
  role: "user" | "assistant";
  content: string;
}

interface DashboardGenerateParams {
  /** What to build or change. */
  prompt: string;
  /** Earlier turns of the conversation, oldest first. */
  history?: DashboardGenerateHistoryEntry[];
  /** Run user whose individual dashboard to build or edit. Requires `per_user` on the dashboard. */
  run_user?: GenericID;
}

interface DashboardRunUsersQuery {
  /** Matches name or email. */
  search?: string;
  /** Starts at 1. */
  page?: number;
  /** Starts at 1. Default and max 1000. */
  amount?: number;
}

interface DashboardRunUser {
  id: GenericID;
  name: string | null;
  email: string | null;
  /** True once the run user has a generated dashboard. */
  has_dashboard: boolean;
}

type PublicKeyResponse = { token: GenericToken; expire_time: ExpireTimeOption };

type widgetOverwriteOptions = "start_date" | "end_date" | "timezone";

type widgetOverwrite = {
  [key in widgetOverwriteOptions]: any;
};

export type {
  DashboardType,
  DashboardGenerateHistoryEntry,
  DashboardGenerateParams,
  DashboardRunUsersQuery,
  DashboardRunUser,
  DashboardQuery,
  PublicKeyResponse,
  DevicesRelated,
  AnalysisRelated,
  DashboardCreateInfo,
  DashboardInfo,
  WidgetInfo,
  widgetOverwrite,
  PostDataModel,
  EditDataModel,
  EditDeviceResource,
  EditResourceOptions,
  GetDataModel,
};
