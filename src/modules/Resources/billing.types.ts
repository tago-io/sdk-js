import { GenericID } from "../../common/common.types";

type BillingPlan = "free" | "starter" | "scale";

type BillingService =
  | "input"
  | "output"
  | "analysis"
  | "data_records"
  | "sms"
  | "email"
  | "run_users"
  | "push_notification"
  | "file_storage";

type BillingAddOn = "mobile" | "custom_dns";

type BillingServiceSubscription = {
  limit: number;
};

type BillingSubscriptionServices = Record<BillingService, BillingServiceSubscription>;

type BillingSubscriptionAddOns = Record<BillingAddOn, GenericID[]>;

type BillingPaymentError = {
  /**
   * Payment error message.
   */
  message: string | null;
  /**
   * More details on the payment error.
   */
  details: string | null;
};

type BillingPaymentPastDue = {
  /**
   * Amount due that was not paid in a recurring payment.
   */
  amount_due: number;
  /**
   * Amount of attempts for the retried recurring payment.
   */
  attempt_count: number;
  /**
   * URL for the invoice related to the failed recurring payment.
   */
  invoice_url: string;
};

type BillingSubscription = {
  /**
   * Account ID.
   */
  account: GenericID;
  /**
   * Account plan.
   */
  plan: BillingPlan;
  /**
   * Limits for each service in the account's subscription.
   */
  services: BillingSubscriptionServices;
  /**
   * Add-ons in the account's subscription.
   */
  addons: BillingSubscriptionAddOns;
  /**
   * Current cycle for the account's subscription.
   */
  current_cycle: {
    /**
     * Date when the current cycle started.
     */
    start: string;
    /**
     * Date when the current cycle ends.
     */
    end: string;
  };
  /**
   * Whether changes are still being processed and awaiting response from Stripe.
   */
  processing: boolean;
  /**
   * Payment errors in the account's subscription.
   */
  payment_error?: BillingPaymentError;
  /**
   * Past due information for recurring payment errors.
   */
  past_due?: BillingPaymentPastDue;
  /**
   * Value of the upcoming invoice.
   */
  upcoming_invoice_total: number;
  /**
   * Timestamp when the trial for the subscription ends if the subscription has a trial active.
   */
  trial_end: string | null;
};

type BillingEditSubscription = {
  /**
   * New account plan.
   *
   * Only one of `plan`, `services` and `addons` is accepted.
   */
  plan?: BillingPlan;
  /**
   * New limits for each service in the account's subscription.
   *
   * Only one of `plan`, `services` and `addons` is accepted.
   */
  services?: Partial<BillingSubscriptionServices>;
  /**
   * New add-ons in the account's subscription.
   *
   * Only one of `plan`, `services` and `addons` is accepted.
   */
  addons?: Partial<BillingSubscriptionAddOns>;
  /**
   * Coupon code.
   */
  coupon?: string;
};

type BillingServiceSubscriptionSchedule = Record<
  BillingService,
  BillingServiceSubscription & {
    /**
     * Amount of proportional change the service's allocation will undergo.
     */
    proportional_change?: number | undefined;
  }
>;

type BillingSubscriptionSchedule = {
  /**
   * Account plan after the downgrade is applied.
   */
  plan?: BillingPlan;
  /**
   * Limits for each service in the account's subscription after the downgrade is applied.
   */
  services?: BillingServiceSubscriptionSchedule;
  /**
   * Add-ons in the account's subscription after the downgrade is applied.
   */
  addons?: Partial<BillingSubscriptionAddOns>;
};

type BillingSchedule = {
  /**
   * Account ID.
   */
  account: GenericID;
  /**
   * When the schedule will be applied to the subscription.
   */
  release_at: string | null;
  /**
   * Scheduled subscription changes.
   */
  subscription?: BillingSubscriptionSchedule;
};

type BillingServicePrice = {
  /**
   * Amount available in the service tier.
   */
  amount: number;
  /**
   * Price for the service tier.
   */
  price: number;
};

type BillingAllServicePrices = Record<BillingService, BillingServicePrice[]>;

type BillingPlanPrices = Array<{
  /**
   * Plan name.
   */
  name: BillingPlan;
  /**
   * Plan price.
   */
  price: number;
}>;

type BillingAddOnPrices = Array<{
  /**
   * Add-on name.
   */
  name: BillingAddOn;
  /**
   * Add-on price.
   */
  price: number;
}>;

type BillingPrices = {
  /**
   * Prices for each plan.
   */
  plans: BillingPlanPrices;
  /**
   * Prices for each add-on.
   */
  addons: BillingAddOnPrices;
} & BillingAllServicePrices;

type BillingPaymentMethodCard = {
  /**
   * Name on the credit card.
   */
  name: string;
  /**
   * Credit card brand.
   */
  brand: string;
  /**
   * Credit card's last four digits.
   */
  last4: string;
  /**
   * Credit card funding type.
   */
  funding: string;
  /**
   * Credit card's expiration month.
   */
  exp_month: number;
  /**
   * Credit card's expiration year.
   */
  exp_year: number;
};

type BillingPaymentMethodBalance = {
  /**
   * Amount of credit in balance.
   */
  amount: number;
  /**
   * Currency of the credit balance.
   */
  currency: string;
};

