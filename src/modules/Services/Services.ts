import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import Attachment from "./Attachment.ts";
import AWSSQS from "./AWS-SQS.ts";
import ConsoleService from "./Console.ts";
import Email from "./Email.ts";
import MQTT from "./MQTT.ts";
import Notification from "./Notification.ts";
import PDFService from "./PDF.ts";
import Sendgrid from "./Sendgrid.ts";
import SMS from "./SMS.ts";
import SMTP from "./SMTP.ts";
import TwilioWhatsapp from "./Twilio-Whatsapp.ts";
import Twilio from "./Twillio.ts";

/**
 * Service abstractions for external integrations
 *
 * This class provides convenient interfaces for integrating with external services
 * commonly used in IoT applications, including messaging, notifications, file handling,
 * and third-party platforms. All services are configured with your analysis token.
 *
 * @example SMS notifications
 * ```ts
 * import { Services } from "@tago-io/sdk";
 *
 * const services = new Services({ token: "your-analysis-token" });
 *
 * await services.sms.send({
 *   to: "+1234567890",
 *   message: "Alert: Temperature threshold exceeded!"
 * });
 * ```
 *
 * @example Email with attachments
 * ```ts
 * await services.email.send({
 *   to: "user@example.com",
 *   subject: "IoT Report",
 *   message: "Please find the report attached.",
 *   attachment: services.attachment.create(pdfBuffer, "report.pdf")
 * });
 * ```
 *
 * @example Console logging (for analysis debugging)
 * ```ts
 * services.console.log("Processing data...");
 * services.console.error("Failed to connect to sensor");
 * ```
 *
 * @example Static methods for quick access
 * ```ts
 * // Using static methods for one-off operations
 * await Services.notification.send({
 *   message: "System alert",
 *   title: "IoT Alert"
 * });
 * ```
 */
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
