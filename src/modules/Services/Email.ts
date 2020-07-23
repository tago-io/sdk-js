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
   */
  message: string;
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
   * Whitelabel url to set domain
   */
  whitelabel_url?: string;
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
