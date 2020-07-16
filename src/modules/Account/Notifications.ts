import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { GenericID, GenericToken } from "../../common/comum.types";

type NotificationType = "dashboard" | "bucket" | "analysis" | "profile" | "tago" | "limit_alert";

type Condition = "None" | "Pending" | "Accepted" | "Refused";

interface NotificationQuery {
  type: NotificationType;
  start_date: string;
  end_date: string;
  ref_id: GenericID;
}

interface NotificationInfo {
  id: GenericID;
  ref_id: GenericID | null;
  ref_from: { id: GenericID; name: string };
  type: NotificationType;
  sub_type: string;
  message: string;
  read: boolean;
  condition: Condition;
  created_at: string;
}

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
