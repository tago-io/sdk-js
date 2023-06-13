import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import type {
  BillingAddOn,
  BillingCoupon,
  BillingEditInformation,
  BillingEditResourceAllocation,
  BillingEditSubscription,
  BillingInformation,
  BillingPaymentHistoryEntry,
  BillingPaymentMethod,
  BillingPrices,
  BillingResourceAllocation,
  BillingSchedule,
  BillingSubscription,
  BillingSubscriptionSummary,
} from "./billing.types";

class Billing extends TagoIOModule<GenericModuleParams> {
  /**
   * Get the account subscription information.
   */
  public async getSubscription(): Promise<BillingSubscription> {
    const result = await this.doRequest<BillingSubscription>({
      path: `/account/subscription`,
      method: "GET",
    });

    return result;
  }

  /**
   * Edit an account's subscription to change plan, services or add-ons.
   *
   * Only one of either `plan`, `services`, or `addons` can be in `subscription`.
   *
   * @param subscription Object with updates to subscription.
   *
   * @throws If the subscription has a pending operation.
   * @throws If updating more than one of plan, services and add-ons at the same time.
   * @throws If purchasing add-ons or changing service limits on the Free plan.
   * @throws If using an invalid coupon.
   */
  public async editSubscription(subscription: BillingEditSubscription): Promise<void> {
    const result = await this.doRequest<void>({
      path: `/account/subscription`,
      method: "POST",
      body: subscription,
    });

    return result;
  }

  /**
   * Get information for the account subscription schedule for downgrades.
   *
   * In the response, `subscription` reflects how the entire subscription will look
   * at the end of the billing cycle when the downgrade is applied. If there is a scheduled downgrade
   * for either plan, services or add-ons, everything is returned and not only the changes.
   */
  public async getSubscriptionSchedule(): Promise<BillingSchedule> {
    const result = await this.doRequest<BillingSchedule>({
      path: `/account/subscription/schedule`,
      method: "GET",
    });

    return result;
  }

  /**
   * Get pricing for plans, services and add-ons.
   */
  public async getPrices(): Promise<BillingPrices> {
    const result = await this.doRequest<BillingPrices>({
      path: `/pricing`,
      method: "GET",
    });

    return result;
  }

  /**
   * Get pricing for plans, services and add-ons with proration when applicable.
   */
  public async getProratedPrices(): Promise<BillingPrices> {
    const result = await this.doRequest<BillingPrices>({
      path: `/pricing/prorated`,
      method: "GET",
    });

    return result;
  }

  /**
   * Get information about the account's payment method credit card, credit balance,
   * and the applied coupon.
   */
  public async getPaymentMethod(): Promise<BillingPaymentMethod> {
    const result = await this.doRequest<BillingPaymentMethod>({
      path: `/account/payment_method`,
      method: "GET",
    });

    return result;
  }

