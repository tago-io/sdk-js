import { GenericToken, ListTokenQuery, TokenCreateResponse, TokenData, TokenDataList } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

class ServiceAuthorization extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list of all tokens
   *
   * @param {ListTokenQuery} [query] Search query params;
   * Default:{
   *   page: 1,
   *   fields: ["name", "token", "permission"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "created_at,desc",
   * }
   * @returns {Promise<Partial<TokenListResponse>[]>}
   * @memberof Token
   */
  tokenList(query?: ListTokenQuery): Promise<Partial<TokenDataList>[]> {
    const result = this.doRequest<Partial<TokenDataList>[]>({
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

    return result;
  }

  /**
   * Generates and retrieves a new token
   *
   * @param {TokenData} data New Token info
   * @returns {Promise<TokenCreateResponse>} Token created info
   * @memberof Token
   */
  tokenCreate(data: TokenData): Promise<TokenCreateResponse> {
    const result = this.doRequest<TokenCreateResponse>({
      path: `/serviceauth`,
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * Deletes a token
   *
   * @param {GenericToken} token Token
   * @returns {Promise<string>} String with status
   * @memberof Token
   */
  tokenDelete(token: GenericToken): Promise<string> {
    const result = this.doRequest<string>({
      path: `/serviceauth/${token}`,
      method: "DELETE",
    });

    return result;
  }

  tokenEdit(token: GenericToken, verificationCode?: string): Promise<string> {
    const result = this.doRequest<string>({
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
