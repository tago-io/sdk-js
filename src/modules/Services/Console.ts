import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";

class ConsoleService extends TagoIOModule<GenericModuleParams> {
  public async log(message: string, time?: Date) {
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
