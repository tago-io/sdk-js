interface ConnectorInfo {
  active: boolean;
  blocked: boolean;
  company: string;
  created_at: string;
  email: string;
  id: string;
  language: string;
  last_login: string;
  name: string;
  newsletter: boolean;
  options: {};
  phone: string;
  send_invoice: boolean;
  stripe_id: string;
  timezone: string;
  type: string;
  updated_at: string;
  plan: string;
}

export { ConnectorInfo };
