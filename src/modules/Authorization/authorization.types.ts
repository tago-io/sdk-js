import type { ExpireTimeOption, GenericID, PermissionOption } from "../../common/common.types.ts";

interface AuthorizationInfo {
  name: string;
  type: string;
  permission: PermissionOption;
  serie_number: string | null;
  last_authorization: Date | null;
  verification_code: string;
  expire_time: ExpireTimeOption;
  ref_id: GenericID;
  created_at: Date;
  created_by: string | null;
}

export type { AuthorizationInfo };
