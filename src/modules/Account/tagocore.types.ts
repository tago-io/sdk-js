import { GenericID, GenericToken, TagsObj, Query } from "../../common/common.types";

interface TagoCoreComputerUsage {
  total: number;
  used: number;
  description: string;
  title: string;
  type: string;
  detail: string;
}

interface TagoCoreSummary {
  device: number;
  action: number;
  analysis: number;
}

interface TagoCoreInfo {
  id: GenericID;
  name: string;
  active: boolean;
  connected: boolean;
  profile: string;
  tags: TagsObj[];
  created_at: string;
  updated_at: string;
  last_connection: string;
  system_start_time: string;
  tcore_start_time: string;
  token: GenericToken;
  local_ips: string;
  internet_ip: string;
  tcore_version: string;
  summary: TagoCoreSummary;
  computer_usage: TagoCoreComputerUsage;
}

type TagoCoreQuery = Query<
  TagoCoreInfo,
  | "name"
  | "active"
  | "created_at"
  | "connected"
  | "updated_at"
  | "last_connection"
  | "local_ips"
  | "internet_ip"
  | "system_start_time"
  | "tcore_start_time"
>;

export { TagoCoreInfo, TagoCoreQuery };
