import { GenericToken, ListTokenQuery, TokenCreateResponse, TokenData, TokenDataList } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";

class ServiceAuthorization extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Retrieves a paginated list of all service authorization tokens with filtering and sorting options.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/218-authorization} Authorization
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const tokens = await Resources.serviceAuthorization.tokenList({
   *   page: 1,
   *   fields: ["name", "token", "permission"],
   *   amount: 20
   * });
   * console.log(tokens);
   * ```
   */
  public async tokenList(query?: ListTokenQuery): Promise<Partial<TokenDataList>[]> {
    let result = await this.doRequest<Partial<TokenDataList>[]>({
      path: `/serviceauth`,
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
   * @description Generates and retrieves a new service authorization token with specified permissions.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/218-authorization} Authorization
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.serviceAuthorization.tokenCreate({
   *   name: "API Service Token",
   *   permission: "full"
   * });
   * console.log(result);
   * ```
   */
  public async tokenCreate(tokenParams: TokenData): Promise<TokenCreateResponse> {
    let result = await this.doRequest<TokenCreateResponse>({
      path: `/serviceauth`,
      method: "POST",
      body: tokenParams,
    });

    result = dateParser(result, ["expire_date"]);

    return result;
  }

  /**
   * @description Permanently removes a service authorization token.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/218-authorization} Authorization
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.serviceAuthorization.tokenDelete("token-xyz-123");
   * console.log(result);
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
   * @description Updates a service authorization token with an optional verification code.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/218-authorization} Authorization
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.serviceAuthorization.tokenEdit("token-xyz-123", "verification-code");
   * console.log(result);
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
