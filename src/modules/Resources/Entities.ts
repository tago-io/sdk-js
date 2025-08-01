import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import dateParser from "../Utils/dateParser.ts";

import type { GenericID } from "../../common/common.types";
import type { EntityCreateInfo, EntityData, EntityDataQuery, EntityInfo } from "./entities.types";
import type { EntityListItem, EntityQuery, EntitySchema, EntityUnknownData } from "./entities.types";

class Entities extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a paginated list of all entities from the account with filtering and sorting options.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities} Entities
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Access** in Access Management.
   * ```typescript
   * const result = await Resources.entities.list({
   *   page: 1,
   *   fields: ["id", "name", "tags"],
   *   amount: 20
   * });
   * console.log(result); // [ { id: 'entity-id-123', name: 'test', tags: [] }, ... ]
   * ```
   */
  public async list(queryObj?: EntityQuery, options?: { paramsSerializer?: any }): Promise<EntityListItem[]> {
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
   * Creates a new entity in the account.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Creating_an_Entity} Creating an Entity
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Create** in Access Management.
   * ```typescript
   * const result = await Resources.entities.create({
   *  name: "Temperature Sensors",
   *  schema: {
   *    temperature: { action: "create", type: "float", required: true } }
   * });
   * console.log(result); // { id: 'entity-id-123' }
   * ```
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
   * Updates an existing entity's properties.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Managing_fields} Managing Fields
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.entities.edit("entity-id-123", { name: "Updated Entity Name" });
   * console.log(result); // { message: 'Entity Successfully Updated' }
   * ```
   */
  public async edit(entityID: GenericID, entityObj: Partial<EntityCreateInfo>): Promise<{ message: string }> {
    const result = await this.doRequest<{ message: string }>({
      path: `/entity/${entityID}`,
      method: "PUT",
      body: entityObj,
    });

    return result;
  }

  /**
   * Permanently removes an entity from the account.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Managing_fields} Managing Fields
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Delete** in Access Management.
   * ```typescript
   * const result = await Resources.entities.delete("entity-id-123");
   * console.log(result); // Entity Successfully Removed
   * ```
   */
  public async delete(entityID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/entity/${entityID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Retrieves detailed information about a specific entity.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities} Entities
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Access** in Access Management.
   * ```typescript
   * const result = await Resources.entities.info("entity-id-123");
   * console.log(result); // { schema: { id: { type: 'uuid', required: true }, ... }, ... }
   * ```
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
   * Gets the total amount of data records stored in the entity.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities} Entities
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Delete** in Access Management.
   * ```typescript
   * const result = await Resources.entities.amount("entity-id-123");
   * console.log(result);
   * ```
   */
  public async amount(entityID: GenericID): Promise<number> {
    const result = await this.doRequest<number>({
      path: `/entity/${entityID}/data_amount`,
      method: "GET",
    });

    return result;
  }

  /**
   * Retrieves data records stored in a specific entity with optional filtering parameters.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Managing_the_data_in_your_Entity} Managing the data in your Entity
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Access** in Access Management.
   * ```typescript
   * const result = await Resources.entities.getEntityData("entity-id-123", { amount: 10, orderBy: "created_at,desc" });
   * console.log(result); // [ { id: 'record-id-123', created_at: 2025-01-22T13:45:30.913Z, ... }, ... ]
   *
   * // Filtering by a specific field
   * const result = await Resources.entities.getEntityData("entity-id-123", {
   *   filter: { temperature: "30" },
   *   index: "temp_idx",
   *   amount: 9999,
   * });
   * console.log(result); // [ { id: 'record-id-123', created_at: 2025-01-22T13:45:30.913Z, ... }, ... ]
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
   * Updates existing data records in an entity.
   *
   * The `updatedData` can be a single data record or an array of records to be updated,
   * each of the records must have the `id` of the record and the fields to be updated.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Managing_the_data_in_your_Entity} Managing the data in your Entity
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.entities.editEntityData("entity-id-123", {
   *   id: "record-id-123",
   *   temperature: 30.1
   * });
   * console.log(result); // 1 item(s) updated
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
   * Sends new data records to an entity.
   *
   * The `data` can be a single data record or an array of records to be sent.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Managing_the_data_in_your_Entity} Managing the data in your Entity
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.entities.sendEntityData("entity-id-123", { temperature: 25.5 });
   * console.log(result); // 1 Data Added
   * ```
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
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Managing_the_data_in_your_Entity} Managing the data in your Entity
   *
   * @example
   * ```ts
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   * const result = await resources.entities.deleteEntityData("myEntityID", { ids: ["idOfTheRecord1"] });
   * console.log(result); // 1 item(s) deleted
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
   * Modifies the entity schema by adding new fields or managing indexes.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Indexing_fields_to_improve_searching_and_sorting} Indexing fields to improve searching and sorting
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.entities.editSchemaIndex("entity-id-123", {
   *   schema: { unit: { action: "create", type: "float", required: false } },
   *   index: { temp_idx: { action: "create", fields: ["temperature"] } }
   * });
   * console.log(result); // { message: 'Entity Successfully Updated' }
   * ```
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
  ): Promise<{ message: string }> {
    const result = await this.doRequest<{ message: string }>({
      path: `/entity/${entityID}/schema`,
      method: "PUT",
      body: {
        ...data,
      },
    });

    return result;
  }

  /**
   * Renames a field in the entity schema.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Managing_fields} Managing Fields
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.entities.renameField("entity-id-123", "old_name", "new_name");
   * console.log(result); // { message: 'Entity Successfully Updated' }
   * ```
   */
  public async renameField(entityID: GenericID, field: string, newName: string): Promise<{ message: string }> {
    const result = await this.doRequest<{ message: string }>({
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
   * Updates a field's configuration in the entity schema.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Managing_fields} Managing Fields
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.entities.updateField("entity-id-123", "temperature", { required: false });
   * console.log(result); // { message: 'Entity Successfully Updated' }
   * ```
   */
  public async updateField(
    entityID: GenericID,
    field: string,
    data: Partial<EntitySchema>
  ): Promise<{ message: string }> {
    const result = await this.doRequest<{ message: string }>({
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
   * Removes a field from the entity schema.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Managing_fields} Managing Fields
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.entities.deleteField("entity-id-123", "old_field");
   * console.log(result); // { message: 'Entity Successfully Updated' }
   * ```
   */
  public async deleteField(entityID: GenericID, field: string): Promise<{ message: string }> {
    const result = await this.doRequest<{ message: string }>({
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
   * Removes an index from the entity schema.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Indexing_fields_to_improve_searching_and_sorting} Indexing fields to improve searching and sorting
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.entities.deleteIndex("entity-id-123", "temp_idx");
   * console.log(result); // { message: 'Entity Successfully Updated' }
   * ```
   */
  public async deleteIndex(entityID: GenericID, index: string): Promise<{ message: string }> {
    const result = await this.doRequest<{ message: string }>({
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
   * Removes all data records from an entity while preserving its structure and configuration.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/entities#Managing_the_data_in_your_Entity} Managing the data in your Entity
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Entity** / **Delete** in Access Management.
   * ```typescript
   * const result = await Resources.entities.emptyEntityData("entity-id-123");
   * console.log(result); // Data Successfully Removed
   * ```
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
