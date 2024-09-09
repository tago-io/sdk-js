import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { Data } from "../../types";

interface AWSCredentials {
  /**
   * AWS region, e.g., us-east-1
   */
  aws_region: string;
  /**
   * SQS queue URL
   */
  queue_url: string;
  /**
   * AWS Access Key ID
   */
  access_key_id: string;
  /**
   * AWS Secret Access Key
   */
  secret_access_key: string;
}

interface AWSSQSData {
  /**
   * SQS secret or AWS credentials
   */
  sqs_secret: string | AWSCredentials;
  /**
   * Message to be sent to SQS
   */
  data: Data | Data[];
}

class AWSSQS extends TagoIOModule<GenericModuleParams> {
  /**
   * Send a message to Amazon SQS
   *
   * @param sqsData - The AWS SQS object containing all necessary information
   * @returns A promise that resolves to a success message
   *
   * @remarks
   * This method requires valid AWS credentials and SQS queue information.
   * For enhanced security, it's strongly recommended to store these credentials
   * using TagoIO Secrets rather than hardcoding them.
   *
   * @see {@link https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html} for AWS SQS documentation
   * @see {@link https://help.tago.io/portal/en/kb/articles/secrets} for TagoIO Secrets usage
   *
   * @example
   * ```typescript
   * const environment = Utils.envToJson(context.environment);
   * const sqsService = new Services({ token: context.token }).aws_sqs;
   * const result = await sqsService.sendMessage({
   *   sqs_secret: environment.AWS_SQS_TAGOIO_SECRET,
   *   data: { variable: "temperature", value: 1 }
   * });
   * console.log(result);
   * ```
   */
  public async sendMessage(sqsData: AWSSQSData): Promise<string> {
    const requestBody: AWSSQSData & { dataList?: Data[]; batch_enabled?: boolean } = Array.isArray(sqsData.data)
      ? { ...sqsData, data: null, dataList: sqsData.data, batch_enabled: true }
      : sqsData;

    const result = await this.doRequest<string>({
      path: "/analysis/services/queue-sqs/send",
      method: "POST",
      body: requestBody,
    });

    return result;
  }
}

export default AWSSQS;
