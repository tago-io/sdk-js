import type { GenericID } from "../../common/common.types.ts";
import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";

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
   * @deprecated Migrate to TagoTIP: https://docs.tago.io/docs/tagotip/transports/mqtt
   * @param mqtt MQTT Object
   */
  public async publish(mqtt: MQTTData | MQTTDataDeprecated): Promise<string> {
    console.warn(
      "[TagoIO SDK] services.mqtt.publish() is deprecated. Migrate to TagoTIP: https://docs.tago.io/docs/tagotip/transports/mqtt"
    );

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
