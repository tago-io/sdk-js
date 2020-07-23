import { GenericID, GenericToken, ListTokenQuery, TokenCreateResponse, TokenData } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { ConnectorCreateInfo, ConnectorInfo, ConnectorQuery, ConnectorTokenInfo } from "./connector.types";

class Connectors extends TagoIOModule<GenericModuleParams> {
  public async list(query?: ConnectorQuery): Promise<ConnectorInfo[]> {
    const result = await this.doRequest<ConnectorInfo[]>({
      path: "/connector/",
      method: "GET",
      params: {
        page: query?.page || 1,
        fields: query?.fields || ["id", "name"],
        filter: query?.filter || {},
        amount: query?.amount || 20,
        orderBy: query?.orderBy ? `${query.orderBy[0]},${query.orderBy[1]}` : "name,asc",
      },
    });

    return result;
  }

  public async info(connectorID: GenericID, noParent: boolean = false): Promise<ConnectorInfo> {
    const result = await this.doRequest<ConnectorInfo>({
      path: `/connector/${connectorID}`,
      method: "GET",
      params: {
        no_parent: noParent,
      },
    });

    return result;
  }

  public async create(data: ConnectorCreateInfo): Promise<{ connector: GenericID }> {
    const result = await this.doRequest<{ connector: GenericID }>({
      path: `/connector/`,
      method: "POST",
      body: {
        ...data,
      },
    });

    return result;
  }

  public async edit(connectorID: GenericID, data: Partial<ConnectorCreateInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/connector/${connectorID}`,
      method: "PUT",
      body: {
        ...data,
      },
    });

    return result;
  }
  public async delete(connectorID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/connector/${connectorID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Retrieves a list of all tokens
   * @example
   * Default: {
   *   page: 1,
   *   fields: ["name", "token", "permission"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "created_at,desc",
   * }
   * @param connectorID Connector ID
   * @param query Search query params
   */
  tokenList(connectorID: GenericID, query?: ListTokenQuery): Promise<Partial<ConnectorTokenInfo>[]> {
    const result = this.doRequest<Partial<ConnectorTokenInfo>[]>({
      path: `/connector/token/${connectorID}`,
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
   * @param connectorID Connector ID
   * @param tokenParams Details of new token
   */
  tokenCreate(connectorID: GenericID, tokenParams: TokenData): Promise<TokenCreateResponse> {
    const result = this.doRequest<TokenCreateResponse>({
      path: `/connector/token`,
      method: "POST",
      body: { connector: connectorID, ...tokenParams },
    });

    return result;
  }

  /**
   * Deletes a token
   * @param token Token ID
   */
  tokenDelete(token: GenericToken): Promise<string> {
    const result = this.doRequest<string>({
      path: `/connector/token/${token}`,
      method: "DELETE",
    });

    return result;
  }
}

export default Connectors;
