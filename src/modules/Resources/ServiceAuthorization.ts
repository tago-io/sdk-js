import { GenericToken, ListTokenQuery, TokenCreateResponse, TokenData, TokenDataList } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";

class ServiceAuthorization extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list of all tokens
   * @example
   * Default Query: {
   *   page: 1,
   *   fields: ["name", "token", "permission"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "created_at,desc",
   * }
   * @param query Search query params
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
   * Generates and retrieves a new token
   * @param tokenParams Token params to create new token
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
   * Deletes a token
   * @param token Token
   */
  public async tokenDelete(token: GenericToken): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/serviceauth/${token}`,
      method: "DELETE",
    });

    return result;
  }

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
