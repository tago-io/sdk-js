interface AccountInfo {
  active: Boolean;
  blocked: Boolean;
  company: String;
  created_at: String;
  email: String;
  id: String;
  language: String;
  last_login: String;
  name: String;
  newsletter: Boolean;
  options: {
    user_view_welcome: Boolean;
    decimal_separator: string;
    thousand_separator: String;
    last_whats_new: String;
  };
  phone: String | null;
  send_invoice: Boolean;
  stripe_id: String | null;
  timezone: String;
  type: String;
  updated_at: String;
  plan: String;
}

export { AccountInfo };
