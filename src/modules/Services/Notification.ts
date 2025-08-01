import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import type { NotificationCreate } from "../Resources/notifications.types.ts";

class Notification extends TagoIOModule<GenericModuleParams> {
  /**
   * Send Notification
   * You can add ref_id from a bucket or dashboard,
   * if it is valid it will show up a button Go To Dashboard
   * Any account with share of the dashboard/bucket will receive too.
   * @param notification Notification Object
   */
  public async send(notification: NotificationCreate): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/analysis/services/notification/send",
      method: "POST",
      body: notification,
    });

    return result;
  }
}

export default Notification;
