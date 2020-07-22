import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import ConsoleService from "./Console";
import SMS from "./SMS";
import Email from "./Email";
import MQTT from "./MQTT";
import Notification from "./Notification";
import Attachment from "./Attachmment";

class Services extends TagoIOModule<GenericModuleParams> {
  get console() {
    return new ConsoleService(this.params);
  }

  get sms() {
    return new SMS(this.params);
  }

  get email() {
    return new Email(this.params);
  }

  get MQTT() {
    return new MQTT(this.params);
  }

  get Notification() {
    return new Notification(this.params);
  }

  get Attachment() {
    return new Attachment(this.params);
  }
}

export default Services;
