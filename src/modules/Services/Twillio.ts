import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

interface TwilioData {
  /** Number to send SMS, Example: +5599999999999 */
  to: string;
  /** Message to be send */
  message: string;
  /** From number registered with Twilio, Example: +5599999999999 */
  from: string;
  /** Twilio account SID */
  twilio_sid: string;
  /** Twilio auth token */
  twilio_token: string;
}

class Twilio extends TagoIOModule<GenericModuleParams> {
  /**
   * Send SMS to a phone number using Twilio Integration
   *
   * @param sms - The SMS object containing all necessary information
   * @returns A promise that resolves to a success message
   *
   * @remarks
   * This method requires a Twilio account with valid credentials (SID and Token).
   * For enhanced security, it's strongly recommended to store these credentials
   * using TagoIO Secrets rather than hardcoding them.
   *
   * @see {@link https://www.twilio.com/console} for Twilio account management
   * @see {@link https://help.tago.io/portal/en/kb/articles/secrets} for TagoIO Secrets usage
   *
   * @example
   * ```typescript
   * const environment = Utils.envToJson(context.environment);
   * const twilioService = new Services({ token: context.token }).twilio;
   * const result = await twilioService.send({
   *   to: "+1234567890",
   *   message: "Hello from TagoIO!",
   *   from: "+0987654321",
   *   twilio_sid: environment.TWILIO_SID,
   *   twilio_token: environment.TWILIO_TOKEN,
   * });
   * console.log(result);
   * ```
   */
  public async send(sms: TwilioData): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/analysis/services/sms-twilio/send",
      method: "POST",
      body: sms,
    });

    return result;
  }
}

export default Twilio;
