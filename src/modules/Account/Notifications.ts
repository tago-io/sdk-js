import { GenericID, GenericToken } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { NotificationInfo, NotificationQuery } from "./notifications.types";

class Notifications extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all actions from the account
   * @param queryObj Search query params
   */
  public async list(queryObj?: NotificationQuery): Promise<NotificationInfo[]> {
    const result = await this.doRequest<NotificationInfo[]>({
      path: "/notification/",
      method: "GET",
      params: queryObj,
    });

    return result;
  }

  /**
   * Mark notifications as read
   * @param notificationIDS An array of ids or a single id
   */
  public async markAsRead(notificationIDS: GenericID[] | GenericID): Promise<string> {
    if (!Array.isArray(notificationIDS)) {
      notificationIDS = [notificationIDS];
    }

    const result = await this.doRequest<string>({
      path: "/notification/read",
      method: "PUT",
      body: {
        notification_ids: notificationIDS,
      },
    });

    return result;
  }

  /**
   * Accept a notification
   * @param notificationID Notification identification
   */
  public async accept(notificationID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/notification/accept/${notificationID}`,
      method: "POST",
    });

    return result;
  }

  /**
   * Refuse a notification
   * @param notificationID Notification identification
   */
  public async refuse(notificationID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/notification/refuse/${notificationID}`,
      method: "POST",
    });

    return result;
  }

  /**
   * Remove a notification
   * @param notificationID Notification identification
   */
  public async remove(notificationID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/notification/${notificationID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Register device Token on Push Notification Service
   * @param deviceToken Device token
   * @param platform Platform of device
   */
  public async registerDevice(deviceToken: GenericToken, platform: "ios" | "android"): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/notification/push/register`,
      method: "POST",
      body: {
        device_token: deviceToken,
        platform,
      },
    });

    return result;
  }

  /**
   * Unregister device Token on Push Notification Service
   * @param deviceToken Device token
   */
  public async unRegisterDevice(deviceToken: GenericToken): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/notification/push/unregister`,
      method: "POST",
      body: {
        device_token: deviceToken,
      },
    });

    return result;
  }
}

export default Notifications;
