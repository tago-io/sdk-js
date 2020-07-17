import { GenericID } from "../../common/comum.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { ActionCreateInfo, ActionInfo, ActionQuery } from "./actions.types";

class Actions extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all actions from the account
   *
   * @param {ListQuery} [query] Search query params;
   * Default:{
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * @return {Promise<ActionInfo[]>}
   * @memberof Device
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
   *
   * @param {ActionCreateInfo} data New Bucket info
   * @returns {(Promise<{ bucket: string }>)} Bucket created id
   * @memberof Buckets
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
   *  Modify any property of the action.
   *
   * @param {GenericID} actionID Action identification
   * @param {Partial<ActionCreateInfo>} data Data to change
   * @returns {Promise<string>} String with status
   * @memberof Actions
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
   *
   * @param {GenericID} actionID Action identification
   * @returns {Promise<string>} String with status
   * @memberof Actions
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
   *
   * @param {GenericID} actionID Action identification
   * @returns {Promise<ActionInfo>}
   * @memberof Actions
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
