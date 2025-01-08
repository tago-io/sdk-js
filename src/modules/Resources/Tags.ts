import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

type TagTypes = "bucket" | "device" | "dashboard" | "action" | "analysis" | "tcore" | "run_users" | "secrets";

class Tags extends TagoIOModule<GenericModuleParams> {
  /**
   * @description Retrieves all available tag keys for a specific resource type in the account.
   *
   * @see {@link https://help.tago.io/portal/en/kb/articles/tags} Tags System
   *
   * @example
   * If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * const deviceTags = await Resources.tags.getTagKeys("device");
   * console.log(deviceTags);
   *
   * const dashboardTags = await Resources.tags.getTagKeys("dashboard");
   * console.log(dashboardTags);
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
