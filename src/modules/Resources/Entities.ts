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
import {
  EntityCreateInfo,
  EntityData,
  EntityDataQuery,
  EntityInfo,
  EntityListItem,
  EntityQuery,
  EntitySchema,
  EntityUnknownData,
} from "./entities.types";

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
  public async list(
    queryObj?: EntityQuery,
    options?: {
      paramsSerializer?: any;
    }
  ): Promise<EntityListItem[]> {
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
      ...options,
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

  public async getEntityData(
    entityID: GenericID,
    queryParams?: EntityDataQuery,
    options?: { paramsSerializer?: any }
  ): Promise<EntityData[]> {
    const result = await this.doRequest<EntityData[]>({
      path: `/entity/${entityID}/data`,
      method: "GET",
      params: queryParams,
      ...options,
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
  public async editEntityData(
    entityID: GenericID,
    updatedData: ({ id: GenericID } & Partial<EntityData>) | Array<{ id: GenericID } & Partial<EntityData>>
  ): Promise<string> {
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
   * @param itemsToDelete Items to be deleted.
   *
   * @returns Success message indicating amount of records deleted (can be 0).
   *
   * @example
   * ```ts
   * await Resources.entities.deleteEntityData("myEntityID", { ids: ["idOfTheRecord1", "idOfTheRecord2"] });
   * ```
   *
   */
  public async deleteEntityData(entityID: GenericID, itemsToDelete: { ids: GenericID[] }): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityID}/data`,
      method: "DELETE",
      body: itemsToDelete,
    });

    return result;
  }

  /**
   * Add a field to the entity schema
   *
   * @param entityID entity ID
   * @param data schema or index to be added
   * @returns Success message
   */
  public async editSchemaIndex(
    entityID: GenericID,
    data: {
      schema?: EntitySchema;
      index?: Record<
        string,
        | {
            action?: "create";
            fields?: string[];
          }
        | {
            action?: "delete";
          }
      >;
    }
  ): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityID}/schema`,
      method: "PUT",
      body: {
        ...data,
      },
    });

    return result;
  }

  /**
   * Rename a field from the entity schema
   * @param entityID entity ID
   * @param field field name to be renamed
   * @param newName new field name
   */
  public async renameField(entityID: GenericID, field: string, newName: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityID}/schema`,
      method: "PUT",
      body: {
        schema: {
          [field]: {
            action: "rename",
            new_name: newName,
          },
        },
      },
    });

    return result;
  }

  /**
   * Update a field from the entity schema
   * @param entityID entity ID
   * @param field field name to be updated
   * @param data data to be updated
   */
  public async updateField(entityID: GenericID, field: string, data: Partial<EntitySchema>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityID}/schema`,
      method: "PUT",
      body: {
        schema: {
          [field]: {
            action: "update",
            ...data,
          },
        },
      },
    });
    return result;
  }

  /**
   * Delete a field from the entity schema
   * @param entityID entity ID
   * @param field field name to be deleted
   * @returns Success message
   */
  public async deleteField(entityID: GenericID, field: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityID}/schema`,
      method: "PUT",
      body: {
        schema: {
          [field]: {
            action: "delete",
          },
        },
      },
    });

    return result;
  }

  /**
   * Delete a index from the entity schema
   * @param entityID entity ID
   * @param index index name to be deleted
   * @returns Success message
   */
  public async deleteIndex(entityID: GenericID, index: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityID}/schema`,
      method: "PUT",
      body: {
        index: {
          [index]: {
            action: "delete",
          },
        },
      },
    });

    return result;
  }

  /**
   * Empty all data in a entity.
   * @param entityID Entity ID
   * @returns Success message
   */
  public async emptyEntityData(entityId: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityId}/empty`,
      method: "POST",
    });

    return result;
  }
}

export default Entities;
