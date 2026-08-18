import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";

interface TagoTiPCommand {
  /** Serial of the target device */
  serial: string;
  /** Protocol used to deliver the command */
  protocol: string;
  /** Command payload sent to the device */
  body: string;
}

/**
 * TagoTiP command client
 *
 * This class provides a convenient interface for sending commands to devices through
 * TagoTiP. Unlike {@link Services}, which is configured with your analysis token, TagoTiP
 * requires a Service Authorization token, so it is constructed with that token directly.
 *
 * @example Send a command
 * ```ts
 * import { TagoTiP } from "@tago-io/sdk";
 *
 * const tagoTiP = new TagoTiP({ token: "your-service-authorization-token" });
 *
 * await tagoTiP.cmd({
 *   serial: "mqtt1",
 *   protocol: "mqtt",
 *   body: "reboot",
 * });
 * ```
 *
 * @example Inside an analysis, reading the token from the environment
 * ```ts
 * import { Analysis, TagoTiP } from "@tago-io/sdk";
 *
 * async function startAnalysis(context) {
 *   const serviceAuthorizationToken = context.environment.find(
 *     (value) => value.key === "SERVICE_AUTHORIZATION"
 *   )?.value;
 *
 *   if (!serviceAuthorizationToken) {
 *     throw "Missing 'SERVICE_AUTHORIZATION' environment";
 *   }
 *
 *   const tagoTiP = new TagoTiP({ token: serviceAuthorizationToken });
 *
 *   await tagoTiP
 *     .cmd({ serial: "mqtt1", protocol: "mqtt", body: "reboot" })
 *     .then(console.log)
 *     .catch(console.log);
 * }
 *
 * Analysis.use(startAnalysis);
 * ```
 */
class TagoTiP extends TagoIOModule<GenericModuleParams> {
  /**
   * Send a command to a device through TagoTiP.
   *
   * @param command Command object with serial, protocol and body
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
