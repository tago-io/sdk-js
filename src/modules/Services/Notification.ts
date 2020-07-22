import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { GenericID } from "../../common/common.types";

interface NotificationData {
  title: string;
  message: string;
  ref_id?: GenericID;
}

class Notification extends TagoIOModule<GenericModuleParams> {
  public async send(notification: NotificationData) {
    const result = await this.doRequest<string>({
      path: "/analysis/services/notification/send",
      method: "POST",
      body: notification,
    });

    return result;
  }
}

export default Notification;
