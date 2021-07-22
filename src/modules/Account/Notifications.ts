import { GenericID, GenericToken } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { NotificationInfo, NotificationQuery } from "./notifications.types";

class Notifications extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a list with all actions from the account
   * @param queryObj Search query params
   */
  public async list(queryObj?: NotificationQuery): Promise<NotificationInfo[]> {
    let result = await this.doRequest<NotificationInfo[]>({
      path: "/notification/",
      method: "GET",
      params: queryObj,
    });

    result = result.map((data) => dateParser(data, ["created_at"]));

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
        read: true,
      },
    });

    return result;
  }

  /**
   * Mark notifications as unread
   * @param notificationIDS An array of ids or a single id
   */
  public async markAsUnread(notificationIDS: GenericID[] | GenericID): Promise<string> {
    if (!Array.isArray(notificationIDS)) {
      notificationIDS = [notificationIDS];
    }

    const result = await this.doRequest<string>({
      path: "/notification/read",
      method: "PUT",
      body: {
        notification_ids: notificationIDS,
        read: false,
      },
    });

    return result;
  }

  /**
   * Mark all notifications as read
   */
  public async markAllAsRead(): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/notification/markallread",
      method: "PUT",
    });

    return result;
  }

  /**
   * Acknowledge notification button pressed
   * @param notificationID ID of the notification
   * @param buttonID ID of the button
   */
  public async notificationButton(notificationID: GenericID, buttonID: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/notification/${notificationID}/${buttonID}`,
      method: "PUT",
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
