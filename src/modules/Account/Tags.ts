import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";

class Tags extends TagoIOModule<GenericModuleParams> {
  public async getTagKeys(type: string) {
    // TODO: Create interface on doRequest
    const result = await this.doRequest<any>({
      path: `/tags/keys/${type}`,
      method: "GET",
    });

    return result;
  }
}

export default Tags;
