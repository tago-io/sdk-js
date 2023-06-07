import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import ConsoleService from "./Console";
import SMS from "./SMS";
import Email from "./Email";
import MQTT from "./MQTT";
import Notification from "./Notification";
import Attachment from "./Attachment";
import PDFService from "./PDF";

class Services extends TagoIOModule<GenericModuleParams> {
  constructor(params?: GenericModuleParams) {
    super({ token: process.env.T_ANALYSIS_TOKEN, ...params });
  }

  public console = new ConsoleService(this.params);
  static account = new this().console;

  public sms = new SMS(this.params);
  static sms = new this().sms;

  public email = new Email(this.params);
  static email = new this().email;

  /** @deprecated use mqtt instead */
  public MQTT = new MQTT(this.params);
  public mqtt = new MQTT(this.params);
  static mqtt = new this().mqtt;

  /** @deprecated use notification instead  */
  public Notification = new Notification(this.params);
  public notification = new Notification(this.params);
  static notification = new this().notification;

  /** @deprecated use attachment instead */
  public Attachment = new Attachment(this.params);
  public attachment = new Attachment(this.params);
  static attachment = new this().attachment;

  /** @deprecated use pdf instead */
  public PDF = new PDFService(this.params);
  public pdf = new PDFService(this.params);
  static pdf = new this().pdf;
}

export default Services;
