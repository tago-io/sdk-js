import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { EmailBase, EmailHTML, EmailRawText, EmailWithTemplate } from "./Email";

type SMTPCredentials = {
  smtp_secret: string | { smtp_server: string; smtp_port: number; username: string; password: string };
};
type SMTPEmailBase = EmailBase & SMTPCredentials;
type SMTPEmailWithTemplate = EmailWithTemplate & SMTPCredentials;
type SMTPEmailWithHTML = SMTPEmailBase & EmailHTML;
type SMTPEmailWithRawText = SMTPEmailBase & EmailRawText;

class Email extends TagoIOModule<GenericModuleParams> {
  /**
   * Send email using SMTP Integration
   *
   * @param email - The email object containing all necessary information
   * @returns A promise that resolves to a success message
   *
   * @remarks
   * This method requires either a TagoIO SMTP Secret or SMTP credentials.
   * For enhanced security, it's strongly recommended to use TagoIO Secrets
   * rather than hardcoding credentials.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/secrets} for TagoIO Secrets usage
   *
   * @example
   * ```typescript
   * const environment = Utils.envToJson(context.environment);
   * const emailService = new Services({ token: context.token }).smtp;
   * const result = await emailService.send({
   *   to: "client@company.com",
   *   subject: "Reports",
   *   message: "Hello client, it's your report",
   *   smtp_secret: environment.SMTP_TAGOIO_SECRET
   * });
   * console.log(result);
   * ```
   *
   * @example
   * // Using an array of recipients
   * const result = await emailService.send({
   *   to: ["client1@company.com", "client2@company.com"],
   *   subject: "Reports",
   *   message: "Hello clients, it's your report",
   *   smtp_secret: environment.SMTP_TAGOIO_SECRET
   * });
   *
   * @example
   * // Sending HTML content
   * const result = await emailService.send({
   *   to: "client@company.com",
   *   subject: "Reports",
   *   html: "<p>Hello client, it's your <strong>report</strong></p>",
   *   smtp_secret: environment.SMTP_TAGOIO_SECRET
   * });
   *
   * @example
   * // Using a template
   * const result = await emailService.send({
   *   to: "client@company.com",
   *   template: { name: "my_template" },
   *   smtp_secret: environment.SMTP_TAGOIO_SECRET
   * });
   */
  public async send(email: SMTPEmailWithRawText): Promise<string>;
  public async send(email: SMTPEmailWithHTML): Promise<string>;
  public async send(email: SMTPEmailWithTemplate): Promise<string>;
  public async send(email: any): Promise<string> {
    if (email.html && email.message) {
      console.warn(new Error("HTML field will overwrite message field"));
    }

    try {
      JSON.parse(email.smtp_secret);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("SMTP Secret is not a valid JSON");
      }
    }

    if (Array.isArray(email.to)) {
      email.to = email.to.join(",");
    }

    const result = await this.doRequest<string>({
      path: "/analysis/services/email-smtp/send",
      method: "POST",
      body: email,
    });

    return result;
  }
}

export default Email;
