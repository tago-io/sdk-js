import type { GenericID, GenericToken } from "../../common/common.types.ts";
import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import dateParser from "../Utils/dateParser.ts";
import type { NotificationCreate, NotificationInfo, NotificationQuery } from "./notifications.types.ts";

class Notifications extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves all notifications from the application with optional filtering.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/11-notification} Notification
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Profile** / **Access notification** in Access Management.
   * ```typescript
   * const result = await Resources.notifications.list({ read: false, amount: 10 });
   * console.log(result); // [ { id: 'notification-id-123', title: 'System Update', message: 'Features', ... } ]
   * ```
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
   * Marks one or multiple notifications as read.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/11-notification} Notification
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Profile** / **Edit notification** in Access Management.
   * ```typescript
   * // Mark single notification
   * await Resources.notifications.markAsRead("notification-id-123");
   *
   * // Mark multiple notifications
   * await Resources.notifications.markAsRead(["id-1", "id-2"]);
   * ```
   */
  public async markAsRead(notificationIDS: GenericID[] | GenericID): Promise<string> {
    const normalizedIDs = Array.isArray(notificationIDS) ? notificationIDS : [notificationIDS];

    const result = await this.doRequest<string>({
      path: "/notification/read",
      method: "PUT",
      body: {
        notification_ids: normalizedIDs,
        read: true,
      },
    });

    return result;
  }

  /**
   * Marks one or multiple notifications as unread.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/11-notification} Notification
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Profile** / **Edit notification** in Access Management.
   * ```typescript
   * // Mark single notification
   * await Resources.notifications.markAsUnread("notification-id-123");
   *
   * // Mark multiple notifications
   * await Resources.notifications.markAsUnread(["id-1", "id-2"]);
   * ```
   */
  public async markAsUnread(notificationIDS: GenericID[] | GenericID): Promise<string> {
    const normalizedIDs = Array.isArray(notificationIDS) ? notificationIDS : [notificationIDS];

    const result = await this.doRequest<string>({
      path: "/notification/read",
      method: "PUT",
      body: {
        notification_ids: normalizedIDs,
        read: false,
      },
    });

    return result;
  }

  /**
   * Marks all notifications in the application as read.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/11-notification} Notification
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Profile** / **Edit notification** in Access Management.
   * ```typescript
   * const result = await Resources.notifications.markAllAsRead();
   * console.log(result); // All TagoIO Notification Run Successfully Updated
   * ```
   */
  public async markAllAsRead(): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/notification/markallread",
      method: "PUT",
    });

    return result;
  }

  /**
   * Records when a notification button is pressed by the user.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/11-notification} Notification
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Profile** / **Edit notification** in Access Management.
   * ```typescript
   * const result = await Resources.notifications.notificationButton("notification-123", "button-456");
   * console.log(result);
   * ```
   */
  public async notificationButton(notificationID: GenericID, buttonID: string): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/notification/${notificationID}/${buttonID}`,
      method: "PUT",
    });

    return result;
  }

  /**
   * Creates a new notification in the system.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/11-notification} Notification
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Profile** / **Create notification** in Access Management.
   * ```typescript
   * const result = await Resources.notifications.create({ title: "System Update", message: "New features available" });
   * console.log(result.id); // notification-id-123
   * ```
   */
  public async create(notificationData: NotificationCreate): Promise<{ id: GenericID }> {
    const result = await this.doRequest<{ id: GenericID }>({
      path: "/notification",
      method: "POST",
      body: { ...notificationData },
    });

    return result;
  }

  /**
   * Permanently deletes a notification from the system.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/11-notification} Notification
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Profile** / **Delete notification**  in Access Management.
   * ```typescript
   * const result = await Resources.notifications.remove("notification-123");
   * console.log(result); // Successfully Removed
   * ```
   */
  public async remove(notificationID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/notification/${notificationID}`,
      method: "DELETE",
    });

    return result;
  }

  /**
   * Registers a mobile device for push notifications.
   * @remarks **This is used internally for mobile applications**
   */
  public async registerDevice(deviceToken: GenericToken, platform: "ios" | "android"): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/notification/push/register",
      method: "POST",
      body: {
        device_token: deviceToken,
        platform,
      },
    });

    return result;
  }

  /**
   * Removes a mobile device from push notification service.
   * @remarks **This is used internally for mobile applications**
   */
  public async unRegisterDevice(deviceToken: GenericToken): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/notification/push/unregister",
      method: "POST",
      body: {
        device_token: deviceToken,
      },
    });

    return result;
  }
}

export default Notifications;
