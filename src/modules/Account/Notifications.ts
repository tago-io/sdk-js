import { GenericID, GenericToken } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { NotificationInfo, NotificationQuery } from "./notifications.types";

class Notifications extends TagoIOModule<GenericModuleParams> {
  public async list(query?: NotificationQuery): Promise<NotificationInfo[]> {
    const result = await this.doRequest<NotificationInfo[]>({
      path: "/notification/",
      method: "GET",
      params: query,
    });

    return result;
  }
  public async markAsRead(notificationIDS: GenericID[]): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/notification/read",
      method: "PUT",
      body: {
        notification_ids: notificationIDS,
      },
    });

    return result;
  }
  public async accept(notificationID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/notification/accept/${notificationID}`,
      method: "POST",
    });

    return result;
  }
  public async refuse(notificationID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/notification/refuse/${notificationID}`,
      method: "POST",
    });

    return result;
  }
  public async remove(notificationID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/notification/${notificationID}`,
      method: "DELETE",
    });

    return result;
  }

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
