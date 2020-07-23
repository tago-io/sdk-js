import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

type TagTypes = "bucket" | "device" | "dashboard" | "action" | "analysis";

class Tags extends TagoIOModule<GenericModuleParams> {
  /**
   * Get all Keys from certain type of section
   * @param type List to get the array of tags keys.
   * It can be: bucket, device, dashboard, action, analysis
   */
  public async getTagKeys(type: TagTypes): Promise<string[]> {
    const result = await this.doRequest<string[]>({
      path: `/tags/keys/${type}`,
      method: "GET",
    });

    return result;
  }
}

export default Tags;
