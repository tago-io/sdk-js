import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";

interface AttachmentOptions {
  /** Archive itself */
  archive: string;
  /** Type of attached data e.g. “base64” */
  type?: string;
  /** Name for the archive */
  filename: string;
}

interface TemplateOptions {
  /**
   * Template name
   *
   * You can create an e-mail template on TagoRUN options at
   * https://admin.tago.io/run
   */
  name: string;
  /**
   * Parameters to parse on Template
   *
   * You can use that parameter as local variable
   * using $PARAMETER_KEY$
   *
   * example: params = { name: 'John' }
   * will be $name$ on template document
   */
  params?: {
    [key: string]: string | number;
  };
}

interface EmailBase {
  /**
   * Recipient email address(es)
   * @example
   * "client@example.com"
   * ["client1@example.com", "client2@example.com"]
   */
  to: string | string[];
  /**
   * Sender name (optional)
   * If not provided, the default sender name configured in TagoRUN will be used
   * @example "My Application"
   */
  from?: string;
  /**
   * Subject of the e-mail
   *
   * only allow with message or html
   */
  subject: string;
  /**
   * File attachment for the email (optional)
   * @see AttachmentOptions
   */
  attachment?: AttachmentOptions;
}

interface EmailRawText {
  /** Message in raw text for email body */
  message: string;
}

interface EmailHTML {
  /** HTML email body */
  html: string;
}

interface EmailWithTemplate {
  /**
   * Recipient email address(es)
   * @example
   * "client@example.com"
   * ["client1@example.com", "client2@example.com"]
   */
  to: string | string[];
  /**
   * Sender name (optional)
   * If not provided, the default sender name configured in TagoRUN will be used
   * @example "My Application"
   */
  from?: string;
  /**
   * File attachment for the email (optional)
   * @see AttachmentOptions
   */
  attachment?: AttachmentOptions;
  /**
   * TagoRUN Email Template configuration
   *
   * Use this to send emails based on pre-defined templates in TagoRUN
   *
   * @see TemplateOptions
   * @remarks When using a template with an attachment, a $URL$ variable is automatically
   *       generated and can be used in the template to reference the attachment
   */
  template?: TemplateOptions;
}

type EmailWithHTML = EmailBase & EmailHTML;
type EmailWithRawText = EmailBase & EmailRawText;

class Email extends TagoIOModule<GenericModuleParams> {
  /**
   * Send email
   * @param email E-mail Object
   *
   * @example
   * ```json
   * { to: "client(at)company.com", subject: "Reports", message: "Hello client, it's your report" }
   * { to: ["client(at)company.com", "client2(at)company.com"], subject: "Reports", message: "Hello client, it's your report" }
   * { to: "client(at)company.com", subject: "Reports", html: "<p>Hello client, it's your report</p>" }
   * { to: "client(at)company.com", template: { name: "my_template" } }
   * ```
   */
  public async send(email: EmailWithRawText): Promise<string>;
  public async send(email: EmailWithHTML): Promise<string>;
  public async send(email: EmailWithTemplate): Promise<string>;
  public async send(email: any): Promise<string> {
    if (email.html && email.message) {
      console.warn(new Error("HTML field will overwrite message field"));
    }

    const result = await this.doRequest<string>({
      path: "/analysis/services/email/send",
      method: "POST",
      body: email,
    });

    return result;
  }
}

export default Email;
export type { EmailWithTemplate, EmailBase, AttachmentOptions, TemplateOptions, EmailHTML, EmailRawText };
