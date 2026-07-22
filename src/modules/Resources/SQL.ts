import type { GenericID } from "../../common/common.types.ts";
import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import { Cache } from "../../modules.ts";
import dateParser from "../Utils/dateParser.ts";
import type {
  SQLCreateInfo,
  SQLExecuteObj,
  SQLExecuteResult,
  SQLInfo,
  SQLQuery,
  SQLTablesQuery,
  SQLTablesResult,
  SQLVersionInfo,
} from "./sql.types.ts";

class SQL extends TagoIOModule<GenericModuleParams> {
  /**
   * Lists all TagoSQL queries from your profile with pagination support.
   *
   * @see {@link https://docs.tago.io/docs/tagoio/tagosql/queries} TagoSQL Queries
   *
   * @example
   * If receive an error "Authorization Denied", check policy **SQL Query** / **Access** in Access Management.
   * ```typescript
   * const result = await Resources.sql.list({
   *   page: 1,
   *   fields: ["id", "name", "tags"],
   *   amount: 20,
   * });
   * console.log(result); // [ { id: 'query-id-123', name: 'My query', tags: [] } ]
   * ```
   */
  public async list(queryObj?: SQLQuery): Promise<SQLInfo[]> {
    let result = await this.doRequest<SQLInfo[]>({
      path: "/sql",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "name", "tags"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "created_at,desc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "updated_at"]));

    return result;
  }

  /**
   * Creates a new TagoSQL query on your profile.
   *
   * @see {@link https://docs.tago.io/docs/tagoio/tagosql/queries} TagoSQL Queries
   *
   * @example
   * ```typescript
   * const result = await Resources.sql.create({
   *   name: "Latest temperature",
   *   query: "SELECT variable, value, time FROM device($1) AS d WHERE variable = 'temperature' ORDER BY time DESC LIMIT 10",
   *   params: [{ key: "$1", value: "my-device-id" }],
   * });
   * console.log(result); // { id: 'query-id-123', name: 'Latest temperature', ... }
   * ```
   */
  public async create(sqlObj: SQLCreateInfo): Promise<SQLInfo> {
    const result = await this.doRequest<SQLInfo>({
      path: "/sql",
      method: "POST",
      body: sqlObj,
    });

    Cache.clearCache();

    return dateParser(result, ["created_at", "updated_at"]);
  }

  /**
   * Retrieves detailed information about a specific TagoSQL query.
   *
   * @see {@link https://docs.tago.io/docs/tagoio/tagosql/queries} TagoSQL Queries
   *
   * @example
   * If receive an error "Authorization Denied", check policy **SQL Query** / **Access** in Access Management.
   * ```typescript
   * const result = await Resources.sql.info("query-id-123");
   * console.log(result); // { id: 'query-id-123', name: 'My query', query: 'SELECT ...', ... }
   * ```
   */
  public async info(sqlID: GenericID): Promise<SQLInfo> {
    const result = await this.doRequest<SQLInfo>({
      path: `/sql/${sqlID}`,
      method: "GET",
    });

    return dateParser(result, ["created_at", "updated_at"]);
  }

  /**
   * Replaces a TagoSQL query. The query is re-validated and its cached results are
   * dropped; a new version is stored when the query or the params change.
   *
   * @see {@link https://docs.tago.io/docs/tagoio/tagosql/queries} TagoSQL Queries
   *
   * @example
   * ```typescript
   * const result = await Resources.sql.edit("query-id-123", {
   *   name: "Latest temperature",
   *   query: "SELECT variable, value, time FROM device($1) AS d ORDER BY time DESC LIMIT 20",
   *   params: [{ key: "$1", value: "my-device-id" }],
   * });
   * console.log(result); // { id: 'query-id-123', version: 2, ... }
   * ```
   */
  public async edit(sqlID: GenericID, sqlObj: SQLCreateInfo): Promise<SQLInfo> {
    const result = await this.doRequest<SQLInfo>({
      path: `/sql/${sqlID}`,
      method: "PUT",
      body: sqlObj,
    });

    Cache.clearCache();

    return dateParser(result, ["created_at", "updated_at"]);
  }

  /**
   * Deletes a TagoSQL query from your profile.
   *
   * @see {@link https://docs.tago.io/docs/tagoio/tagosql/queries} TagoSQL Queries
   *
   * @example
   * ```typescript
   * const result = await Resources.sql.delete("query-id-123");
   * console.log(result); // { id: 'query-id-123' }
   * ```
   */
  public async delete(sqlID: GenericID): Promise<{ id: GenericID }> {
    const result = await this.doRequest<{ id: GenericID }>({
      path: `/sql/${sqlID}`,
      method: "DELETE",
    });

    Cache.clearCache();

    return result;
  }

  /**
   * Retrieves a historical snapshot (query and params) of a TagoSQL query.
   * To restore it, send the snapshot's query and params back with `edit`.
   *
   * @see {@link https://docs.tago.io/docs/tagoio/tagosql/queries} TagoSQL Queries
   *
   * @example
   * ```typescript
   * const result = await Resources.sql.getVersion("query-id-123", 1);
   * console.log(result); // { query: 'SELECT ...', params: [], created_at: ... }
   * ```
   */
  public async getVersion(sqlID: GenericID, version: number): Promise<SQLVersionInfo> {
    const result = await this.doRequest<SQLVersionInfo>({
      path: `/sql/${sqlID}/version/${version}`,
      method: "GET",
    });

    return dateParser(result, ["created_at"]);
  }

  /**
   * Executes a TagoSQL query. Params sent here override the saved defaults per key;
   * `test: true` skips the result cache entirely.
   *
   * @see {@link https://docs.tago.io/docs/tagoio/tagosql/executing-queries} Executing Queries
   *
   * @example
   * If receive an error "Authorization Denied", check policy **SQL Query** / **Execute** in Access Management.
   * ```typescript
   * const result = await Resources.sql.execute("query-id-123", {
   *   params: [{ key: "$1", value: "my-device-id" }],
   * });
   * console.log(result); // { columns: [...], rows: [...], row_count: 1, ... }
   * ```
   */
  public async execute(sqlID: GenericID, executeObj?: SQLExecuteObj): Promise<SQLExecuteResult> {
    const result = await this.doRequest<SQLExecuteResult>({
      path: `/sql/${sqlID}/execute`,
      method: "POST",
      body: executeObj || {},
    });

    return result;
  }

  /**
   * Retrieves the TagoSQL schema discovery catalog: the virtual table families with
   * their typed columns, plus your devices and entities. Pass `entity_id` to resolve
   * one entity's columns.
   *
   * @see {@link https://docs.tago.io/docs/tagoio/tagosql/tables} Available Tables
   *
   * @example
   * ```typescript
   * const result = await Resources.sql.tables({ filter: "sensor", amount: 20 });
   * console.log(result); // { tables: [...], resources: { devices: [...], entities: [...] } }
   * ```
   */
  public async tables(queryObj?: SQLTablesQuery): Promise<SQLTablesResult> {
    const result = await this.doRequest<SQLTablesResult>({
      path: "/sql/tables",
      method: "GET",
      params: queryObj || {},
    });

    return result;
  }
}

export default SQL;
