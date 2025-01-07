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
  /**
   * @description Creates a new payment method for the current account using the provided payment information.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/204-payment-methods} Payment Methods
   * @see {@link https://help.tago.io/portal/en/kb/articles/205-common-billing-issues} Common Billing Issues
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const paymentData = {
   *   name: "John Doe",
   *   token: "pm_token_123",
   *   brand: "visa",
   *   default_card: true
   * };
   * const result = await Resources.paymentMethods.create(paymentData);
   * console.log(result);
   * ```
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
   * @description Retrieves all payment methods associated with the current account.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/204-payment-methods} Payment Methods
   * @see {@link https://help.tago.io/portal/en/kb/articles/205-common-billing-issues} Common Billing Issues
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const paymentMethods = await Resources.paymentMethods.list();
   * console.log(paymentMethods);
   * ```
   */
  public async list(): Promise<PaymentMethodInfo[]> {
    const result = await this.doRequest<PaymentMethodInfo[]>({
      path: "/account/payment_method/",
      method: "GET",
    });

    return result;
  }

  /**
   * @description Sets a specific payment method as the default payment option for the account.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/204-payment-methods} Payment Methods
   * @see {@link https://help.tago.io/portal/en/kb/articles/205-common-billing-issues} Common Billing Issues
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.paymentMethods.setDefault("payment-method-id-123");
   * console.log(result);
   * ```
   */
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

  /**
   * @description Removes a payment method from the account using its ID.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/204-payment-methods} Payment Methods
   * @see {@link https://help.tago.io/portal/en/kb/articles/205-common-billing-issues} Common Billing Issues
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.paymentMethods.delete("payment-method-id-123");
   * console.log(result);
   * ```
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
