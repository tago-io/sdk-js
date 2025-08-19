import type { GenericID, GenericToken } from "../../common/common.types.ts";
import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";

interface PaymentMethodCreateInfo {
  name: string;
  token: GenericToken;
  brand?: string;
  default_card?: boolean;
}

interface PaymentMethodInfo {
  name: string;
  brand: string;
  /** Last four digits of card */
  last4: string;
  funding: string;
  exp_month: string;
  exp_year: string;
}

interface PaymentMethodListResponse {
  card: PaymentMethodInfo;
}

class PaymentMethods extends TagoIOModule<GenericModuleParams> {
  /**
   * Creates a new payment method for the current account using the provided payment information.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/204-payment-methods} Payment Methods
   * @see {@link https://help.tago.io/portal/en/kb/articles/205-common-billing-issues} Common Billing Issues
   */
  public async create(paymentMethodData: PaymentMethodCreateInfo): Promise<PaymentMethodInfo[]> {
    const result = await this.doRequest<PaymentMethodInfo[]>({
      path: "/account/payment_method/",
      method: "POST",
      body: paymentMethodData,
    });

    return result;
  }

  /**
   * Retrieves all payment methods associated with the current account.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/204-payment-methods} Payment Methods
   * @see {@link https://help.tago.io/portal/en/kb/articles/205-common-billing-issues} Common Billing Issues
   *
   * @example
   * If receive an error "Authorization Denied", check policy in Access Management.
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const paymentMethods = await resources.paymentMethods.list();
   * console.log(paymentMethods); // { card: { name: 'My Card', brand: 'Visa', last4: '1234', ... } }
   * ```
   */
  public async list(): Promise<PaymentMethodListResponse> {
    const result = await this.doRequest<PaymentMethodListResponse>({
      path: "/account/payment_method/",
      method: "GET",
    });

    return result;
  }

  /**
   * Removes a payment method from the account using its ID.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/204-payment-methods} Payment Methods
   * @see {@link https://help.tago.io/portal/en/kb/articles/205-common-billing-issues} Common Billing Issues
   */
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
