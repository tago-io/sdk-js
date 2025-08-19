import TagoIOModule, { type AuthorizationModuleParams } from "../../common/TagoIOModule.ts";
import dateParser from "../Utils/dateParser.ts";
import type { AuthorizationInfo } from "./authorization.types.ts";

/**
 * Authorization utilities for TagoIO
 *
 * This class provides functionality for managing and validating authorization
 * tokens and permissions within the TagoIO platform. Used for authorization
 * validation and token information retrieval.
 *
 * @example Basic authorization info
 * ```ts
 * import { Authorization } from "@tago-io/sdk";
 *
 * const auth = new Authorization({
 *   token: "your-auth-token",
 *   details: { id: "auth-id" }
 * });
 *
 * const info = await auth.info();
 * console.log(info.permissions);
 * ```
 */
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
