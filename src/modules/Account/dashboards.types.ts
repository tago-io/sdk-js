import { ExpireTimeOption, GenericID, GenericToken, Query, TagsObj } from "../../common/common.types";
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
  blueprint_devices: [{
    conditions: [{ key: string; value: string }];
    name: string;
    id: string;
    label?: string;
    filter_conditions?: [{
      blueprint_device: string;
      tag_key: string;
      type: string;
    }];
  }];
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

interface WidgetInfo {
  analysis_run?: GenericID;
  dashboard?: GenericID;
  display?: object;
  data: object[];
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
};