type BillingCoupon = {
  /**
   * Coupon promotional code (if customer-facing) or coupon name.
   */
  code: string;
  /**
   * Amount off the original value.
   *
   * Only one of `amount_off` and `percentage_off` will not be `null`.
   */
  amount_off: number | null;
  /**
   * Percentage off the original value.
   *
   * Only one of `amount_off` and `percentage_off` will not be `null`.
   */
  percentage_off: number | null;
  /**
   * Services, plans, and add-ons the coupon is applicable to.
   * Applies to everything when `null`.
   */
  applies_to: Array<Exclude<BillingPlan, "free"> | BillingService | BillingAddOn> | null;
  /**
   * Restrictions for coupon usage.
   */
  restrictions?: {
    /**
     * Whether the coupon can only be used on the first purchase.
     */
    only_first_time: boolean;
    /**
     * Minimum value of the purchase so this coupon is applicable.
     */
    minimum_order_value: number | null;
  };
  /**
   * Duration cycles for the coupon.
   *
   * Number is months, `once` means the coupon is only valid for one purchase or one billing.
   */
  duration_cycles: number | "forever" | "once";
};

type BillingPaymentMethod = {
  /**
   * Credit card on record.
   */
  card: BillingPaymentMethodCard | null;
  /**
   * Account balance in Stripe.
   */
  balance?: BillingPaymentMethodBalance;
  /**
   * Coupon currently applied to the subscription.
   */
  coupon?: BillingCoupon;
};

type BillingSubscriptionSummary = {
  /**
   * Whether the subscription has an operation still being processed.
   */
  processing: boolean;
  /**
   * Payment errors in the account's subscription.
   */
  payment_error: BillingPaymentError | null;
  /**
   * Whether the subscription has a failing recurring payment.
   */
  past_due: boolean;
  /**
   * Whether the subscription does not have enough account balance for the next
   * recurring payment without a credit card on record.
   */
  not_enough_balance: boolean;
  /**
   * Whether the subscription has scheduled downgrades.
   */
  schedule: boolean;
};

type BillingPaymentHistoryEntry = {
  /**
   * Stripe ID for the history entry. Used for pagination.
   */
  stripe_id: string;
  /**
   * Number of the invoice in Stripe for identification.
   *
   * May be `null` if Stripe does not provide it at the moment of the request.
   */
  invoice_number?: string | null;
  /**
   * Total cost of the invoice.
   */
  total: number;
  /**
   * Currency used for the invoice.
   */
  currency: string;
  /**
   * URL to download the invoice and receipt on Stripe.
   *
   * May be `null` if Stripe does not provide it at the moment of the request.
   */
  receipt_url?: string | null;
  /**
   * Whether the invoice was paid.
   */
  paid: boolean;
  /**
   * Payment status of the invoice.
   */
  status: string;
  /**
   * Information for the credit card used to pay the invoice.
   */
  card: {
    /**
     * Credit card brand.
     */
    brand: string | null;
    /**
     * Credit card's last four digits.
     */
    last4: string | null;
  } | null;
  /**
   * Timestamp for when the invoice was created.
   */
  created_at: string;
};

type BillingInformation = {
  /**
   * Account ID.
   */
  account: GenericID;
  /**
   * Company registered in account's billing information.
   */
  company: string;
  /**
   * Country registered in account's billing information.
   */
  country: string | null;
  /**
   * State registered in account's billing information.
   */
  state: string | null;
  /**
   * City registered in account's billing information.
   */
  city: string | null;
  /**
   * Street address registered in account's billing information.
   */
  street: string | null;
  /**
   * Zip code registered in account's billing information.
   */
  zip_code: string | null;
  /**
   * Extra information to be attached to the invoice for tax and other purposes.
   */
  comments: string | null;
  /**
   * Payment method registered in account's billing information.
   */
  payment_method: BillingPaymentMethod | null;
  /**
   * Timestamp when the billing information was last updated.
   */
  updated_at: string;
};

type BillingEditInformation = Partial<Omit<BillingInformation, "account" | "updated_at" | "payment_method">>;

type BillingResourceAllocationServices = Record<BillingService, number>;

type BillingProfileResourceAllocation = {
  /**
   * Profile ID.
   */
  profile: GenericID;
  /**
   * Timestamp when the resource allocation for the profile was last updated.
   */
  updated_at: string;
} & BillingResourceAllocationServices;

type BillingResourceAllocation = BillingProfileResourceAllocation[];

type BillingEditResourceAllocation = Array<Partial<Omit<BillingProfileResourceAllocation, "updated_at">>>;

export type {
  BillingPlan,
  BillingService,
  BillingAddOn,
  BillingServiceSubscription,
  BillingSubscriptionServices,
  BillingSubscriptionAddOns,
  BillingPaymentError,
  BillingPaymentPastDue,
  BillingSubscription,
  BillingEditSubscription,
  BillingServiceSubscriptionSchedule,
  BillingSubscriptionSchedule,
  BillingSchedule,
  BillingServicePrice,
  BillingPlanPrices,
  BillingAddOnPrices,
  BillingPrices,
  BillingPaymentMethodCard,
  BillingPaymentMethodBalance,
  BillingCoupon,
  BillingPaymentMethod,
  BillingSubscriptionSummary,
  BillingPaymentHistoryEntry,
  BillingInformation,
  BillingEditInformation,
  BillingResourceAllocationServices,
  BillingResourceAllocation,
  BillingProfileResourceAllocation,
  BillingEditResourceAllocation,
};
