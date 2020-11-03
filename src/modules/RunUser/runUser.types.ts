import { ExpireTimeOption, GenericID, GenericToken } from "../../common/common.types";

interface RunUserCreateInfo {
  name: string;
  email: string;
  password: string;
  timezone: string;
  company?: string;
  phone?: string | null;
  language?: string;
  active: boolean;
  newsletter?: boolean;
  options?: {};
}

interface RunUserInfo {
  id: GenericID;
  company: string;
  created_at: Date;
}

interface RunUserLoginResponse {
  token: GenericToken;
  expire_date: ExpireTimeOption;
}

interface RunUserLogin {
  email: string;
  password: string;
}

interface RunNotificationInfo {
  id: GenericID;
  run_user: GenericID;
  title: string;
  message: string;
  buttons: [];
  read: boolean;
  created_at: Date;
  updated_at: Date;
  buttons_enabled: boolean;
  buttons_autodisable: boolean;
}

export { RunUserInfo, RunUserCreateInfo, RunUserLogin, RunUserLoginResponse, RunNotificationInfo };
