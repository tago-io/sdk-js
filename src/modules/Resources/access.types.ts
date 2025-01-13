import { GenericID, TagsObj, Query } from "../../common/common.types";

interface Permissions {
  // TODO: Add enumerator for effect
  effect: string;
  action: string[];
  resource: string[];
}

interface AccessCreateInfo {
  name: string;
  permissions: Permissions[];
  // TODO: target type
  targets: [];
  profile?: GenericID;
  tags?: TagsObj[];
  active?: boolean;
}

interface AccessInfo extends AccessCreateInfo {
  id: GenericID;
  created_at: Date;
  updated_at: Date;
}

type AccessQuery = Query<AccessInfo, "name" | "active" | "created_at" | "updated_at">;

export { AccessCreateInfo, AccessInfo, AccessQuery, Permissions };
