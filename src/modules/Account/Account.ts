import Batch from "../../common/BatchRequest";
import { GenericID, GenericToken } from "../../common/comum.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import Access from "./Access";
import { AccountCreateInfo, AccountInfo } from "./account.types";
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

interface LoginResponse {
  type: string;
  id: GenericID;
  email: string;
  company: string;
  name: string;
  profiles: {
    account: GenericID;
    id: GenericID;
    name: GenericID;
    logo_url: string | null;
  }[];
}

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

  sumary(): Promise<AccountInfo> {
    const result = this.doRequest<AccountInfo>({
      path: "/account/summary",
      method: "GET",
    });

    return result;
  }

  edit(data: Partial<AccountInfo>): Promise<string> {
    const result = this.doRequest<string>({
      path: "/account",
      method: "PUT",
      body: data,
    });

    return result;
  }

  delete(): Promise<string> {
    const result = this.doRequest<string>({
      path: "/account",
      method: "DELETE",
    });

    return result;
  }

  tokenCreate(data: { profile_id: GenericID; email: string; password: string }): Promise<{ token: GenericToken }> {
    const result = this.doRequest<{ token: GenericToken }>({
      path: "/account/profile/token",
      method: "POST",
      body: data,
    });

    return result;
  }

  login(data: { email: string; password: string }): Promise<LoginResponse> {
    const result = this.doRequest<LoginResponse>({
      path: "/account/login",
      method: "POST",
      body: data,
    });

    return result;
  }

  passwordRecover(email: string): Promise<string> {
    const result = this.doRequest<string>({
      path: `/account/passwordreset/${email}`,
      method: "GET",
    });

    return result;
  }

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

  create(data: AccountCreateInfo): Promise<string> {
    const result = this.doRequest<string>({
      path: `/account`,
      method: "POST",
      body: data,
    });

    return result;
  }

  resendConfirmation(email: string): Promise<string> {
    const result = this.doRequest<string>({
      path: `/account/resend_confirmation/${email}`,
      method: "GET",
    });

    return result;
  }

  confirmAccount(token: GenericToken): Promise<string> {
    const result = this.doRequest<string>({
      path: `/account/confirm/${token}`,
      method: "GET",
    });

    return result;
  }

  get batch() {
    return new Batch(this.params);
  }

  get actions() {
    return new Actions(this.params);
  }

  get analysis() {
    return new Analysis(this.params);
  }

  get buckets() {
    return new Buckets(this.params);
  }

  get files() {
    return new Files(this.params);
  }

  get dashboards() {
    return new Dashboards(this.params);
  }

  get devices() {
    return new Devices(this.params);
  }

  get notifications() {
    return new Notifications(this.params);
  }

  get tags() {
    return new Tags(this.params);
  }

  get paymentMethods() {
    return new PaymentMethods(this.params);
  }

  get plan() {
    return new Plan(this.params);
  }

  get paymentHistory() {
    return new PaymentHistory(this.params);
  }

  get explore() {
    return new Explore(this.params);
  }

  get connector() {
    return new Connectors(this.params);
  }

  get template() {
    return new Template(this.params);
  }

  get accessManagement() {
    return new Access(this.params);
  }

  get run() {
    return new Run(this.params);
  }

  get ServiceAuthorization() {
    return new ServiceAuthorization(this.params);
  }

  get profiles() {
    return new Profile(this.params);
  }
}

export default Account;
