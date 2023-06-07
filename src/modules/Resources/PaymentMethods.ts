import { GenericID, GenericToken } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

interface PaymentMethodCreateInfo {
  name: string;
  token: GenericToken;
  brand?: string;
  default_card?: boolean;
}

interface PaymentMethodInfo extends PaymentMethodCreateInfo {
  id: GenericID;
  last4: string;
  active: boolean;
  default_card: boolean;
  exp_month: string;
  exp_year: string;
}

class PaymentMethods extends TagoIOModule<GenericModuleParams> {
  public async create(paymentMethodData: PaymentMethodCreateInfo): Promise<PaymentMethodInfo[]> {
    const result = await this.doRequest<PaymentMethodInfo[]>({
      path: "/account/payment_method/",
      method: "POST",
      body: paymentMethodData,
    });

    return result;
  }

  public async list(): Promise<PaymentMethodInfo[]> {
    const result = await this.doRequest<PaymentMethodInfo[]>({
      path: "/account/payment_method/",
      method: "GET",
    });

    return result;
  }

  public async setDefault(paymentMethodID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/account/payment_method/",
      method: "PUT",
      body: {
        id: paymentMethodID,
      },
    });

    return result;
  }

  public async delete(paymentMethodID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/account/payment_method/",
      method: "DELETE",
      body: {
        id: paymentMethodID,
      },
    });

    return result;
  }
}

export default PaymentMethods;
