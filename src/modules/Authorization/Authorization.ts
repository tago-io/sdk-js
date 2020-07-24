import TagoIOModule, { AuthorizationModuleParams } from "../../common/TagoIOModule";
import { AuthorizationInfo } from "./authorization.types";

class Authorization extends TagoIOModule<AuthorizationModuleParams> {
  /**
   * Get information about the current Authorization
   */
  public async info(): Promise<AuthorizationInfo> {
    const result = await this.doRequest<AuthorizationInfo>({
      path: "/info",
      method: "GET",
      params: {
        details: this.params.details,
      },
    });

    return result;
  }
}

export default Authorization;
