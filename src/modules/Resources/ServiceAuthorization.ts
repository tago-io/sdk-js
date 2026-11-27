import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import dateParser from "../Utils/dateParser.ts";
import type {
  GenericToken,
  TokenCreateInfo,
  TokenCreateResponse,
  TokenListItem,
  TokenListQuery,
} from "./ServiceAuthorization.types.ts";

class ServiceAuthorization extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a paginated list of all service authorization tokens with filtering and sorting options.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/218-authorization} Authorization
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Service Authorization** / **Access** in Access Management.
   * ```typescript
   * const result = await Resources.serviceAuthorization.tokenList({
   *   page: 1,
   *   fields: ["name", "token"],
   *   amount: 20
   * });
   * console.log(result); // [ { name: 'API Service Token', token: 'token-xyz-123' } ]
   *
   * // Authorizations bound to the MQTT Endpoint of an analysis
   * const bound = await Resources.serviceAuthorization.tokenList({
   *   fields: ["name", "token", "analysis"],
   *   filter: { analysis: "analysis-id-123" },
   * });
   * ```
   */
  public async tokenList(query?: TokenListQuery): Promise<Partial<TokenListItem>[]> {
    let result = await this.doRequest<Partial<TokenListItem>[]>({
      path: "/serviceauth",
      method: "GET",
      params: {
        page: query?.page || 1,
        fields: query?.fields || ["name", "token", "permission"],
        filter: query?.filter || {},
        amount: query?.amount || 20,
        orderBy: query?.orderBy ? `${query.orderBy[0]},${query.orderBy[1]}` : "created_at,desc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "last_authorization", "expire_time"]));

    return result;
  }

  /**
   * Generates and retrieves a new service authorization token with specified permissions.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/218-authorization} Authorization
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Service Authorization** / **Create** in Access Management.
   * ```typescript
   * const result = await Resources.serviceAuthorization.tokenCreate({
   *   name: "Service Token",
   *   verification_code: "additional parameter"
   * });
   * console.log(result); // { token: 'token-xyz-123', name: 'Service Token', ... }
   *
   * // An authorization for devices connecting to the MQTT Endpoint of a Luau analysis
   * const credential = await Resources.serviceAuthorization.tokenCreate({
   *   name: "Room sensors",
   *   permission: "full",
   *   analysis: "analysis-id-123",
   * });
   * ```
   */
  public async tokenCreate(tokenParams: TokenCreateInfo): Promise<TokenCreateResponse> {
    const result = await this.doRequest<TokenCreateResponse>({
      path: "/serviceauth",
      method: "POST",
      body: tokenParams,
    });

    return result;
  }

  /**
   * Permanently removes a service authorization token.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/218-authorization} Authorization
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Service Authorization** / **Delete** in Access Management.
   * ```typescript
   * const result = await Resources.serviceAuthorization.tokenDelete("token-xyz-123");
   * console.log(result); // Token Successfully Removed
   * ```
   */
  public async tokenDelete(token: GenericToken): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/serviceauth/${token}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Updates a service authorization token with an optional verification code. The analysis an authorization is
   * bound to cannot change.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/218-authorization} Authorization
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Service Authorization** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.serviceAuthorization.tokenEdit("token-xyz-123", "verification-code");
   * console.log(result); // Authorization Code Successfully Updated
   * ```
   */
  public async tokenEdit(token: GenericToken, verificationCode?: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/serviceauth/${token}`,
      method: "PUT",
      body: {
        verification_code: verificationCode,
      },
    });

    return result;
  }
}

export default ServiceAuthorization;
