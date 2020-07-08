import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";
import { GenericID, Query, TokenCreateResponse } from "../../comum/comum.types";
import { ConnectorInfo, ConnectorCreateInfo, ConnectorTokenInfo } from "./account.types";

type ConnectorQuery = Query<ConnectorInfo, "name" | "active" | "public" | "created_at" | "updated_at">;
type TokenQuery = Query<ConnectorTokenInfo, "name" | "created_at" | "updated_at">;

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
  public async tokenList(connectorID: GenericID, query?: TokenQuery): Promise<Partial<ConnectorInfo>[]> {
    const result = await this.doRequest<Partial<ConnectorInfo>[]>({
      path: `/connector/token/${connectorID}`,
      method: "GET",
      params: {
        page: query?.page || 1,
        fields: query?.fields || ["name", "token", "created_at"],
        filter: query?.filter || {},
        amount: query?.amount || 20,
        orderBy: query?.orderBy ? `${query.orderBy[0]},${query.orderBy[1]}` : "created_at,desc",
      },
    });

    return result;
  }

  public async tokenCreate(connectorID: GenericID, data: ConnectorCreateInfo): Promise<TokenCreateResponse> {
    const result = await this.doRequest<TokenCreateResponse>({
      path: `/connector/token`,
      method: "POST",
      body: {
        connector: connectorID,
        ...data,
      },
    });

    return result;
  }

  public async tokenDelete(tokenID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/connector/token/${tokenID}`,
      method: "DELETE",
    });

    return result;
  }
}

export default Connectors;
