import type { GenericID, Query, TagsObj } from "../../common/common.types.ts";

interface Permissions {
  effect: "allow" | "deny";
  /**
   * Access Management actions, e.g. `"access"`, `"run_analysis"`, `"execute"` (on `sql`), or `"call_endpoint"` (on `analysis`:
   * lets Run users or analyses call the analysis's Endpoint).
   */
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

export type { AccessCreateInfo, AccessInfo, AccessQuery, Permissions };
