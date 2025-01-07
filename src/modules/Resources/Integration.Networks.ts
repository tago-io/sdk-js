import { GenericID, GenericToken, ListTokenQuery, TokenCreateResponse, TokenData } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { NetworkCreateInfo, NetworkInfo, NetworkQuery, NetworkTokenInfo } from "./integration.networks.types";

class Networks extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Lists all networks from the application with pagination support.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/125-network-integration} Network Integration
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Retrieves detailed information about a specific network.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/125-network-integration} Network Integration
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Creates a new network in the application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/468-creating-a-network-integration} Creating a Network Integration
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Modifies an existing network's properties.
   *
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Lists all tokens for a network with pagination support.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/468-creating-a-network-integration#Tokens_and_getting_the_devices} Tokens and Getting the Devices
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Creates a new token for a network.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/468-creating-a-network-integration#Tokens_and_getting_the_devices} Tokens and Getting the Devices
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Deletes a network token.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/468-creating-a-network-integration#Tokens_and_getting_the_devices} Tokens and Getting the Devices
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
   * @description Deletes a network from the application.
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
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
