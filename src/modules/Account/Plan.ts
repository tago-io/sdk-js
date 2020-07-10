import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";
import { GenericID, GenericToken, ExpireTimeOption } from "../../comum/comum.types";

interface PlanSetInfo {
  plan: string;
  sms?: number;
  email?: number;
  data_records?: number;
  device_request?: number;
  analysis?: number;
}

interface PlanInfo extends Readonly<PlanSetInfo> {
  id: GenericID;
  active: number;
  end_date: string | null;
  price: number;
  created_at: string;
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

class Plan extends TagoIOModule<GenericModuleParams> {
  // TODO Internal Error
  public async setPlanParameters(data: PlanSetInfo): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/account/plan/",
      method: "POST",
    });

    return result;
  }
  public async getActivePlan(): Promise<PlanInfo> {
    const result = await this.doRequest<PlanInfo>({
      path: "/account/plan",
      method: "GET",
    });

    return result;
  }

  public async sumary(): Promise<Summary> {
    const result = await this.doRequest<Summary>({
      path: "/billing",
      method: "GET",
    });

    return result;
  }

  public async getCurrentPrices(): Promise<CurrentPrices> {
    const result = await this.doRequest<CurrentPrices>({
      path: "/pricing",
      method: "GET",
    });

    return result;
  }
}

export default Plan;
