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

  public console: ConsoleService = new ConsoleService(this.params);
  static get console(): ConsoleService {
    return new Services().console;
  }

  public sms: SMS = new SMS(this.params);
  static get sms(): SMS {
    return new Services().sms;
  }

  public email: Email = new Email(this.params);
  static get email(): Email {
    return new Services().email;
  }

  public twilio: Twilio = new Twilio(this.params);
  static get twilio(): Twilio {
    return new Services().twilio;
  }

  public smtp: SMTP = new SMTP(this.params);
  static get smtp(): SMTP {
    return new Services().smtp;
  }

  public aws_sqs: AWSSQS = new AWSSQS(this.params);
  static get aws_sqs(): AWSSQS {
    return new Services().aws_sqs;
  }

  public sendgrid: Sendgrid = new Sendgrid(this.params);
  static get sendgrid(): Sendgrid {
    return new Services().sendgrid;
  }

  public twilio_whatsapp: TwilioWhatsapp = new TwilioWhatsapp(this.params);
  static get twilio_whatsapp(): TwilioWhatsapp {
    return new Services().twilio_whatsapp;
  }

  /** @internal @deprecated renamed to .mqtt (lowercase) */
  public MQTT: MQTT = new MQTT(this.params);
  public mqtt: MQTT = new MQTT(this.params);
  static get mqtt(): MQTT {
    return new Services().mqtt;
  }

  /** @internal @deprecated renamed to .notification (lowercase)  */
  public Notification: Notification = new Notification(this.params);
  public notification: Notification = new Notification(this.params);
  static get notification(): Notification {
    return new Services().notification;
  }

  /** @internal @deprecated renamed to .attachment (lowercase) */
  public Attachment: Attachment = new Attachment(this.params);
  public attachment: Attachment = new Attachment(this.params);
  static get attachment(): Attachment {
    return new Services().attachment;
  }

  /** @internal @deprecated renamed to .pdf (lowercase) */
  public PDF: PDFService = new PDFService(this.params);
  public pdf: PDFService = new PDFService(this.params);
  static get pdf(): PDFService {
    return new Services().pdf;
  }
}

export default Services;
