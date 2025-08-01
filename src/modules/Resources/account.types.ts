import type { GenericID } from "../../common/common.types.ts";
import type { ProfileListInfo } from "./profile.types.ts";

interface AccountCreateInfo {
  /** Name of the account */
  name: string;
  /** Email of the account */
  email: string;
  /** Password of the account */
  password: string;
  /** Password confirmation */
  cpassword: string;
  /** Country of the account */
  country?: string;
  /** Timezone of the account */
  timezone: string;
  /** Company of the account */
  company?: string;
  /** Set true if wanna receive newsletter */
  newsletter?: boolean;
  developer?: boolean;
}

interface AccountInfo extends Omit<AccountCreateInfo, "password" | "cpassword" | "country"> {
  active: boolean;
  blocked: boolean;
  id: GenericID;
  /** language set e.g "en-us" */
  language: string;
  last_login: Date | null;
  options: {
    user_view_welcome: boolean;
    /** How decimal values are separated */
    decimal_separator: string;
    thousand_separator: string;
    last_whats_new: Date | null;
  };
  phone: string | null;
  send_invoice: boolean;
  stripe_id: string | null;
  /** Type of the account e.g "user" */
  type: string;
  /** Plan of the account e.g  "free" | "starter" | "scale" */
  plan: string;
  created_at: Date;
  updated_at: Date;
  /** One-Time Password (OTP) settings */
  otp?: {
    authenticator: boolean;
    sms: boolean;
    email: boolean;
  };
}

interface LoginResponse {
  type: string;
  id: GenericID;
  email: string;
  company: string;
  name: string;
  profiles: Required<ProfileListInfo>[];
}

interface LoginCredentials {
  email: string;
  password: string;
  otp_type: OTPType;
  pin_code: string;
}

type OTPType = "sms" | "email" | "authenticator";
interface TokenCreateInfo {
  /** Id of profile to create the token */
  profile_id: GenericID;
  /** Email of the account */
  email: string;
  /** Password of the account */
  password: string;
  /** OTP Pin Code */
  pin_code: string;
  /** OTP Type */
  otp_type: OTPType;
  /** Name of the token */
  name: string;
}

export type { AccountInfo, AccountCreateInfo, LoginResponse, TokenCreateInfo, OTPType, LoginCredentials };
