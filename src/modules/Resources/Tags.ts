import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule";

type TagTypes = "bucket" | "device" | "dashboard" | "action" | "analysis" | "tcore" | "run_users" | "secrets";

class Tags extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves all available tag keys for a specific resource type in the account.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/tags} Tags System
   *
   * @example
   * ```typescript
   * const resources = new Resources({ token: "YOUR-PROFILE-TOKEN" });
   *
   * const deviceTags = await resources.tags.getTagKeys("device");
   * console.log(deviceTags); // [ 'tag-key1', 'tag-key2', 'tag-key3' ]
   *
   * const dashboardTags = await resources.tags.getTagKeys("dashboard");
   * console.log(dashboardTags); // [ 'tag-key1', 'tag-key2', 'tag-key3' ]
   * ```
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
