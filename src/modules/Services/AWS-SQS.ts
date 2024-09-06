import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

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
  message: string | object;
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
   * const sqsService = new Services({ token: context.token }).aws_sqs;
   * const result = await sqsService.sendMessage({
   *   aws_region: "us-east-1",
   *   queue_url: "https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue",
   *   access_key_id: "YOUR_AWS_ACCESS_KEY_ID",
   *   secret_access_key: "YOUR_AWS_SECRET_ACCESS_KEY",
   *   message: "Hello from TagoIO!"
   * });
   * console.log(result);
   * ```
   */
  public async sendMessage(sqsData: AWSSQSData): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/analysis/services/queue-sqs/send",
      method: "POST",
      body: sqsData,
    });

    return result;
  }
}

export default AWSSQS;
