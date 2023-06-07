import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { ConnectorCreateInfo, ConnectorInfo, ConnectorQuery } from "./integration.connectors.types";

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
    let result = await this.doRequest<ConnectorInfo[]>({
      path: "/integration/connector/",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "name"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "updated_at"]));

    return result;
  }

  /**
   * Get Info of the Connector
   * @param connectorID Connector identification
   * @param fields Fields to fetch.
   */
  public async info(connectorID: GenericID, fields?: string[]): Promise<ConnectorInfo> {
    let result = await this.doRequest<ConnectorInfo>({
      path: `/integration/connector/${connectorID}`,
      method: "GET",
      params: {
        fields,
      },
    });

    result = dateParser(result, ["created_at", "updated_at"]);

    return result;
  }

  /**
   * Generates and retrieves a new connector from the account
   * @param connectorObj Object data to create new Connector
   */
  public async create(connectorObj: ConnectorCreateInfo): Promise<{ connector: GenericID }> {
    const result = await this.doRequest<{ connector: GenericID }>({
      path: `/integration/connector/`,
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
      path: `/integration/connector/${connectorID}`,
      method: "PUT",
      body: {
        ...connectorObj,
      },
    });

    return result;
  }
}

export default Connectors;
