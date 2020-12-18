import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

interface AttachmentOptions {
  /**
   * Archive itself
   */
  archive: string;
  /**
   * Name for the archive
   */
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
   * E-mail address to be sent
   *
   * example: "myclien@tago.io"
   */
  to: string;
  /**
   * Name of origin
   *
   * example: "My Run"
   */
  from?: string;
  /**
   * Subject of the e-mail
   *
   * only allow with message or html
   */
  subject: string;
  /**
   * Attachment for the e-mail
   */
  attachment?: AttachmentOptions;
}

interface EmailRawText {
  /**
   * Message in raw text for email body
   */
  message: string;
}

interface EmailHTML {
  /**
   * HTML email body
   */
  html: string;
}

interface EmailWithTemplate {
  /**
   * E-mail address to be sent
   *
   * example: "myclien@tago.io"
   */
  to: string;
  /**
   * Name of origin
   *
   * example: "My Run"
   */
  from?: string;
  /**
   * Attachment for the e-mail
   */
  attachment?: AttachmentOptions;
  /**
   * Use TagoRUN E-Mail Template
   *
   * Tip: If you use template together with attachment the
   * back-end will generate a parameter called 'URL';
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
