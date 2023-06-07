import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { AccessCreateInfo, AccessInfo, AccessQuery } from "./access.types";

class Access extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all Access rules from account
   * @default
   * ```json
   * queryObj: {
   *   page: 1,
   *   fields: ["id", "name", "tags"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * ```
   * @param queryObj Search query params
   */
  public async list(queryObj?: AccessQuery): Promise<AccessInfo[]> {
    let result = await this.doRequest<AccessInfo[]>({
      path: "/am",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "name", "tags"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "updated_at"]));

    return result;
  }

  /**
   * Create a new access policy
   * @param accessObj
   */
  public async create(accessObj: AccessCreateInfo): Promise<{ am_id: GenericID }> {
    const result = await this.doRequest<{ am_id: GenericID }>({
      path: "/am",
      method: "POST",
      body: {
        ...accessObj,
      },
    });

    return result;
  }

  /**
   * Edit access policy
   * @param accessID Access policy identification
   * @param accessObj Access policy info to change
   */
  public async edit(accessID: GenericID, accessObj: Partial<AccessInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/am/${accessID}`,
      method: "PUT",
      body: {
        ...accessObj,
      },
    });

    return result;
  }

  /**
   * Delete account policy
   * @param accessID Access policy identification
   */
  public async delete(accessID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/am/${accessID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Get account policy info
   * @param accessID Access policy identification
   */
  public async info(accessID: GenericID): Promise<AccessInfo> {
    let result = await this.doRequest<AccessInfo>({
      path: `/am/${accessID}`,
      method: "GET",
    });

    result = dateParser(result, ["created_at", "updated_at"]);

    return result;
  }
}

export default Access;
