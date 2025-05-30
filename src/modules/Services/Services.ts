import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule";
import AWSSQS from "./AWS-SQS";
import Attachment from "./Attachment";
import ConsoleService from "./Console";
import Email from "./Email";
import MQTT from "./MQTT";
import Notification from "./Notification";
import PDFService from "./PDF";
import SMS from "./SMS";
import SMTP from "./SMTP";
import Sendgrid from "./Sendgrid";
import TwilioWhatsapp from "./Twilio-Whatsapp";
import Twilio from "./Twillio";

class Services extends TagoIOModule<GenericModuleParams> {
  constructor(params?: GenericModuleParams) {
    super({ token: process.env.T_ANALYSIS_TOKEN, ...params });
  }

  public console = new ConsoleService(this.params);
  static get console() {
    return new Services().console;
  }

  public sms = new SMS(this.params);
  static get sms() {
    return new Services().sms;
  }

  public email = new Email(this.params);
  static get email() {
    return new Services().email;
  }

  public twilio = new Twilio(this.params);
  static get twilio() {
    return new Services().twilio;
  }

  public smtp = new SMTP(this.params);
  static get smtp() {
    return new Services().smtp;
  }

  public aws_sqs = new AWSSQS(this.params);
  static get aws_sqs() {
    return new Services().aws_sqs;
  }

  public sendgrid = new Sendgrid(this.params);
  static get sendgrid() {
    return new Services().sendgrid;
  }

  public twilio_whatsapp = new TwilioWhatsapp(this.params);
  static get twilio_whatsapp() {
    return new Services().twilio_whatsapp;
  }

  /** @internal @deprecated renamed to .mqtt (lowercase) */
  public MQTT = new MQTT(this.params);
  public mqtt = new MQTT(this.params);
  static get mqtt() {
    return new Services().mqtt;
  }

  /** @internal @deprecated renamed to .notification (lowercase)  */
  public Notification = new Notification(this.params);
  public notification = new Notification(this.params);
  static get notification() {
    return new Services().notification;
  }

  /** @internal @deprecated renamed to .attachment (lowercase) */
  public Attachment = new Attachment(this.params);
  public attachment = new Attachment(this.params);
  static get attachment() {
    return new Services().attachment;
  }

  /** @internal @deprecated renamed to .pdf (lowercase) */
  public PDF = new PDFService(this.params);
  public pdf = new PDFService(this.params);
  static get pdf() {
    return new Services().pdf;
  }
}

export default Services;
