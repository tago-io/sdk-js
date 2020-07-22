import { GenericID } from "../../common/common.types";

interface AccountCreateInfo {
  /**
   * Name of the account
   * @type {string}
   * @memberof AccountCreateInfo
   */
  name: string;
  /**
   * Email of the account
   *
   * @type {string}
   * @memberof AccountCreateInfo
   */
  email: string;
  /**
   * Password of the account
   *
   * @type {string}
   * @memberof AccountCreateInfo
   */
  password: string;
  /**
   * Password confirmation
   *
   * @type {string}
   * @memberof AccountCreateInfo
   */
  cpassword: string;
  /**
   * Country of the account
   *
   * @type {string}
   * @memberof AccountCreateInfo
   */
  country?: string;
  /**
   * Timezone of the account
   *
   * @type {(Date | string)}
   * @memberof AccountCreateInfo
   */
  timezone: Date | string;
  /**
   * Company of the account
   *
   * @type {string}
   * @memberof AccountCreateInfo
   */
  company?: string;
  /**
   * Set true if wanna receive newsletter
   *
   * @type {boolean}
   * @memberof AccountCreateInfo
   */
  newsletter?: boolean;
  developer?: boolean;
}

interface AccountInfo extends Readonly<Omit<AccountCreateInfo, "password" | "cpassword" | "country">> {
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
   *
   * @type {GenericID}
   * @memberof TokenCreateInfo
   */
  profile_id: GenericID;
  /**
   * Email of the account
   *
   * @type {string}
   * @memberof TokenCreateInfo
   */
  email: string;
  /**
   * Password of the account
   *
   * @type {string}
   * @memberof TokenCreateInfo
   */
  password: string;
}

export { AccountInfo, AccountCreateInfo, LoginResponse, TokenCreateInfo };
