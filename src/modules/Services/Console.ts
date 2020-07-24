import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

class ConsoleService extends TagoIOModule<GenericModuleParams> {
  /**
   * Log message in analysis console
   * @param message Log message
   * @param time Date of message
   */
  public async log(message: string, time?: Date): Promise<string> {
    const timestamp = new Date(time).getTime();

    const result = await this.doRequest<string>({
      path: "/analysis/services/console/send",
      method: "POST",
      body: { message, timestamp: timestamp },
    });

    return result;
  }
}

export default ConsoleService;
