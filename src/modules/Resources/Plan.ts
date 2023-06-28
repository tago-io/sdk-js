import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { CurrentPrices, PlanInfo, PlanSetInfo, Summary } from "./plan.types";

class Plan extends TagoIOModule<GenericModuleParams> {
  /**
   * Active plan and set services limit
   * @param data
   * @example
   * data: {
   *   "plan": "plan_id",
   *   "sms": 100,
   *   "email": 1000,
   *   "data_records": 200000,
   *   "device_request": 250,
   *   "analysis": 1000
   * }
   */
  public async setPlanParameters(data: PlanSetInfo): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/account/plan/",
      method: "POST",
    });

    return result;
  }

  /**
   * Get Active Plan and Services
   */
  public async getActivePlan(): Promise<PlanInfo> {
    let result = await this.doRequest<PlanInfo>({
      path: "/account/plan",
      method: "GET",
    });

    result = dateParser(result, ["created_at", "end_date"]);

    return result;
  }

  /**
   * Shows a summary of how much your account is costing, divided by sections
   */
  public async summary(): Promise<Summary> {
    const result = await this.doRequest<Summary>({
      path: "/billing",
      method: "GET",
    });

    return result;
  }

  /**
   * Get current Tago pricing
   */
  public async getCurrentPrices(): Promise<CurrentPrices> {
    const result = await this.doRequest<CurrentPrices>({
      path: "/pricing",
      method: "GET",
    });

    return result;
  }
}

export default Plan;
