import { GenericID, GenericToken, TagsObj, Query } from "../../common/common.types";

interface TagoCoreCreateInfo {
  system_start_time: string;
  tcore_start_time: string;
}

interface TagoCoreInfo extends TagoCoreCreateInfo {
  id: GenericID;
  name: string;
  active: boolean;
  connected: boolean;
  profile: string;
  tags: TagsObj[];
  created_at: string;
  updated_at: string;
  last_connection: string;
  token: GenericToken;
  local_ips: string;
  internet_ip: string;
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
