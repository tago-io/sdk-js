import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { CurrentPrices, PlanInfo, PlanSetInfo, Summary } from "./plan.types";

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

  public async summary(): Promise<Summary> {
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
