import { TagoCoreInfo, TagoCoreListInfo, TagoCoreQuery } from "./tagocore.types";
import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";

class TagoCores extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all TagoCores from the account
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
    let result = await this.doRequest<TagoCoreListInfo[]>({
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

    result = result.map((data) =>
      dateParser(data, ["created_at", "updated_at", "system_start_time", "tcore_start_time"])
    );

    return result;
  }

  /**
   * Gets information about the TagoCore
   * @param tagoCoreID TagoCore identification
   */
  public async info(tagoCoreID: GenericID, summary?: boolean): Promise<TagoCoreInfo> {
    const result = await this.doRequest<TagoCoreInfo>({
      path: `/tcore/${tagoCoreID}`,
      method: "GET",
      params: { summary },
    });

    return result;
  }

  /**
   * Modify any property of the TagoCore.
   * @param tagoCoreID TagoCore identification
   * @param tagoCoreObj TagoCore Object with data to replace
   */
  public async edit(tagoCoreID: GenericID, tagoCoreObj: Partial<TagoCoreInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/tcore/${tagoCoreID}`,
      method: "PUT",
      body: tagoCoreObj,
    });

    return result;
  }

  /**
   * Generate a new token for the TagoCore
   * @param tagoCoreID TagoCore identification
   */
  public async tokenGenerate(tagoCoreID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/tcore/${tagoCoreID}/token`,
      method: "GET",
    });

    return result;
  }
}

export default TagoCores;
