import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { AccessCreateInfo, AccessInfo, AccessQuery } from "./access.types";

class Access extends TagoIOModule<GenericModuleParams> {
  /**
   * Lists all access rules from the application with pagination support.
   * Use this to retrieve and manage access policies for your application.
   *
   * @param {AccessQuery} queryObj - Query parameters for filtering and pagination
   * @param {number} queryObj.page - Page number
   * @param {string[]} queryObj.fields - Fields to be returned
   * @param {object} queryObj.filter - Filter conditions
   * @param {number} queryObj.amount - Number of items per page
   * @param {[string, 'asc' | 'desc']} queryObj.orderBy - Field and direction to sort by
   * @returns {Promise<AccessInfo[]>} List of access policies
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/183-access-management} Access Management
   *
   * @example
   * ```typescript
   * const list = await Resources.accessManagement.list({
   *   page: 1,
   *   fields: ["id", "name"],
   *   amount: 10,
   *   orderBy: ["name", "asc"]
   * });
   * console.log(list);
   * ```
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
   * Creates a new access policy in your application.
   *
   * @param {AccessCreateInfo} accessObj - Access policy information
   * @returns {Promise<{am_id: GenericID}>} Object containing the ID of created access policy
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/183-access-management} Access Management
   *
   * @example
   * ```typescript
   * const newAccess = await Resources.accessManagement.create({
   *   name: "My Access Policy",
   *   permission: "full",
   *   tags: [{ key: "type", value: "admin" }]
   * });
   * console.log(newAccess.am_id);
   * ```
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
   * Modifies an existing access policy.
   *
   * @param {GenericID} accessID - ID of the access policy to be edited
   * @param {Partial<AccessInfo>} accessObj - New access policy information
   * @returns {Promise<string>} Success message
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/183-access-management} Access Management
   *
   * @example
   * ```typescript
   * const result = await Resources.accessManagement.edit("access-id-123", {
   *   name: "Updated Access Policy",
   *   tags: [{ key: "type", value: "user" }]
   * });
   * console.log(result);
   * ```
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
   * Removes an access policy from your application.
   *
   * @param {GenericID} accessID - ID of the access policy to be deleted
   * @returns {Promise<string>} Success message
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/183-access-management} Access Management
   *
   * @example
   * ```typescript
   * const result = await Resources.accessManagement.delete("access-id-123");
   * console.log(result);
   * ```
   */
  public async delete(accessID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/am/${accessID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Retrieves detailed information about a specific access policy.
   *
   * @param {GenericID} accessID - ID of the access policy
   * @returns {Promise<AccessInfo>} Access policy details
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/183-access-management} Access Management
   *
   * @example
   * ```typescript
   * const accessInfo = await Resources.accessManagement.info("access-id-123");
   * console.log(accessInfo);
   * ```
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
