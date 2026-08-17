import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";

interface TagoTiPCommand {
  /** Serial of the target device */
  serial: string;
  /** Protocol used to deliver the command */
  protocol: string;
  /** Command payload sent to the device */
  body: string;
}

class TagoTiP extends TagoIOModule<GenericModuleParams> {
  /**
   * Send a command to a device through TagoTiP.
   *
   * Requires a Service Authorization token in the module `token`.
   *
   * @param command Command object with serial, protocol and body
   *
   * @example
   * ```ts
   * import { Services } from "@tago-io/sdk";
   *
   * const services = new Services({ token: "your-service-authorization-token" });
   *
   * await services.tagotip.cmd({
   *   serial: "mqtt1",
   *   protocol: "mqtt",
   *   body: "reboot-now",
   * });
   * ```
   */
  public async cmd(command: TagoTiPCommand): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/tip/cmd",
      method: "POST",
      body: {
        serial: command.serial,
        protocol: command.protocol,
        body: command.body,
      },
    });

    return result;
  }
}

export default TagoTiP;
export type { TagoTiPCommand };
