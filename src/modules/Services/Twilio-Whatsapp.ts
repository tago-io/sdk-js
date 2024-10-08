import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { AttachmentOptions } from "./Email";

interface TwilioWhatsappData {
  /**
   * Number to send Whatsapp message, Example: +5599999999999
   */
  to: string;
  /**
   * Message to be send
   */
  message: string;
  /**
   * From number registered with Twilio, Example: +5599999999999
   */
  from: string;
  /**
   * Twilio account SID
   */
  twilio_sid: string;
  /**
   * Twilio auth token
   */
  twilio_token: string;
  /**
   * Content/Type of the request when sending a file, must be the same content type of the file
   */
  content_type?: string;
  /**
   * File attachment for the whatsapp (optional)
   * @see AttachmentOptions
   */
  attachment?: AttachmentOptions;
}

class TwilioWhatsapp extends TagoIOModule<GenericModuleParams> {
  /**
   * Send Whatsapp message to a phone number using Twilio Integration
   *
   * @param whatsapp - The Whatsapp object containing all necessary information
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
   * @remarks
   * Supported media types:
   * Images: JPG, JPEG, PNG, WEBP*
   * Audio: OGG**, AMR, 3GP, AAC, MPEG
   * Documents: PDF, DOC, DOCX, PPTX, XLSX
   * Video: MP4 (with H.264 video codec and AAC audio)
   * Contacts: vCard (.vcf)
   * The maximum size limit is 16MB. Please note that the size limit for images is only 5 MB
   *
   * @example
   * ```typescript
   * const environment = Utils.envToJson(context.environment);
   * const twilioWhatsappService = new Services({ token: context.token }).twilio_whatsapp;
   * const result = await twilioWhatsappService.send({
   *   to: "+1234567890",
   *   message: "Hello from TagoIO!",
   *   from: "+0987654321",
   *   twilio_sid: environment.TWILIO_SID,
   *   twilio_token: environment.TWILIO_TOKEN,
   *   content_type: "image/jpeg",
   *   attachment: {
   *    filename: "image.jpg",
   *    archive: "base64_encoded_image",
   *   },
   * });
   * console.log(result);
   * ```
   */
  public async send(whatsapp: TwilioWhatsappData): Promise<string> {
    if (whatsapp.attachment && !whatsapp.content_type) {
      throw new Error("Content type is required when sending a file");
    }

    const result = await this.doRequest<string>({
      path: "/analysis/services/whatsapp-twilio/send",
      method: "POST",
      body: whatsapp,
    });

    return result;
  }
}

export default TwilioWhatsapp;
