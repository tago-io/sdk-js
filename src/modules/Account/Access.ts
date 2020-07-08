import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";
import { GenericID, Query, GenericToken, TagsObj, PermissionOption } from "../../comum/comum.types";
import {} from "./account.types";

interface AccessCreateInfo {
  name: string;
  // TODO: permissions type
  permissions: [];
  // TODO: target type
  targets: [];
  profile?: GenericID;
  tags?: TagsObj;
  active?: number;
}

interface AccessInfo extends Readonly<AccessCreateInfo> {
  id: GenericID;
  created_at: string;
  updated_at: string;
}

type AccessQuery = Query<AccessInfo, "name" | "active" | "created_at" | "updated_at">;

class Access extends TagoIOModule<GenericModuleParams> {
  public async list(query?: AccessQuery): Promise<AccessInfo[]> {
    const result = await this.doRequest<AccessInfo[]>({
      path: "/am",
      method: "GET",
      params: {
        page: query?.page || 1,
        fields: query?.fields || ["id", "name", "tags"],
        filter: query?.filter || {},
        amount: query?.amount || 20,
        orderBy: query?.orderBy ? `${query.orderBy[0]},${query.orderBy[1]}` : "name,asc",
      },
    });

    return result;
  }
  public async create(data: AccessCreateInfo): Promise<{ am_id: GenericID }> {
    const result = await this.doRequest<{ am_id: GenericID }>({
      path: "/am",
      method: "POST",
      body: {
        ...data,
      },
    });

    return result;
  }
  public async edit(accessID: GenericID, data: Partial<AccessInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/am/${accessID}`,
      method: "PUT",
      body: {
        ...data,
      },
    });

    return result;
  }
  public async delete(accessID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/am/${accessID}`,
      method: "DELETE",
    });

    return result;
  }
  public async info(accessID: GenericID): Promise<AccessInfo> {
    const result = await this.doRequest<AccessInfo>({
      path: `/am/${accessID}`,
      method: "GET",
    });

    return result;
  }
}

export default Access;
