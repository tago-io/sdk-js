import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";
import Tags from "./Tags";
import { AccountInfo } from "./account.types";

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

  get tags() {
    return new Tags(this.params);
  }
}

export default Account;
