import { GenericID, GenericToken, TagsObj, Query } from "../../common/common.types";

interface TagoCoreComputerUsage {
  total: number;
  used: number;
  description: string;
  title: string;
  type: string;
  detail: string;
}

interface TagoCoreOS {
  name: string;
  arch: string;
  version: string;
  platform?: string;
}

interface TagoCoreSummary {
  device: number;
  action: number;
  analysis: number;
}

interface TagoCoreInfo {
  active: boolean;
  computer_usage: TagoCoreComputerUsage[];
  connected: boolean;
  created_at: string;
  id: GenericID;
  internet_ip: string;
  last_connection: string;
  local_ips: string;
  name: string;
  os: TagoCoreOS;
  profile: string;
  summary: TagoCoreSummary;
  system_start_time: string;
  tags: TagsObj[];
  tcore_start_time: string;
  tcore_version: string;
  token: GenericToken;
  updated_at: string;
  machine_id: string;
  cluster: string;
}

interface TagoCoreListInfo {
  active: boolean;
  connected: boolean;
  created_at: string;
  id: GenericID;
  internet_ip: string;
  last_connection: string;
  local_ips: string;
  name: string;
  profile: string;
  system_start_time: string;
  tags: TagsObj[];
  tcore_start_time: string;
  tcore_version: string;
  updated_at: string;
  machine_id: string;
  cluster: string;
}

type TagoCoreQuery = Query<
  TagoCoreInfo,
  | "name"
  | "active"
  | "created_at"
  | "updated_at"
  | "last_connection"
  | "local_ips"
  | "internet_ip"
  | "system_start_time"
  | "tcore_start_time"
  | "machine_id"
>;

interface TagoCoreClusterListInfo {
  created_at: string;
  id: GenericID;
  name: string;
  profile: string;
  tags: TagsObj[];
  instance_amount: number;
  updated_at: string;
}

interface TagoCoreClusterInfo {
  created_at: string;
  id: GenericID;
  name: string;
  profile: string;
  tags: TagsObj[];
  instance_amount: number;
  token: string;
  updated_at: string;
  state: string;
}

interface TagoCoreClusterCreateInfo {
  name: string;
}

type TagoCoreClusterQuery = Query<TagoCoreClusterInfo, "name" | "created_at" | "updated_at">;

export {
  TagoCoreClusterCreateInfo,
  TagoCoreClusterInfo,
  TagoCoreClusterListInfo,
  TagoCoreClusterQuery,
  TagoCoreComputerUsage,
  TagoCoreInfo,
  TagoCoreListInfo,
  TagoCoreOS,
  TagoCoreQuery,
  TagoCoreSummary,
};
