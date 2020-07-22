import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

class ConsoleService extends TagoIOModule<GenericModuleParams> {
  /**
   * Log message in analisys console
   *
   * @param {string} message
   * @param {Date} [time]
   * @returns {Promise<string>}
   * @memberof ConsoleService
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
