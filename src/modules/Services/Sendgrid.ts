import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { EmailBase, EmailHTML, EmailRawText, EmailWithTemplate } from "./Email";

interface SendgridCredentials {
  sendgrid_api_key: string;
}
type SendgridEmailBase = EmailBase & SendgridCredentials;
type SendgridEmailWithTemplate = EmailWithTemplate & SendgridCredentials;
type SendgridEmailWithHTML = SendgridEmailBase & EmailHTML;
type SendgridEmailWithRawText = SendgridEmailBase & EmailRawText;

class Sendgrid extends TagoIOModule<GenericModuleParams> {
  /**
   * Send email using Sendgrid integration
   *
   * @param email - The email object containing all necessary information
   * @returns A promise that resolves to a success message
   *
   * @remarks
   * This method requires Sendgrid API key.
   * For enhanced security, it's strongly recommended to use TagoIO Secrets
   * rather than hardcoding credentials.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/secrets} for TagoIO Secrets usage
   *
   * @example
   * ```typescript
   * const sendgridService = new Services({ token: context.token }).sendgrid;
   * const result = await sendgridService.send({
   *   from: "sender@company.com"
   *   to: "client@company.com",
   *   subject: "Reports",
   *   message: "Hello client, it's your report",
   *   sendgrid_api_key: "YOUR_SENDGRID_API_KEY"
   * });
   * console.log(result);
   * ```
   *
   * @example
   * // Using an array of recipients
   * const result = await sendgridService.send({
   *   from: "sender@company.com"
   *   to: ["client1@company.com", "client2@company.com"],
   *   subject: "Reports",
   *   message: "Hello clients, it's your report",
   *   sendgrid_api_key: "YOUR_SENDGRID_API_KEY"
   * });
   *
   * @example
   * // Sending HTML content
   * const result = await sendgridService.send({
   *   from: "sender@company.com"
   *   to: "client@company.com",
   *   subject: "Reports",
   *   html: "<p>Hello client, it's your <strong>report</strong></p>",
   *   sendgrid_api_key: "YOUR_SENDGRID_API_KEY"
   * });
   *
   * @example
   * // Using a template
   * const result = await sendgridService.send({
   *   from: "sender@company.com"
   *   to: "client@company.com",
   *   template: { name: "my_template" },
   *   sendgrid_api_key: "YOUR_SENDGRID_API_KEY"
   * });
   */
  public async send(email: SendgridEmailWithRawText): Promise<string>;
  public async send(email: SendgridEmailWithHTML): Promise<string>;
  public async send(email: SendgridEmailWithTemplate): Promise<string>;
  public async send(email: any): Promise<string> {
    if (email.html && email.message) {
      console.warn(new Error("HTML field will overwrite message field"));
    }

    const result = await this.doRequest<string>({
      path: "/analysis/services/email-sendgrid/send",
      method: "POST",
      body: email,
    });

    return result;
  }
}

export default Sendgrid;
