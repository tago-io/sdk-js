import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import type { GenericID } from "../../common/common.types.ts";
import dateParser from "../Utils/dateParser.ts";
import type { DeviceInfo, DeviceListItem, DeviceQuery } from "./devices.types.ts";
import type { TagoCoreInfo, TagoCoreListInfo, TagoCoreQuery } from "./tagocore.types.ts";

class TagoCores extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a paginated list of all TagoCores from the application with filtering and sorting options.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/tagocore} TagoCore
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const cores = await resources.tagocores.list({
   *   page: 1,
   *   fields: ["id", "name"],
   *   amount: 20
   * });
   * console.log(cores);
   * ```
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
   * Retrieves detailed information about a specific TagoCore instance.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/tagocore} TagoCore
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const coreInfo = await resources.tagocores.info("core-id-123", true);
   * console.log(coreInfo);
   * ```
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
   * Updates configuration and settings for a TagoCore instance.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/tagocore} TagoCore
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.tagocores.edit("core-id-123", { name: "Production Core" });
   * console.log(result);
   * ```
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
   * Generates a new authentication token for a TagoCore instance.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/tagocore} TagoCore
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const token = await resources.tagocores.tokenGenerate("core-id-123");
   * console.log(token);
   * ```
   */
  public async tokenGenerate(tagoCoreID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/tcore/instance/${tagoCoreID}/token`,
      method: "GET",
    });

    return result;
  }

  /**
   * Permanently removes a TagoCore instance and its configurations.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/tagocore} TagoCore
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.tagocores.delete("core-id-123");
   * console.log(result);
   * ```
   */
  public async delete(tagocoreID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/tcore/instance/${tagocoreID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Retrieves detailed information about a device connected to a Standalone TagoCore instance.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/tagocore} TagoCore
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const deviceInfo = await resources.tagocores.standaloneDeviceInfo("core-id-123", "device-id-456");
   * console.log(deviceInfo);
   * ```
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
   * Retrieves a list of all devices connected to a Standalone TagoCore instance.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/tagocore} TagoCore
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const devices = await resources.tagocores.standaloneDeviceList("core-id-123", {
   *   page: 1,
   *   fields: ["id", "name", "last_input"],
   *   amount: 20
   * });
   * console.log(devices);
   * ```
   */
  public async standaloneDeviceList<T extends DeviceQuery>(
    tagoCoreID: GenericID,
    queryObj?: T
  ): Promise<
    DeviceListItem<"id" | "name" | (T["fields"] extends readonly (keyof any)[] ? T["fields"][number] : never)>[]
  > {
    let result = await this.doRequest<
      DeviceListItem<"id" | "name" | (T["fields"] extends readonly (keyof any)[] ? T["fields"][number] : never)>[]
    >({
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
