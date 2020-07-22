import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { GenericID } from "../../common/common.types";

interface MQTTData {
  /**
   * Topic of the message
   */
  topic: string;
  /**
   * Message scope
   */
  message: string;
  /**
   * Bucket to receive message
   */
  bucket: GenericID;
  /**
   * Options of the publishing message
   */
  options?: {
    /**
     * Default true
     */
    retain?: boolean;
    /**
     * Default 0
     */
    qos?: number;
  };
}

class MQTT extends TagoIOModule<GenericModuleParams> {
  public async publish(mqtt: MQTTData) {
    const result = await this.doRequest<string>({
      path: "/analysis/services/mqtt/publish",
      method: "POST",
      body: {
        topic: mqtt.topic,
        message: mqtt.message,
        bucket: mqtt.bucket,
        ...mqtt.options,
      },
    });

    return result;
  }
}

export default MQTT;
