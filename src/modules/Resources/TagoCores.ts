import { TagoCoreInfo, TagoCoreListInfo, TagoCoreQuery } from "./tagocore.types";
import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { DeviceInfo, DeviceListItem, DeviceQuery } from "./devices.types";

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
      path: "/tcore/instance",
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
   * @param tagoCoreID TagoCore ID
   * @param summary Fetch summary from the instance if it is connected
   */
  public async info(tagoCoreID: GenericID, summary?: boolean): Promise<TagoCoreInfo> {
    const result = await this.doRequest<TagoCoreInfo>({
      path: `/tcore/instance/${tagoCoreID}`,
      method: "GET",
      params: { summary },
    });

    return result;
  }

  /**
   * Modify any property of the TagoCore.
   * @param tagoCoreID TagoCore ID
   * @param tagoCoreObj TagoCore Object with data to replace
   */
  public async edit(tagoCoreID: GenericID, tagoCoreObj: Partial<TagoCoreInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/tcore/instance/${tagoCoreID}`,
      method: "PUT",
      body: tagoCoreObj,
    });

    return result;
  }

  /**
   * Generate a new token for the TagoCore
   * @param tagoCoreID TagoCore ID
   */
  public async tokenGenerate(tagoCoreID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/tcore/instance/${tagoCoreID}/token`,
      method: "GET",
    });

    return result;
  }

  /**
   * Deletes a TagoCore
   * @param tagoCoreID TagoCore ID
   */
  public async delete(tagocoreID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/tcore/instance/${tagocoreID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Get Info of the Device from a Standalone TagoCore instance.
   * @param tagoCoreID Standalone TagoCore ID
   * @param deviceID Device ID
   */
  public async standaloneDeviceInfo(tagoCoreID: GenericID, deviceID: GenericID): Promise<DeviceInfo> {
    let result = await this.doRequest<DeviceInfo>({
      path: `/device/${deviceID}`,
      method: "GET",
      params: { tcore: tagoCoreID },
    });

    result = dateParser(result, ["last_input", "updated_at", "created_at"]);

    return result;
  }

  /**
   * Retrieves a list with all devices from a Standalone TagoCore instance.
   * @default
   * queryObj: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   *   resolveBucketName: false,
   * }
   * @param tagoCoreID Standalone TagoCore ID
   * @param queryObj Search query params
   */
  public async standaloneDeviceList<T extends DeviceQuery>(tagoCoreID: GenericID, queryObj?: T) {
    let result = await this.doRequest<DeviceListItem<"id" | "name" | T["fields"][number]>[]>({
      path: "/device",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "name"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
        resolveBucketName: queryObj?.resolveBucketName || false,
        tcore: tagoCoreID || "",
      },
    });

    result = result.map((data) => dateParser(data, ["last_input", "updated_at", "created_at"]));

    return result;
  }
}

export default TagoCores;
