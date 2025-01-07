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
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const planData = {
   *   plan: "plan_id",
   *   sms: 100,
   *   email: 1000,
   *   data_records: 200000,
   *   device_request: 250,
   *   analysis: 1000
   * };
   * const result = await Resources.plan.setPlanParameters(planData);
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
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const activePlan = await Resources.plan.getActivePlan();
   * console.log(activePlan);
   * ```
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
   * @description Retrieves a detailed summary of account costs broken down by different sections.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/billing} Billing Summary
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const billingSummary = await Resources.plan.summary();
   * console.log(billingSummary);
   * ```
   */
  public async summary(): Promise<Summary> {
    const result = await this.doRequest<Summary>({
      path: "/billing",
      method: "GET",
    });

    return result;
  }

  /**
   * @description Retrieves the current pricing information for all available services.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/114-account-plans} Account Plans
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const prices = await Resources.plan.getCurrentPrices();
   * console.log(prices);
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
