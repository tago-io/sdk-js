import { TagoCoreListInfo, TagoCoreQuery } from "./tagocore.types";
import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

class TagoCore extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all TagoCore from the account
   * @default
   * ```json
   * queryObj: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * ```json
   * @param queryObj Search query params
   */
  public async list(queryObj?: TagoCoreQuery): Promise<TagoCoreListInfo[]> {
    const result = await this.doRequest<TagoCoreListInfo[]>({
      path: "/tcore",
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
   * Gets information about the TagoCore
   * @param tagocoreID Analyze identification
   */
  public async info(tagocoreID: GenericID): Promise<TagoCoreListInfo> {
    const reuslt = await this.doRequest<TagoCoreListInfo>({
      path: `/tcore/${tagocoreID}`,
      method: "GET",
    });

    return reuslt;
  }

  /**
   * Modify any property of the TagoCore.
   * @param tagocoreID TagoCore identification
   * @param tagocoreObj TagoCore Object with data to replace
   */
  public async edit(tagocoreID: GenericID, tagocoreObj: Partial<TagoCoreListInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/tcore/${tagocoreID}`,
      method: "PUT",
      body: tagocoreObj,
    });

    return result;
  }

  /**
   * Generate a new token for the TagoCore
   * @param tagocoreID Analyze identification
   */
  public async tokenGenerate(tagocoreID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/tcore/${tagocoreID}/token`,
      method: "GET",
    });

    return result;
  }
}

export default TagoCore;
