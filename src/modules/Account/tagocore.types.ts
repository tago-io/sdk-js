import { GenericID, GenericToken, TagsObj, Query } from "../../common/common.types";

interface TagoCoreListInfo {
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
  local_ip: string;
  public_ip: string;
  system_uptime: string;
  tcore_uptime: string;
}

type TagoCoreQuery = Query<
  TagoCoreListInfo,
  | "name"
  | "active"
  | "created_at"
  | "connected"
  | "updated_at"
  | "last_connection"
  | "local_ip"
  | "public_ip"
  | "system_uptime"
  | "tcore_uptime"
>;

export { TagoCoreListInfo, TagoCoreQuery };
