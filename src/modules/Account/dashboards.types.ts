import { Data, ExpireTimeOption, GenericID, GenericToken, Query, TagsObj } from "../../common/common.types";
import { BucketDeviceInfo } from "./buckets.types";

interface Arrangement {
  widget_id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tab?: string | null;
}

interface DashboardCreateInfo {
  label: string;
  arrangement?: Arrangement[];
  tags?: TagsObj[];
  visible?: boolean;
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
  type: string;
  blueprint_device_behavior: "more_than_one" | "always";
  blueprint_selector_behavior: void | "open" | "closed" | "always_open" | "always_closed";
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
        }
      ];
    }
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
  variables?: string;
  bucket?: GenericID;
  query?: "min" | "max" | "count" | "avg" | "sum";
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
interface EditDeviceResource {
  device: GenericID;
  name?: string;
  active?: boolean;
  /**
   * Allowed keys: tags.*, param.*
   * The value must always be a string.
   */
  [key: string]: string | boolean;
}
interface WidgetInfo {
  analysis_run?: GenericID;
  dashboard?: GenericID;
  display: object;
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

type PublicKeyResponse = { token: GenericToken; expire_time: ExpireTimeOption };

type widgetOverwriteOptions = "start_date" | "end_date" | "timezone";

type widgetOverwrite = {
  [key in widgetOverwriteOptions]: any;
};

export {
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
  GetDataModel,
};
