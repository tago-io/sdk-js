import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { PaymentInfo } from "./paymentHistory.types";

class PaymentHistory extends TagoIOModule<GenericModuleParams> {
  /**
   * Get the payment History of the current account
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
