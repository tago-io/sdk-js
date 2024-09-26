import type {
  Data,
  DataCreate,
  DataEdit,
  GenericID,
  GenericToken,
  TokenCreateResponse,
  TokenData,
} from "../../common/common.types";
import { chunk } from "../../common/chunk";
import sleep from "../../common/sleep";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";

import type { DataQuery, DataQueryStreaming, OptionsStreaming } from "../Device/device.types";
import type {
  ConfigurationParams,
  DeviceChunkCopyResponse,
  DeviceChunkData,
  DeviceChunkParams,
  DeviceCreateInfo,
  DeviceCreateResponse,
  DeviceEditInfo,
  DeviceInfo,
  DeviceListItem,
  DeviceQuery,
  DeviceTokenDataList,
  ListDeviceTokenQuery,
} from "./devices.types";
import { EntityCreateInfo, EntityData, EntityDataQuery, EntityInfo, EntityListItem, EntityQuery, EntityUnknownData } from "./entities.types";


class Entities extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all entities from the account
   * @default
   * queryObj: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * @param queryObj Search query params
   */
  public async list(queryObj?: EntityQuery): Promise<EntityListItem[]> {
    let result = await this.doRequest<EntityListItem[]>({
      path: "/entity",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "profile", "name", "tags"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "updated_at"]));

    return result;
  }


  /**
   * Generate a new entity for the account.
   * @param entityObj Object data to create new device
   */
  public async create(entityObj: EntityCreateInfo): Promise<{ id: string }> {
    const result = await this.doRequest<{ id: string }>({
      path: "/entity",
      method: "POST",
      body: entityObj,
    });

    return result;
  }

  /**
   * Modify any property of the entity
   * @param entityID Entity ID
   * @param entityObj Entity object with fields to replace
   */
  public async edit(entityID: GenericID, entityObj: Partial<EntityCreateInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityID}`,
      method: "PUT",
      body: entityObj,
    });

    return result;
  }

  /**
   * Deletes an entity from the account
   * @param entityID Entity ID
   */
  public async delete(entityID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Get Info of the Entity
   * @param entityID Entity ID
   */
  public async info(entityID: GenericID): Promise<EntityInfo> {
    let result = await this.doRequest<EntityInfo>({
      path: `/entity/${entityID}`,
      method: "GET",
    });

    result = dateParser(result, ["updated_at", "created_at"]);

    return result;
  }

  /**
   * Create or edit param for the Device
   * @param deviceID Device ID
   * @param configObj Configuration Data
   * @param paramID Parameter ID
   */
  public async paramSet(
    deviceID: GenericID,
    configObj: Partial<ConfigurationParams> | Partial<ConfigurationParams>[],
    paramID?: GenericID
  ): Promise<string> {
    let body = configObj;
    if (paramID && !Array.isArray(configObj)) {
      body = {
        id: paramID,
        ...configObj,
      };
    }

    const result = await this.doRequest<string>({
      path: `/device/${deviceID}/params`,
      method: "POST",
      body,
    });

    return result;
  }

  /**
   * List Params for the Device
   * @param deviceID Device ID
   * @param sentStatus True return only sent=true, False return only sent=false
   */
  public async paramList(deviceID: GenericID, sentStatus?: Boolean): Promise<Required<ConfigurationParams>[]> {
    const result = await this.doRequest<Required<ConfigurationParams>[]>({
      path: `/device/${deviceID}/params`,
      method: "GET",
      params: { sent_status: sentStatus },
    });

    return result;
  }

  /**
   * Remove param for the Device
   * @param deviceID Device ID
   * @param paramID Parameter ID
   */
  public async paramRemove(deviceID: GenericID, paramID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceID}/params/${paramID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Retrieves a list of all tokens
   * @default
   * queryObj: {
   *   page: 1,
   *   fields: ["name", "token", "permission"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "created_at,desc",
   * }
   * @param deviceID Device ID
   * @param queryObj Search query params
   */

  public async tokenList<T extends ListDeviceTokenQuery>(deviceID: GenericID, queryObj?: T) {
    let result = await this.doRequest<
      DeviceTokenDataList<
        T["fields"] extends ListDeviceTokenQuery["fields"] ? T["fields"][number] : "token" | "name" | "permission"
      >[]
    >({
      path: `/device/token/${deviceID}`,
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["name", "token", "permission"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "created_at,desc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "last_authorization", "expire_time"]));

    return result;
  }


  /**
   * Get amount of data stored in the Device.
   *
   * @param entityID Entity ID
   */
  public async amount(entityID: GenericID): Promise<number> {
    const result = await this.doRequest<number>({
      path: `/entity/${entityID}/data_amount`,
      method: "GET",
    });

    return result;
  }

  /**
   * Get all the data from a entity.
   * @param entityID Entity ID
   * @param queryParams Query parameters to filter the results.
   *
   * @returns Array with the data values stored in the entity.
   *
*    * @example
   * ```ts
   * const lastTenValues = await Resources.entities.getEntityData("myEntityID", { amount: 10 });
   * ```
   */

  public async getEntityData(entityID: GenericID, queryParams?: EntityDataQuery): Promise<EntityData[]> {
    const result = await this.doRequest<EntityData[]>({
      path: `/entity/${entityID}/data`,
      method: "GET",
      params: queryParams,
    });

    return result.map((item) => dateParser(item, ["updated_at", "created_at"]));
  }


  /**
   * Edit data records in a entity using the profile token and entity ID.
   *
   * The `updatedData` can be a single data record or an array of records to be updated,
   * each of the records must have the `id` of the record and the fields to be updated.
   *
   * @param entityID Entity ID.
   * @param updatedData A single or an array of updated data records.
   *
   * @returns Success message indicating amount of records updated (can be 0).
   *
   * @example
   * ```ts
   * await Resources.devices.editEntityData("myEntityID", { id: "idOfTheRecord", field1: "new value", field2: "new unit" });
   * ```
   */
  public async editEntityData(entityID: GenericID, updatedData: Partial<EntityData> | Partial<EntityData>[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityID}/data`,
      method: "PUT",
      body: updatedData,
    });

    return result;
  }

  /**
   * Send data records to a entity using the profile token and entity ID.
   *
   * The `data` can be a single data record or an array of records to be sent.
   *
   * @param entityID Entity ID.
   * @param data A single or an array of updated data records.
   * @returns Success message indicating amount of records sent (can be 0).
   */
 public async sendEntityData(entityID: GenericID, data: EntityUnknownData | EntityUnknownData[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityID}/data`,
      method: "POST",
      body: data,
    });

    return result;
 }

  /**
   * Delete data records in a entity using the profile token and entity ID.
   *
   * See the example to understand how to use this method properly to have full control on what to delete.
   *
   * @param entityID Entity ID.
   * @param queryParams Parameters to specify what should be deleted on the entity's data.
   *
   * @returns Success message indicating amount of records deleted (can be 0).
   *
   * @example
   * ```ts
   * await Resources.entities.deleteEntityData("myEntityID", { ids: ["myRecordId", "anotherRecordId"] });
   * ```
   *
   */
  public async deleteEntityData(entityID: GenericID, queryParams?: EntityDataQuery): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityID}/data`,
      method: "DELETE",
      params: queryParams,
    });

    return result;
  }







  /**
   * Edit data records in a device using the profile token and device ID.
   *
   * The `updatedData` can be a single data record or an array of records to be updated,
   * each of the records must have the `id` of the record and the fields to be updated.
   *
   * @param deviceId Device ID.
   * @param updatedData A single or an array of updated data records.
   *
   * @returns Success message indicating amount of records updated (can be 0).
   *
   * @example
   * ```ts
   * await Resources.devices.editDeviceData("myDeviceId", { id: "idOfTheRecord", value: "new value", unit: "new unit" });
   * ```
   */
  public async editDeviceData(deviceId: GenericID, updatedData: DataEdit | DataEdit[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceId}/data`,
      method: "PUT",
      body: updatedData,
    });

    return result;
  }

  /**
   * Delete data records in a device using the profile token and device ID.
   *
   * See the example to understand how to use this method properly to have full control on what to delete.
   *
   * ! If query parameters are empty, last 15 data for the device will be deleted.
   *
   * @param deviceId Device ID.
   * @param queryParams Parameters to specify what should be deleted on the device's data.
   *
   * @returns Success message indicating amount of records deleted (can be 0).
   *
   * @example
   * ```ts
   * await Resources.devices.deleteDeviceData("myDeviceId", { ids: ["recordIdToDelete", "anotherRecordIdToDelete" ] });
   * ```
   */
  public async deleteDeviceData(deviceId: GenericID, queryParams?: DataQuery): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceId}/data`,
      method: "DELETE",
      params: queryParams,
    });

    return result;
  }

  /**
   * Get Info of the Device Chunks.
   * @experimental
   * @param deviceID Device ID
   */
  public async getChunk(deviceID: GenericID): Promise<DeviceChunkData[]> {
    const result = await this.doRequest<DeviceChunkData[]>({
      path: `/device/${deviceID}/chunk`,
      method: "GET",
    });

    return result;
  }

  /**
   * Delete the chunk data.
   * @experimental
   * @param deviceID Device ID
   * @param chunkID Chunk ID
   */
  public async deleteChunk(deviceID: GenericID, chunkID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/device/${deviceID}/chunk/${chunkID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Schedule to export the Device Chunk's data to the TagoIO's files.
   * @experimental
   */
  public async copyChunk(params: DeviceChunkParams): Promise<DeviceChunkCopyResponse> {
    const body = {
      chunk_id: params?.chunkID,
      headers: params?.headers,
      file_address: params?.file_address,
    };

    const result = await this.doRequest<DeviceChunkCopyResponse>({
      path: `/device/${params?.deviceID}/chunk/copy`,
      method: "POST",
      body,
    });

    return result;
  }
}

export default Entities;
