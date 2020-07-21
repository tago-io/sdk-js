import Batch from "../../common/BatchRequest";
import { GenericToken } from "../../common/comum.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import Access from "./Access";
import { AccountCreateInfo, AccountInfo, LoginResponse, TokenCreateInfo } from "./account.types";
import Actions from "./Actions";
import Analysis from "./Analysis";
import Buckets from "./Buckets";
import Connectors from "./Connector";
import Dashboards from "./Dashboards";
import Devices from "./Devices";
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
   *
   * @returns {Promise<AccountInfo>}
   * @memberof Account
   */
  info(): Promise<AccountInfo> {
    const result = this.doRequest<AccountInfo>({
      path: "/account",
      method: "GET",
    });

    return result;
  }

  /**
   * Gets account summary
   *
   * @returns {Promise<AccountInfo>}
   * @memberof Account
   */
  sumary(): Promise<AccountInfo> {
    const result = this.doRequest<AccountInfo>({
      path: "/account/summary",
      method: "GET",
    });

    return result;
  }

  /**
   * Edit account
   *
   * @param {Partial<AccountInfo>} data Account data to edit
   * @returns {Promise<string>} status
   * @memberof Account
   */
  edit(data: Partial<AccountInfo>): Promise<string> {
    const result = this.doRequest<string>({
      path: "/account",
      method: "PUT",
      body: data,
    });

    return result;
  }

  /**
   * Delete account
   *
   * @returns {Promise<string>} status
   * @memberof Account
   */
  delete(): Promise<string> {
    const result = this.doRequest<string>({
      path: "/account",
      method: "DELETE",
    });

    return result;
  }

  /**
   * Generates and retrieves a new token for the account
   *
   * @param {TokenCreateInfo} data Token data
   * @returns {Promise<{ token: GenericToken }>} Token created info
   * @memberof Account
   */
  tokenCreate(data: TokenCreateInfo): Promise<{ token: GenericToken }> {
    const result = this.doRequest<{ token: GenericToken }>({
      path: "/account/profile/token",
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * Retrieve list of profiles for login and do Login
   *
   * @param {{ email: string; password: string }} data Credentials
   * @returns {Promise<LoginResponse>}
   * @memberof Account
   */
  login(data: { email: string; password: string }): Promise<LoginResponse> {
    const result = this.doRequest<LoginResponse>({
      path: "/account/login",
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * Send password recover email
   *
   * @param {string} email
   * @returns {Promise<string>} status
   * @memberof Account
   */
  passwordRecover(email: string): Promise<string> {
    const result = this.doRequest<string>({
      path: `/account/passwordreset/${email}`,
      method: "GET",
    });

    return result;
  }

  /**
   * Change password
   *
   * @param {string} password
   * @returns {Promise<string>} status
   * @memberof Account
   */
  passwordChange(password: string): Promise<string> {
    const result = this.doRequest<string>({
      path: `/account/passwordreset`,
      method: "POST",
      body: {
        password,
      },
    });

    return result;
  }

  /**
   * Create new Tago account
   *
   * @param {AccountCreateInfo} data
   * @returns {Promise<string>} status
   * @memberof Account
   */
  create(data: AccountCreateInfo): Promise<string> {
    const result = this.doRequest<string>({
      path: `/account`,
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * Re-send confirmation account email
   *
   * @param {string} email
   * @returns {Promise<string>} status
   * @memberof Account
   */
  resendConfirmation(email: string): Promise<string> {
    const result = this.doRequest<string>({
      path: `/account/resend_confirmation/${email}`,
      method: "GET",
    });

    return result;
  }

  /**
   * Confirm account creation
   *
   * @param {GenericToken} token confimation token
   * @returns {Promise<string>} status
   * @memberof Account
   */
  confirmAccount(token: GenericToken): Promise<string> {
    const result = this.doRequest<string>({
      path: `/account/confirm/${token}`,
      method: "GET",
    });

    return result;
  }

  /**
   * Send a batch commands
   *
   * @readonly
   * @memberof Account
   */
  get batch() {
    return new Batch(this.params);
  }

  /**
   * Manage actions in account.
   * Be sure to use an account token with “write” permissions when
   * using functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get actions() {
    return new Actions(this.params);
  }

  /**
   * Manage analysis in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get analysis() {
    return new Analysis(this.params);
  }

  /**
   * Manage buckets in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get buckets() {
    return new Buckets(this.params);
  }

  /**
   * Manage files in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get files() {
    return new Files(this.params);
  }

  /**
   * Manage dashboards in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get dashboards() {
    return new Dashboards(this.params);
  }

  /**
   * Manage devices in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get devices() {
    return new Devices(this.params);
  }

  /**
   * Manage notifications in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get notifications() {
    return new Notifications(this.params);
  }

  /**
   * Manage tags in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get tags() {
    return new Tags(this.params);
  }
  /**
   * Manage payment methods in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get paymentMethods() {
    return new PaymentMethods(this.params);
  }
  /**
   * Manage account plans
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get plan() {
    return new Plan(this.params);
  }
  /**
   * Manage payment history in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get paymentHistory() {
    return new PaymentHistory(this.params);
  }
  /**
   * Manage explore in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get explore() {
    return new Explore(this.params);
  }
  /**
   * Manage connectors in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get connector() {
    return new Connectors(this.params);
  }
  /**
   * Manage templates in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get template() {
    return new Template(this.params);
  }
  /**
   * Manage access in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get accessManagement() {
    return new Access(this.params);
  }
  /**
   * Manage run apps in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get run() {
    return new Run(this.params);
  }
  /**
   * Manage services in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get ServiceAuthorization() {
    return new ServiceAuthorization(this.params);
  }
  /**
   * Manage profiles in account
   * Be sure to use an account token with “write” permissions when using
   * functions like create, edit and delete.
   *
   * @readonly
   * @memberof Account
   */
  get profiles() {
    return new Profile(this.params);
  }
}

export default Account;
