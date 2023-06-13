import { ExpireTimeOption, GenericID, PermissionOption } from "../../common/common.types";

interface InviteResponse {
  expire_time: ExpireTimeOption;
  id: GenericID;
}

interface InviteInfo {
  permission?: PermissionOption;
  status?: string;
  copy_me?: boolean;
  expire_time?: ExpireTimeOption;
  allow_share?: boolean;
  allow_tags?: boolean;
  id?: GenericID;
  name?: string;
  email: string;
}

export { InviteInfo, InviteResponse };
