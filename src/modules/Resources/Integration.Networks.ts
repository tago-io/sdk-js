import { GenericID, GenericToken, ListTokenQuery, TokenCreateResponse, TokenData } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { NetworkCreateInfo, NetworkInfo, NetworkQuery, NetworkTokenInfo } from "./integration.networks.types";

class Networks extends TagoIOModule<GenericModuleParams> {
  /**
   * Lists all networks from the application with pagination support.
   *
   * @param {NetworkQuery} queryObj - Query parameters for filtering and pagination
   * @param {number} queryObj.page - Page number
   * @param {string[]} queryObj.fields - Fields to be returned
   * @param {object} queryObj.filter - Filter conditions
   * @param {number} queryObj.amount - Number of items per page
   * @param {[string, 'asc' | 'desc']} queryObj.orderBy - Field and direction to sort by
   * @returns {Promise<NetworkInfo[]>} List of networks
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const list = await Resources.integration.networks.list({
   *   page: 1,
   *   fields: ["id", "name"],
   *   amount: 10,
   *   orderBy: ["name", "asc"]
   * });
   * console.log(list);
   * ```
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
   * Retrieves detailed information about a specific network.
   *
   * @param {GenericID} networkID - ID of the network
   * @param {string[]} [fields] - Optional fields to be returned
   * @returns {Promise<NetworkInfo>} Network information
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const info = await Resources.integration.networks.info("network-id-123", ["id", "name"]);
   * console.log(info);
   * ```
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
   * Creates a new network in the application.
   *
   * @param {NetworkCreateInfo} networkObj - Network configuration data
   * @returns {Promise<{network: GenericID}>} Created network ID
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.integration.networks.create({
   *   name: "My Network",
   *   description: "Network description"
   * });
   * console.log(result.network);
   * ```
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
   * Modifies an existing network's properties.
   *
   * @param {GenericID} networkID - ID of the network to modify
   * @param {Partial<NetworkCreateInfo>} networkObj - Object containing the properties to be updated
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.integration.networks.edit("network-id-123", {
   *   name: "Updated Network"
   * });
   * console.log(result);
   * ```
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
   * Lists all tokens for a network with pagination support.
   *
   * @param {GenericID} networkID - ID of the network
   * @param {ListTokenQuery} queryObj - Query parameters
   * @param {number} queryObj.page - Page number
   * @param {string[]} queryObj.fields - Fields to return
   * @param {object} queryObj.filter - Filter conditions
   * @param {number} queryObj.amount - Items per page
   * @returns {Promise<Partial<NetworkTokenInfo>[]>} List of network tokens
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const tokens = await Resources.integration.networks.tokenList("network-id-123", {
   *   page: 1,
   *   fields: ["name", "token"]
   * });
   * console.log(tokens);
   * ```
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
   * Creates a new token for a network.
   *
   * @param {GenericID} networkID - ID of the network
   * @param {TokenData} tokenParams - Token configuration
   * @returns {Promise<TokenCreateResponse>} Created token information
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const token = await Resources.integration.networks.tokenCreate("network-id-123", {
   *   name: "My Token",
   *   permission: "full"
   * });
   * console.log(token);
   * ```
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
   * Deletes a network token.
   *
   * @param {GenericToken} token - Token to delete
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.integration.networks.tokenDelete("token-123");
   * console.log(result);
   * ```
   */
  public async tokenDelete(token: GenericToken): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/integration/network/token/${token}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Deletes a network from the application.
   *
   * @param {string} networkID - ID of the network to delete
   * @returns {Promise<string>} Success message
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.integration.networks.delete("network-id-123");
   * console.log(result);
   * ```
   */
  public async delete(networkID: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/integration/network/${networkID}`,
      method: "DELETE",
    });

    return result;
  }
}

export default Networks;
