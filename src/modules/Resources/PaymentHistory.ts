import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { PaymentInfo } from "./paymentHistory.types";

class PaymentHistory extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Retrieves the payment transaction history for the current account, including all past payments and their details.
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.paymentHistory.getHistory();
   * console.log(result);
   * ```
   */
  public async getHistory(): Promise<PaymentInfo[]> {
    const result = await this.doRequest<PaymentInfo[]>({
      path: "/account/payment_history/",
      method: "GET",
    });

    return result;
  }
}

export default PaymentHistory;
