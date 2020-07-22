import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { AccessCreateInfo, AccessInfo, AccessQuery } from "./access.types";

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
