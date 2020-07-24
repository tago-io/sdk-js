import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import ConsoleService from "./Console";
import SMS from "./SMS";
import Email from "./Email";
import MQTT from "./MQTT";
import Notification from "./Notification";
import Attachment from "./Attachment";

class Services extends TagoIOModule<GenericModuleParams> {
  public console = new ConsoleService(this.params);

  public sms = new SMS(this.params);

  public email = new Email(this.params);

  public MQTT = new MQTT(this.params);

  public Notification = new Notification(this.params);

  public Attachment = new Attachment(this.params);
}

export default Services;
