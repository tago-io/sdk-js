import { GenericID } from "../../common/common.types";

interface AccountCreateInfo {
  /**
   * Name of the account
   */
  name: string;
  /**
   * Email of the account
   */
  email: string;
  /**
   * Password of the account
   */
  password: string;
  /**
   * Password confirmation
   */
  cpassword: string;
  /**
   * Country of the account
   */
  country?: string;
  /**
   * Timezone of the account
   */
  timezone: string;
  /**
   * Company of the account
   */
  company?: string;
  /**
   * Set true if wanna receive newsletter
   */
  newsletter?: boolean;
  developer?: boolean;
}

interface AccountInfo extends Omit<AccountCreateInfo, "password" | "cpassword" | "country"> {
  active: boolean;
  blocked: boolean;
  id: GenericID;
  language: string;
  last_login: Date | null;
  options: {
    user_view_welcome: boolean;
    decimal_separator: string;
    thousand_separator: string;
    last_whats_new: Date | null;
  };
  phone: string | null;
  send_invoice: boolean;
  stripe_id: string | null;
  type: string;
  plan: string;
  created_at: Date;
  updated_at: Date;
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
  profiles: {
    account: GenericID;
    id: GenericID;
    name: GenericID;
    logo_url: string | null;
  }[];
}

type OTPType = "sms" | "email" | "authenticator";
interface TokenCreateInfo {
  /**
   * Id of profile to create the token
   */
  profile_id: GenericID;
  /**
   * Email of the account
   */
  email: string;
  /**
   * Password of the account
   */
  password: string;

  /**
   * OTP Pin Code
   */
  pin_code: string;
  /**
   * OTP Type
   */
  otp_type: OTPType;
}

export { AccountInfo, AccountCreateInfo, LoginResponse, TokenCreateInfo, OTPType };
