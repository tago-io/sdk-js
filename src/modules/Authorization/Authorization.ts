import TagoIOModule, { AuthorizationModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { AuthorizationInfo } from "./authorization.types";

class Authorization extends TagoIOModule<AuthorizationModuleParams> {
  /**
   * Get information about the current Authorization
   */
  public async info(): Promise<AuthorizationInfo> {
    let result = await this.doRequest<AuthorizationInfo>({
      path: "/info",
      method: "GET",
      params: {
        details: this.params.details,
      },
    });

    result = dateParser(result, ["created_at", "expire_time", "last_authorization"]);
    return result;
  }
}

export default Authorization;
