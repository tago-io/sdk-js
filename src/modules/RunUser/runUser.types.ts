import { ExpireTimeOption, GenericID, GenericToken } from "../../common/common.types";
import { OTPType } from "../Account/account.types";

interface UserOptions {
  decimal_separator?: string;
  thousand_separator?: string;
  date_format?: string;
  time_format?: string;
  show_last_updated_at?: string;
}

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
  options?: UserOptions;
}

interface RunUserCreate {
  user: GenericID;
}

interface RunUserInfo extends RunUserCreateInfo {
  id: GenericID;
  created_at: Date;
  otp?: {
    authenticator: boolean;
    sms: boolean;
    email: boolean;
  };
}

interface RunUserLoginResponse {
  token: GenericToken;
  expire_date: ExpireTimeOption;
}

interface RunUserCredentials {
  email: string;
  password: string;
}
interface RunUserLogin extends RunUserCredentials {
  otp_type?: OTPType;
  pin_code?: string;
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

export {
  RunUserInfo,
  RunUserCreateInfo,
  RunUserCreate,
  RunUserLogin,
  RunUserCredentials,
  RunUserLoginResponse,
  RunNotificationInfo,
};
