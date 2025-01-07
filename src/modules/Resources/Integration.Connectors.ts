import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { ConnectorCreateInfo, ConnectorInfo, ConnectorQuery } from "./integration.connectors.types";

class Connectors extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Lists all connectors from the application with pagination support.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/466-connector-overview} Connector Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const list = await Resources.integration.connectors.list({
   *   page: 1,
   *   fields: ["id", "name"],
   *   amount: 10,
   *   orderBy: ["name", "asc"]
   * });
   * console.log(list);
   * ```
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
   * @description Retrieves detailed information about a specific connector.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/466-connector-overview} Connector Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const info = await Resources.integration.connectors.info("connector-id-123", ["id", "name"]);
   * console.log(info);
   * ```
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
   * @description Creates a new connector in the application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/466-connector-overview#Creating_a_connector} Creating a connector
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.integration.connectors.create({
   *   name: "My Connector",
   *   type: "custom",
   *   enabled: true
   * });
   * console.log(result.connector);
   * ```
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
   * @description Modifies an existing connector's properties.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/466-connector-overview} Connector Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.integration.connectors.edit("connector-id-123", { name: "Updated Connector" });
   * console.log(result);
   * ```
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

  /**
   * @description Deletes a connector from the application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/466-connector-overview} Connector Overview
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management
   * ```typescript
   * const result = await Resources.integration.connectors.delete("connector-id-123");
   * console.log(result);
   * ```
   */
  public async delete(connectorID: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/integration/connector/${connectorID}`,
      method: "DELETE",
    });

    return result;
  }
}

export default Connectors;
