import { GenericID, GenericToken, ListTokenQuery, TokenCreateResponse, TokenData } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { NetworkCreateInfo, NetworkInfo, NetworkQuery, NetworkTokenInfo } from "./integration.networks.types";

class Networks extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all Networks from account
   * @default
   * ```json
   * queryObj: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * ```
   * @param queryObj Search query params
   */
  public async list(queryObj?: NetworkQuery): Promise<NetworkInfo[]> {
    const result = await this.doRequest<NetworkInfo[]>({
      path: "/integration/network/",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "name"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
      },
    });

    return result;
  }

  /**
   * Get Info of the Network
   * @param networkID Network identification
   * @param fields Fields to fetch.
   */
  public async info(networkID: GenericID, fields = ["id", "name"]): Promise<NetworkInfo> {
    const result = await this.doRequest<NetworkInfo>({
      path: `/integration/network/${networkID}`,
      method: "GET",
      params: {
        fields,
      },
    });

    return result;
  }

  /**
   * Generates and retrieves a new network from the account
   * @param connectorObj Object data to create new Network
   */
  public async create(connectorObj: NetworkCreateInfo): Promise<{ network: GenericID }> {
    const result = await this.doRequest<{ network: GenericID }>({
      path: `/integration/network/`,
      method: "POST",
      body: {
        ...connectorObj,
      },
    });

    return result;
  }

  /**
   * Modify any property of the network
   * @param networkID Network identification
   * @param connectorObj Object data to create new Network
   */
  public async edit(networkID: GenericID, connectorObj: Partial<NetworkCreateInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/integration/network/${networkID}`,
      method: "PUT",
      body: {
        ...connectorObj,
      },
    });

    return result;
  }

  /**
   * Retrieves a list of all tokens
   * @default
   * ```json
   * queryObj: {
   *   page: 1,
   *   fields: ["name", "token", "permission"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "created_at,desc",
   * }
   * ```
   * @param networkID Network ID
   * @param queryObj Search query params
   */
  public async tokenList(networkID: GenericID, queryObj?: ListTokenQuery): Promise<Partial<NetworkTokenInfo>[]> {
    let result = await this.doRequest<Partial<NetworkTokenInfo>[]>({
      path: `/integration/network/token/${networkID}`,
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["name", "token", "permission"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "created_at,desc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "updated_at"]));

    return result;
  }

  /**
   * Generates and retrieves a new token
   * @param networkID Network ID
   * @param tokenParams Details of new token
   */
  public async tokenCreate(networkID: GenericID, tokenParams: TokenData): Promise<TokenCreateResponse> {
    const result = await this.doRequest<TokenCreateResponse>({
      path: `/integration/network/token`,
      method: "POST",
      body: { network: networkID, ...tokenParams },
    });

    return result;
  }

  /**
   * Deletes a token
   * @param token Token ID
   */
  public async tokenDelete(token: GenericToken): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/integration/network/token/${token}`,
      method: "DELETE",
    });

    return result;
  }
}

export default Networks;
