import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule";
import type { GenericID } from "../../common/common.types";

interface MQTTData {
  /** Topic of the message */
  topic: string;
  /** Message scope */
  message: string;
  /** Device to receive message */
  device: GenericID;
  /** Options of the publishing message */
  options?: {
    /** Default 0 */
    qos?: number;
  };
}

interface MQTTDataDeprecated extends Omit<MQTTData, "device"> {
  /**
   * Bucket to receive message
   * @deprecated use "device" instead
   */
  bucket: GenericID;
}

class MQTT extends TagoIOModule<GenericModuleParams> {
  /**
   * Publish MQTT
   * @param mqtt MQTT Object
   */
  public async publish(mqtt: MQTTData | MQTTDataDeprecated): Promise<string> {
    let device: GenericID;
    if ("device" in mqtt) {
      device = mqtt.device;
    } else {
      device = mqtt.bucket;
    }

    const result = await this.doRequest<string>({
      path: "/analysis/services/mqtt/publish",
      method: "POST",
      body: {
        topic: mqtt.topic,
        message: mqtt.message,
        device: device,
        ...mqtt.options,
      },
    });

    return result;
  }
}

export default MQTT;
