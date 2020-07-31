import { GenericID, GenericToken, ListTokenQuery, TokenCreateResponse, TokenData } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { ConnectorCreateInfo, ConnectorInfo, ConnectorQuery, ConnectorTokenInfo } from "./connector.types";

class Connectors extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all connectors from account
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
  public async list(queryObj?: ConnectorQuery): Promise<ConnectorInfo[]> {
    const result = await this.doRequest<ConnectorInfo[]>({
      path: "/connector/",
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
   * Get Info of the Connector
   * @param connectorID Connector identification
   * @param noParent Dont subscribe parameters with parent parameters
   */
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

  /**
   * Generates and retrieves a new connector from the account
   * @param connectorObj Object data to create new Connector
   */
  public async create(connectorObj: ConnectorCreateInfo): Promise<{ connector: GenericID }> {
    const result = await this.doRequest<{ connector: GenericID }>({
      path: `/connector/`,
      method: "POST",
      body: {
        ...connectorObj,
      },
    });

    return result;
  }

  /**
   * Modify any property of the connector
   * @param connectorID Connector identification
   * @param connectorObj Object data to create new Connector
   */
  public async edit(connectorID: GenericID, connectorObj: Partial<ConnectorCreateInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/connector/${connectorID}`,
      method: "PUT",
      body: {
        ...connectorObj,
      },
    });

    return result;
  }
  /**
   * Deletes an connector from the account
   * @param connectorID Connector identification
   */
  public async delete(connectorID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/connector/${connectorID}`,
      method: "DELETE",
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
   * @param connectorID Connector ID
   * @param queryObj Search query params
   */
  tokenList(connectorID: GenericID, queryObj?: ListTokenQuery): Promise<Partial<ConnectorTokenInfo>[]> {
    const result = this.doRequest<Partial<ConnectorTokenInfo>[]>({
      path: `/connector/token/${connectorID}`,
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["name", "token", "permission"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "created_at,desc",
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
