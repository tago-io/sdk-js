import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

interface SMSData {
  /**
   * Number to send SMS, Example: +5599999999999
   */
  to: string;
  /**
   * Message to be send
   */
  message: string;
}

class SMS extends TagoIOModule<GenericModuleParams> {
  /**
   * Send SMS to phone number
   * @param sms SMS Object
   */
  public async send(sms: SMSData): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/analysis/services/sms/send",
      method: "POST",
      body: sms,
    });

    return result;
  }
}

export default SMS;
