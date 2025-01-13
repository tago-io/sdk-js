import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { CurrentPrices, PlanInfo, PlanSetInfo, Summary } from "./plan.types";

class Plan extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Sets the active plan and configures service limits for the account, including SMS, email, data records, device requests and analysis quotas.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/207-upgrading-plans-services} Upgrading Plans & Services
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.plan.setPlanParameters({
   *   plan: "plan_id",
   *   sms: 100,
   *   email: 1000,
   *   data_records: 200000,
   *   device_request: 250,
   *   analysis: 1000
   * });
   * console.log(result);
   * ```
   */
  public async setPlanParameters(data: PlanSetInfo): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/account/plan/",
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * @description Retrieves information about the currently active plan and its associated services.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/114-account-plans} Account Plans
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.plan.getActivePlan();
   * console.log(result); // { plan: 'scale' }
   * ```
   */
  public async getActivePlan(): Promise<Pick<PlanInfo, "plan">> {
    let result = await this.doRequest<PlanInfo>({
      path: "/account/plan",
      method: "GET",
    });

    result = dateParser(result, ["created_at", "end_date"]);

    return result;
  }

  /**
   * @description Retrieves the current pricing information for all available services.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/114-account-plans} Account Plans
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const prices = await resources.plan.getCurrentPrices();
   * console.log(prices); // { analysis: [ { price: 0, amount: 3000 } ], data_records: [...], ... }
   * ```
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
