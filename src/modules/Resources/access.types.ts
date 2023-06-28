import { GenericID, TagsObj, Query } from "../../common/common.types";

interface AccessCreateInfo {
  name: string;
  // TODO: permissions type
  permissions: [];
  // TODO: target type
  targets: [];
  profile?: GenericID;
  tags?: TagsObj[];
  active?: number;
}

interface AccessInfo extends AccessCreateInfo {
  id: GenericID;
  created_at: Date;
  updated_at: Date;
}

type AccessQuery = Query<AccessInfo, "name" | "active" | "created_at" | "updated_at">;

export { AccessCreateInfo, AccessInfo, AccessQuery };
