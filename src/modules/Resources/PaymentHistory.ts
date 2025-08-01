import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule";
import type { PaymentInfo } from "./paymentHistory.types";

class PaymentHistory extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves the payment transaction history for the current account, including all past payments and their details.
   *
   * @example
   * If receive an error "Authorization Denied", check policy in Access Management.
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.paymentHistory.getHistory();
   * console.log(result); // [ { strip_id: 'stripe-id-123', invoice_number: 'ABC-123', status: 'paid', ... } ]
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
