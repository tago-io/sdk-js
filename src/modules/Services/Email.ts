import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

interface EmailData {
  /**
   * E-mail address to be sent
   */
  to: string;
  /**
   * Subject of the e-mail
   */
  subject: string;
  /**
   * Message scope for the e-mail
   *
   * If you use template, this parameter will be ignored.
   */
  message?: string;
  /**
   * E-mail to be indicated for reply
   */
  from?: string;
  /**
   * Message scope for the e-mail
   */
  attachment?: {
    /**
     * Archive itself
     */
    archive: string;
    /**
     * Name for the archive
     */
    filename: string;
  };
  /**
   * HTML archive
   */
  html?: string;
  /**
   * Use TagoRUN E-Mail Template
   *
   * Tip: If you use template together with attachment the
   * back-end will generate a parameter called 'URL';
   */
  template?: {
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
  };
}

class Email extends TagoIOModule<GenericModuleParams> {
  /**
   * Send email
   * @param email E-mail Object
   */
  public async send(email: EmailData): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/analysis/services/email/send",
      method: "POST",
      body: email,
    });

    return result;
  }
}

export default Email;
