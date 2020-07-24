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
  active: Boolean;
  blocked: Boolean;
  created_at: String;
  id: GenericID;
  language: String;
  last_login: Date | String;
  options: {
    user_view_welcome: Boolean;
    decimal_separator: string;
    thousand_separator: String;
    last_whats_new: String;
  };
  phone: String | null;
  send_invoice: Boolean;
  stripe_id: String | null;
  type: String;
  updated_at: String;
  plan: String;
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
}

export { AccountInfo, AccountCreateInfo, LoginResponse, TokenCreateInfo };
