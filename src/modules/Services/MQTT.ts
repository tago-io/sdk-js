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
   * @deprecated Legacy MQTT is deprecated. Use the new MQTT connector or HTTP API instead.
   * See: https://docs.tago.io/docs/tagoio/integrations/networks/mqtt/
   * @param mqtt MQTT Object
   */
  public async publish(mqtt: MQTTData | MQTTDataDeprecated): Promise<string> {
    console.warn(
      "[TagoIO SDK] DEPRECATION: services.mqtt.publish() is deprecated and will be removed in a future major version. " +
        "Migrate to the new MQTT connector or use the HTTP API. " +
        "See: https://docs.tago.io/docs/tagoio/integrations/networks/mqtt/"
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
