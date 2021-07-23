import Batch from "../../common/BatchRequest";
import { GenericToken } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams, doRequestParams } from "../../common/TagoIOModule";
import Access from "./Access";
import { AccountCreateInfo, AccountInfo, LoginResponse, OTPType, TokenCreateInfo } from "./account.types";
import Actions from "./Actions";
import Analyses from "./Analyses";
import Buckets from "./Buckets";
import Dashboards from "./Dashboards";
import Devices from "./Devices";
import Dictionaries from "./Dictionaries";
import Explore from "./Explore";
import Files from "./Files";
import Notifications from "./Notifications";
import PaymentHistory from "./PaymentHistory";
import PaymentMethods from "./PaymentMethods";
import Plan from "./Plan";
import Profile from "./Profile";
import Run from "./Run";
import ServiceAuthorization from "./ServiceAuthorization";
import Tags from "./Tags";
import Template from "./Template";
import { Regions } from "../../regions";
import Integration from "./Integration";
import dateParser from "../Utils/dateParser";

/**
 * To set up an account object, you need a token that you need to get from our
 * admin website and the region. Make sure to use tokens with the correct
 * write/read privileges for the current function that you want to use.
 *
 * @class Account
 * @extends {TagoIOModule<GenericModuleParams>}
 */
class Account extends TagoIOModule<GenericModuleParams> {
  /**
   * Gets all account information
   */
  public async info(): Promise<AccountInfo> {
    let result = await this.doRequest<AccountInfo>({
      path: "/account",
      method: "GET",
    });

    result = dateParser(result, ["created_at", "updated_at", "last_login"]);

    if (result.options) result.options = dateParser(result.options, ["last_whats_new"]);

    return result;
  }

  /**
   * Edit account
   * @param accountObj Account data to edit
   */
  public async edit(accountObj: Partial<AccountInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/account",
      method: "PUT",
      body: accountObj,
    });

    return result;
  }

  /**
   * Delete account
   */
  public async delete(): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/account",
      method: "DELETE",
    });

    return result;
  }

  /**
   * Generates and retrieves a new token for the account
   * @param tokenParams Token data
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async tokenCreate(tokenParams: TokenCreateInfo, region?: Regions): Promise<{ token: GenericToken }> {
    const params: doRequestParams = {
      path: "/account/profile/token",
      method: "POST",
      body: tokenParams,
    };

    const result = await TagoIOModule.doRequestAnonymous<{ token: GenericToken }>(params, region);

    return result;
  }

  /**
   * Retrieve list of profiles for login and do Login
   * @param credentials Credentials
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async login(
    credentials: { email: string; password: string },
    region?: Regions
  ): Promise<LoginResponse> {
    const params: doRequestParams = {
      path: "/account/login",
      method: "POST",
      body: credentials,
    };

    const result = await TagoIOModule.doRequestAnonymous<LoginResponse>(params, region);

    return result;
  }

  /**
   * Send password recover email
   * @param email E-mail to recovery
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async passwordRecover(email: string, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/account/passwordreset/${email}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Change account password
   * @param password New Password
   */
  public async passwordChange(password: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/passwordreset`,
      method: "POST",
      body: {
        password,
      },
    });

    return result;
  }

  /**
   * Create new TagoIO account
   * @param createParams New account details
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async create(createParams: AccountCreateInfo, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/account`,
      method: "POST",
      body: createParams,
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   *  Re-send confirmation account email
   * @param email E-mail address
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async resendConfirmation(email: string, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/account/resend_confirmation/${email}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Confirm account creation
   * @param token Confirmation token
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async confirmAccount(token: GenericToken, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/account/confirm/${token}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Request the PIN Code for a given OTP Type.
   * @param credentials Credentials
   * @param typeOTP authenticator, sms or email
   */
  public static async requestLoginPINCode(
    credentials: { email: string; password: string },
    typeOTP: OTPType,
    region?: Regions
  ): Promise<string> {
    const params: doRequestParams = {
      path: `/account/login/otp`,
      method: "POST",
      body: { ...credentials, otp_type: typeOTP },
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Enable OTP for a given OTP Type.
   * You will be requested to confirm the operation with a pin code.
   * @param credentials Credentials
   * @param typeOTP authenticator, sms or email
   */
  public async enableOTP(credentials: { email: string; password: string }, typeOTP: OTPType): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/otp/${typeOTP}/enable`,
      method: "POST",
      body: credentials,
    });

    return result;
  }

  /**
   * Enable OTP for a given OTP Type
   * @param credentials Credentials
   * @param typeOTP authenticator, sms or email
   */
  public async disableOTP(credentials: { email: string; password: string }, typeOTP: OTPType): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/otp/${typeOTP}/disable`,
      method: "POST",
      body: credentials,
    });

    return result;
  }

  /**
   * Confirm OTP enabling proccses for a given OTP Type
   * @param credentials Credentials
   * @param typeOTP authenticator, sms or email
   */
  public async confirmOTP(pinCode: string, typeOTP: OTPType): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/account/otp/${typeOTP}/confirm`,
      method: "POST",
      body: {
        pin_code: pinCode,
      },
    });

    return result;
  }

  /**
   * Send a batch commands
   */
  public batch = new Batch(this.params);

  /**
   * Manage actions in account.
   * Be sure to use an account token with “write” permissions when
   * using functions like create, edit and delete.
   */
  public actions = new Actions(this.params);

  /**
   * Manage analysis in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public analysis = new Analyses(this.params);

  /**
   * Manage buckets in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public buckets = new Buckets(this.params);

  /**
   * Manage files in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public files = new Files(this.params);

  /**
   * Manage dashboards in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public dashboards = new Dashboards(this.params);

  /**
   * Manage devices in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public devices = new Devices(this.params);

  /**
   * Manage dictionaries in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public dictionaries = new Dictionaries(this.params);

  /**
   * Manage notifications in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public notifications = new Notifications(this.params);

  /**
   * Manage tags in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public tags = new Tags(this.params);

  /**
   * Manage payment methods in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public paymentMethods = new PaymentMethods(this.params);

  /**
   * Manage account plans
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public plan = new Plan(this.params);
  /**
   * Manage payment history in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public paymentHistory = new PaymentHistory(this.params);

  /**
   * Manage explore in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public explore = new Explore(this.params);

  /**
   * Manage connectors in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public integration = new Integration(this.params);

  /**
   * Manage templates in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public template = new Template(this.params);

  /**
   * Manage access in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public accessManagement = new Access(this.params);

  /**
   * Manage run apps in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   */
  public run = new Run(this.params);

  /**
   * Manage services in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public ServiceAuthorization = new ServiceAuthorization(this.params);

  /**
   * Manage profiles in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   */
  public profiles = new Profile(this.params);
}

export default Account;
