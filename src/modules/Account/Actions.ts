import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { ActionCreateInfo, ActionInfo, ActionQuery } from "./actions.types";

class Actions extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all actions from the account
   * @example
   * Default Query: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * @param query Search query params
   */
  list(query?: ActionQuery): Promise<ActionInfo[]> {
    const result = this.doRequest<ActionInfo[]>({
      path: "/action",
      method: "GET",
      params: {
        page: query?.page || 1,
        fields: query?.fields || ["id", "name"],
        filter: query?.filter || {},
        amount: query?.amount || 20,
        orderBy: query?.orderBy ? `${query.orderBy[0]},${query.orderBy[1]}` : "name,asc",
      },
    });

    return result;
  }

  /**
   * Generates and retrieves a new action from the account
   * @param data Action object to create new TagoIO Action
   */
  create(data: ActionCreateInfo): Promise<{ action: string }> {
    const result = this.doRequest<{ action: string }>({
      path: "/action",
      method: "POST",
      body: data,
    });

    return result;
  }

  /**
   * Modify any property of the action.
   * @param actionID Action ID
   * @param data Action Object to replace
   */
  edit(actionID: GenericID, data: Partial<ActionCreateInfo>): Promise<string> {
    const result = this.doRequest<string>({
      path: `/action/${actionID}`,
      method: "PUT",
      body: data,
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
