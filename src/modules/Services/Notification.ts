import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { GenericID } from "../../common/common.types";

interface NotificationData {
  /**
   * topic of the message
   */
  title: string;
  /**
   * Message scope
   */
  message: string;
  /**
   * Dashboard/Bucket ID for "Go To" button.
   */
  ref_id?: GenericID;
}

class Notification extends TagoIOModule<GenericModuleParams> {
  /**
   * Send Notification
   * You can add ref_id from a bucket or dashboard,
   * if it is valid it will show up a button Go To Dashboard
   * Any account with share of the dashboard/bucket will receive too.
   * @param notification Notification Object
   */
  public async send(notification: NotificationData): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/analysis/services/notification/send",
      method: "POST",
      body: notification,
    });

    return result;
  }
}

export default Notification;
