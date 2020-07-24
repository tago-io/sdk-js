import { GenericID, GenericToken } from "../../common/common.types";
import TagoIOModule, { doRequestParams, GenericModuleParams } from "../../common/TagoIOModule";
import { Regions } from "../../regions";
import {
  RunNotificationInfo,
  RunUserCreateInfo,
  RunUserInfo,
  RunUserLogin,
  RunUserLoginResponse,
} from "./runUser.types";
import SDB from "./SDB";

class RunUser extends TagoIOModule<GenericModuleParams> {
  /**
   * Get run user info
   * @param tagoRunURL Tago run url without http
   */
  public async info(tagoRunURL: string): Promise<RunUserInfo> {
    const result = await this.doRequest<RunUserInfo>({
      path: `/run/${tagoRunURL}/info`,
      method: "GET",
    });

    return result;
  }

  /**
   * Create new TagoIO Run User (Anonymous)
   * @param tagoRunURL Tago run url without http
   * @param newUserObj New user data
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async create(tagoRunURL: string, newUserObj: RunUserCreateInfo, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/run/${tagoRunURL}/signup`,
      method: "POST",
      body: newUserObj,
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Edit run user info
   * @param tagoRunURL Tago run url without http
   * @param userChangesObj Data to change in user
   */
  public async edit(tagoRunURL: string, userChangesObj: Partial<RunUserInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/${tagoRunURL}/info`,
      method: "PUT",
      body: userChangesObj,
    });

    return result;
  }

  /**
   * Login at TagoIO Run as user (Anonymous)
   * @param tagoRunURL Tago run url without http
   * @param credentialsObj Run user credentials
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async login(
    tagoRunURL: string,
    credentialsObj: RunUserLogin,
    region?: Regions
  ): Promise<RunUserLoginResponse> {
    const params: doRequestParams = {
      path: `/run/${tagoRunURL}/login`,
      method: "POST",
      body: credentialsObj,
    };

    const result = await TagoIOModule.doRequestAnonymous<RunUserLoginResponse>(params, region);

    return result;
  }

  /**
   * Confirm User on TagoIO Run (Anonymous)
   * @param tagoRunURL Tago run url without http
   * @param token Tago run user token
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async confirmUser(tagoRunURL: string, token: GenericToken, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/run/${tagoRunURL}/confirm/${token}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Sends a password recover e-mail
   * @param tagoRunURL Tago run url without http
   * @param email Run user email to recover the password
   * @param region TagoIO Region Server [default usa-1]
   */
  public static async passwordRecover(tagoRunURL: string, email: string, region?: Regions): Promise<string> {
    const params: doRequestParams = {
      path: `/run/${tagoRunURL}/passwordreset/${email}`,
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<string>(params, region);

    return result;
  }

  /**
   * Change password using token of the password recover.
   * @param tagoRunURL Tago run url without http
   * @param password New password
   */
  public async passwordChange(tagoRunURL: string, password: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/${tagoRunURL}/passwordreset`,
      method: "POST",
      body: {
        password,
      },
    });

    return result;
  }

  /**
   * List notifications.
   * @param tagoRunURL Tago run url without http
   */
  public async notificationList(tagoRunURL: string): Promise<RunNotificationInfo[]> {
    const result = await this.doRequest<RunNotificationInfo[]>({
      path: `/run/${tagoRunURL}/notification`,
      method: "GET",
    });

    return result;
  }

  /**
   * Mark notification as read
   * @param tagoRunURL Tago run url without http
   * @param notificationIDs array of notification ids or a single id
   */
  public async notificationMarkRead(tagoRunURL: string, notificationIDs: GenericID | GenericID[]): Promise<string> {
    if (!Array.isArray(notificationIDs)) {
      notificationIDs = [notificationIDs];
    }

    const result = await this.doRequest<string>({
      path: `/run/${tagoRunURL}/notification`,
      method: "PUT",
      body: {
        notification_ids: notificationIDs,
      },
    });

    return result;
  }

  /**
   * Trigger notification button
   * @param tagoRunURL Tago run url without http
   * @param notificationID Tago run notification id
   * @param buttonID Notification button id
   */
  public async notificationButton(tagoRunURL: string, notificationID: GenericID, buttonID: GenericID): Promise<any> {
    const result = await this.doRequest<any>({
      path: `/run/${tagoRunURL}/notification${notificationID}/${buttonID}`,
      method: "PUT",
    });

    return result;
  }

  /**
   * Delete notification
   * @param tagoRunURL Tago run url without http
   * @param notificationID Tago run notification id
   */
  public async notificationDelete(tagoRunURL: string, notificationID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/run/${tagoRunURL}/notification/${notificationID}`,
      method: "DELETE",
    });

    return result;
  }

  public SDB = new SDB(this.params);
}

export default RunUser;
