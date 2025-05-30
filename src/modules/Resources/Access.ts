import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule";
import type { GenericID } from "../../common/common.types";
import dateParser from "../Utils/dateParser";
import type { AccessCreateInfo, AccessInfo, AccessQuery } from "./access.types";

class Access extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Lists all access rules from the application with pagination support.
   * Use this to retrieve and manage access policies for your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/183-access-management} Access Management
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Access Management** / **Access** in Access Management.
   * ```typescript
   * const result = await Resources.accessManagement.list({
   *   page: 1,
   *   fields: ["id", "name"],
   *   amount: 10,
   *   orderBy: ["name", "asc"]
   * });
   * console.log(result); // [ { id: 'access-id-123', name: '[Analysis] - Test', ...} ]
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
   * @description Creates a new access policy in your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/183-access-management} Access Management
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Access Management** / **Create** in Access Management.
   * ```typescript
   * const newAccess = await Resources.accessManagement.create({
   *   active: true,
   *   name: "My Access Policy",
   *   permissions: [
   *     {
   *       effect: "allow",
   *       action: ["access"],
   *       resource: ["access_management"],
   *     },
   *   ],
   *   targets: [["analysis", "id", "analysis-id-123"]],
   *   tags: [{ key: "type", value: "admin" }],
   * });
   * console.log(newAccess.am_id); // access-id-123
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
   * @description Modifies an existing access policy.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/183-access-management} Access Management
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Access Management** / **Edit** in Access Management.
   * ```typescript
   * const result = await Resources.accessManagement.edit("access-id-123", {
   *   name: "Updated Access Policy",
   *   permissions: [
   *     {
   *       effect: "allow",
   *       action: ["edit"],
   *       resource: ["access_management"],
   *     },
   *   ],
   *   tags: [{ key: "type", value: "user" }]
   * });
   * console.log(result); // Access Management Successfully Updated
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
   * @description Removes an access policy from your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/183-access-management} Access Management
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Access Management** / **Delete** in Access Management.
   * ```typescript
   * const result = await Resources.accessManagement.delete("access-id-123");
   * console.log(result); // Successfully Removed
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
   * @description Retrieves detailed information about a specific access policy.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/183-access-management} Access Management
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Access Management** / **Access** in Access Management.
   * ```typescript
   * const accessInfo = await Resources.accessManagement.info("access-id-123");
   * console.log(accessInfo); // { id: 'access-id-123', name: '[Analysis] - Test', ...}
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
