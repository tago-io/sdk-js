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
  created_at: string;
  updated_at: string;
  last_access: string;
  group_by: [];
  tabs: [];
  icon: {
    url: string;
    color?: string;
  };
  background: any;
  type: string;
  blueprint_device_behavior: any;
  blueprint_selector_behavior: any;
  theme: any;
  setup: any;
  shared: {
    id: string;
    email: string;
    name: string;
    free_account: boolean;
    allow_tags: boolean;
    expire_time: ExpireTimeOption;
    allow_share: boolean;
  };
}

interface DevicesRelated extends BucketDeviceInfo {
  bucket: GenericID;
}

type DashboardQuery = Query<DashboardInfo, "name" | "label" | "active" | "created_at" | "updated_at">;

type PublicKeyResponse = { token: GenericToken; expire_time: "never" };

export { DashboardQuery, PublicKeyResponse, DevicesRelated, DashboardCreateInfo, DashboardInfo };
