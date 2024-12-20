import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { ActionCreateInfo, ActionInfo, ActionQuery } from "./actions.types";

class Actions extends TagoIOModule<GenericModuleParams> {
  /**
   * Lists all actions from the application with pagination support.
   * Use this to retrieve and manage actions in your application.
   *
   * @param {ActionQuery} queryObj - Query parameters for filtering and pagination
   * @param {number} queryObj.page - Page number
   * @param {string[]} queryObj.fields - Fields to be returned
   * @param {object} queryObj.filter - Filter conditions
   * @param {number} queryObj.amount - Number of items per page
   * @param {[string, 'asc' | 'desc']} queryObj.orderBy - Field and direction to sort by
   * @returns {Promise<ActionInfo[]>} List of actions
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
   * Creates a new action in your application.
   *
   * @param {ActionCreateInfo} actionObj - Action configuration data
   * @returns {Promise<{action: string}>} Object containing the ID of created action
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
   * Modifies an existing action.
   *
   * @param {GenericID} actionID - ID of the action to be edited
   * @param {Partial<ActionCreateInfo>} actionObj - New action configuration
   * @returns {Promise<string>} Success message
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
   * Deletes an action from your application.
   *
   * @param {GenericID} actionID - ID of the action to be deleted
   * @returns {Promise<string>} Success message
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
   * Retrieves detailed information about a specific action.
   *
   * @param {GenericID} actionID - ID of the action
   * @returns {Promise<ActionInfo>} Action details
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
