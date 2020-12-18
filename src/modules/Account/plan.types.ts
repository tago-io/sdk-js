import { ExpireTimeOption, GenericID } from "../../common/common.types";

interface PlanSetInfo {
  plan: string;
  sms?: number;
  email?: number;
  data_records?: number;
  device_request?: number;
  analysis?: number;
}

interface PlanInfo extends PlanSetInfo {
  id: GenericID;
  active: number;
  end_date: Date | null;
  price: number;
  created_at: Date;
  next_plan: string;
}

interface Profile {
  id: GenericID;
  name: string;
  limits: {
    input: number;
    output: number;
    sms: number;
    email: number;
    analysis: number;
    data_records: number;
  };
  addons: object;
}

interface Discount {
  description: string;
  value: number;
  expire_at: ExpireTimeOption;
}

interface Summary {
  profiles: Profile[];
  plan: string;
  discounts: Discount[];
}

interface Price {
  price: number;
  amount: number;
}

interface CurrentPrices {
  analysis: Price[];
  data_records: Price[];
  sms: Price[];
  output: Price[];
  input: Price[];
  email: Price[];
  plans: { name: string; price: number }[];
  addons: { name: string; price: number }[];
}

export { PlanSetInfo, PlanInfo, Profile, Discount, Summary, Price, CurrentPrices };
