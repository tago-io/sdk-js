import { GenericID, GenericToken } from "../../common/common.types";

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
  created_at: string;
}

interface RunUserLoginResponse {
  token: GenericToken;
  expire_date: string;
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
  created_at: string;
  updated_at: string;
  buttons_enabled: boolean;
  buttons_autodisable: boolean;
}

export { RunUserInfo, RunUserCreateInfo, RunUserLogin, RunUserLoginResponse, RunNotificationInfo };
