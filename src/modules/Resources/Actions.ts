import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
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
   * Generates and retrieves a new action from the account
   * @param actionObj Object data to create new TagoIO Action
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
   * Modify any property of the action.
   * @param actionID Action ID
   * @param actionObj Action Object with data to be replaced
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
   * Deletes an action from the account
   * @param actionID Action ID
   */
  public async delete(actionID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/action/${actionID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Gets information about the action
   * @param actionID Action ID
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
