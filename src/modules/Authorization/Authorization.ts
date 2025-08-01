import TagoIOModule, { type AuthorizationModuleParams } from "../../common/TagoIOModule.ts";
import dateParser from "../Utils/dateParser.ts";
import type { AuthorizationInfo } from "./authorization.types.ts";

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
