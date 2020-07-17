import { GenericID } from "../../common/comum.types";

interface AccountCreateInfo {
  name: string;
  email: string;
  password: string;
  cpassword: string;
  country?: string;
  timezone: string;
  company?: string;
  newsletter?: boolean;
  developer?: boolean;
}

interface AccountInfo extends Readonly<Omit<AccountCreateInfo, "password" | "cpassword" | "country">> {
  active: Boolean;
  blocked: Boolean;
  created_at: String;
  id: GenericID;
  language: String;
  last_login: String;
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

export { AccountInfo, AccountCreateInfo };