  /**
   * Edit an account's payment method.
   *
   * @param stripeCardToken Token for the new payment method added via Stripe API.
   *
   * @throws If token is invalid or Stripe can't create the payment method with it.
   *
   * @returns Success or error message.
   */
  public async editPaymentMethod(stripeCardToken: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/payment_method`,
      method: "POST",
      body: { token: stripeCardToken },
    });

    return result;
  }

  /**
   * Remove an account's payment method from the Stripe subscription.
   *
   * Only removes the card if the account is on the Free plan or if it has enough credit balance.
   *
   * @throws If subscription is active with an upcoming invoice.
   * @throws If account doesn't have a payment method.
   *
   * @returns Success or error message.
   */
  public async removePaymentMethod(): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/payment_method`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Get an account's billing information.
   */
  public async getBillingInformation(): Promise<BillingInformation> {
    const result = await this.doRequest<BillingInformation>({
      path: `/account/billing`,
      method: "GET",
    });

    return result;
  }

  /**
   * Edit an account's billing information.
   *
   * @param billingInformation Data to be updated in the account's billing information.
   */
  public async editBillingInformation(billingInformation: BillingEditInformation): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/billing`,
      method: "PUT",
      body: billingInformation,
    });

    return result;
  }

  /**
   * Get the resource allocation for all profiles in an account.
   */
  public async getAllocation(): Promise<BillingResourceAllocation> {
    const result = await this.doRequest<BillingResourceAllocation>({
      path: `/account/allocation`,
      method: "GET",
    });

    return result;
  }

  /**
   * Edit the resource allocation for the profiles in an account.
   *
   * The resource allocation array doesn't need to have an object for each of the account's profiles,
   * as long as the sum of the allocated amounts for the services doesn't exceed the account's service limit.
   *
   * The resource allocation object for a profile doesn't need to have all the services.
   *
   * @param allocation Array with the resource allocation
   *
   * @throws If passed an object that is not an allocation array.
   * @throws If the account only has one profile.
   * @throws If one of the profile IDs in the allocation array doesn't exist in the account.
   * @throws If the allocated amount for one of the services exceeds the available amount.
   *
   * @returns Success message.
   */
  public async editAllocation(allocation: BillingEditResourceAllocation): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/allocation`,
      method: "POST",
      body: allocation,
    });

    return result;
  }

  /**
   * Get the payment history for an account.
   *
   * The route uses pagination and the `lastId` parameter should be the `stripe_id`
   * parameter from the last history entry.
   *
   * @param queryObj Object to configure the amount of entries fetched and the ID of the history entry for pagination.
   *
   * @throws If `lastId` is passed and is invalid.
   *
   * @returns Array with payment history entries or an empty array when no entries are available.
   */
  public async getPaymentHistory(queryObj?: {
    amount?: number;
    lastId?: string;
  }): Promise<BillingPaymentHistoryEntry[]> {
    const result = await this.doRequest<BillingPaymentHistoryEntry[]>({
      path: `/account/payment_history`,
      method: "GET",
      params: {
        amount: queryObj?.amount ?? 10,
        ...(queryObj?.lastId && { last_id: queryObj?.lastId }),
      },
    });

    return result;
  }

  /**
   * Get a summary for important information in an account's subscription.
   *
   * The values returned by this route are cached.
   *
   * @returns Summary data for a subscription or `undefined` when the account does not have a subscription.
   */
  public async getSubscriptionSummary(): Promise<BillingSubscriptionSummary | undefined> {
    const result = await this.doRequest<BillingSubscriptionSummary | undefined>({
      path: `/account/subscription/summary`,
      method: "GET",
    });

    return result;
  }

  /**
   * Check if a coupon is valid by its promo code.
   *
   * @param code Customer-facing code for the coupon (promo code).
   *
   * @throws If the coupon code is not valid or not found.
   * @throws If coupon is specific to a an account.
   * @throws If coupon can only be applied to new subscriptions.
   */
  public async checkDiscountCoupon(code?: string): Promise<BillingCoupon> {
    const result = await this.doRequest<BillingCoupon>({
      path: `/account/subscription/coupon/${code}`,
      method: "GET",
    });

    return result;
  }

  /**
   * Cancel a scheduled downgrade.
   *
   * @throws If the subscription has no schedule.
   *
   * @returns Success message.
   */
  public async cancelDowngrade(): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/subscription/schedule`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Retry payment for an operation where the payment was unsuccessful.
   *
   * Works for payment errors in recurring payments or in subscription upgrade operations.
   *
   * @throws If account has no subscription.
   * @throws If there's no pending payment.
   * @throws If payment method is declined or for other payment processing errors.
   *
   * @returns Success message.
   */
  public async retryLastPayment(): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/subscription/pending/retry`,
      method: "POST",
    });

    return result;
  }

  /**
   * Cancel the last pending operation if the payment has failed.
   *
   * Works for subscription upgrade operations and not for recurring payment errors.
   *
   * @throws If there's no pending payment.
   *
   * @returns Success message.
   */
  public async cancelLastOperation(): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/subscription/pending/cancel`,
      method: "POST",
    });

    return result;
  }
}

export default Billing;
