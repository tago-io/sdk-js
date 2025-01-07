import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { ActionCreateInfo, ActionInfo, ActionQuery } from "./actions.types";

class Actions extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Lists all actions from the application with pagination support.
   * Use this to retrieve and manage actions in your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/actions} Actions
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const list = await Resources.actions.list({
   *   page: 1,
   *   fields: ["id", "name"],
   *   amount: 10,
   *   orderBy: ["name", "asc"]
   * });
   * console.log(list);
   * ```
   */
  public async list(queryObj?: ActionQuery): Promise<ActionInfo[]> {
    let result = await this.doRequest<ActionInfo[]>({
      path: "/action",
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        fields: queryObj?.fields || ["id", "name"],
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
      },
    });

    result = result.map((data) => dateParser(data, ["created_at", "updated_at", "last_triggered"]));

    return result;
  }

  /**
   * @description Creates a new action in your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/actions} Actions
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const newAction = await Resources.actions.create({
   *   name: "My Action",
   *   type: "condition",
   *   tags: [{ key: "type", value: "notification" }]
   * });
   * console.log(newAction.action);
   * ```
   */
  public async create(actionObj: ActionCreateInfo): Promise<{ action: string }> {
    const result = await this.doRequest<{ action: string }>({
      path: "/action",
      method: "POST",
      body: actionObj,
    });

    return result;
  }

  /**
   * @description Modifies an existing action.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/actions} Actions
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.actions.edit("action-id", {
   *   name: "Updated Action",
   *   active: false
   * });
   * console.log(result);
   * ```
   */
  public async edit(actionID: GenericID, actionObj: Partial<ActionCreateInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/action/${actionID}`,
      method: "PUT",
      body: actionObj,
    });

    return result;
  }

  /**
   * @description Deletes an action from your application.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/actions} Actions
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const result = await Resources.actions.delete("action-id");
   * console.log(result);
   * ```
   */
  public async delete(actionID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/action/${actionID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * @description Retrieves detailed information about a specific action.
   *
   * @see {@link https://help.tago.io/portal/en/kb/tagoio/actions} Actions
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const actionInfo = await Resources.actions.info("action-id");
   * console.log(actionInfo);
   * ```
   */
  public async info(actionID: GenericID): Promise<ActionInfo> {
    let result = await this.doRequest<ActionInfo>({
      path: `/action/${actionID}`,
      method: "GET",
    });

    result = dateParser(result, ["created_at", "updated_at", "last_triggered"]);

    return result;
  }
}

export default Actions;
