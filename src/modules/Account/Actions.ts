import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { ActionCreateInfo, ActionInfo, ActionQuery } from "./actions.types";

class Actions extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all actions from the account
   * @default
   * ```json
   * queryObj: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * ```
   * @param queryObj Search query params
   */
  list(queryObj?: ActionQuery): Promise<ActionInfo[]> {
    const result = this.doRequest<ActionInfo[]>({
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

    return result;
  }

  /**
   * Generates and retrieves a new action from the account
   * @param actionObj Object data to create new TagoIO Action
   */
  create(actionObj: ActionCreateInfo): Promise<{ action: string }> {
    const result = this.doRequest<{ action: string }>({
      path: "/action",
      method: "POST",
      body: actionObj,
    });

    return result;
  }

  /**
   * Modify any property of the action.
   * @param actionID Action ID
   * @param actionObj Action Object with data to be replaced
   */
  edit(actionID: GenericID, actionObj: Partial<ActionCreateInfo>): Promise<string> {
    const result = this.doRequest<string>({
      path: `/action/${actionID}`,
      method: "PUT",
      body: actionObj,
    });

    return result;
  }

  /**
   * Deletes an action from the account
   * @param actionID Action ID
   */
  delete(actionID: GenericID): Promise<string> {
    const result = this.doRequest<string>({
      path: `/action/${actionID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Gets information about the action
   * @param actionID Action ID
   */
  info(actionID: GenericID): Promise<ActionInfo> {
    const result = this.doRequest<ActionInfo>({
      path: `/action/${actionID}`,
      method: "GET",
    });

    return result;
  }
}

export default Actions;
