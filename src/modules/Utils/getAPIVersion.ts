import TagoIOModule, { type GenericModuleParams, type doRequestParams } from "../../common/TagoIOModule";
import type { Regions, RegionsObj } from "../../regions";

class GetAPIVersion extends TagoIOModule<GenericModuleParams> {
  public static async getVersion(region?: Regions | RegionsObj): Promise<string> {
    const params: doRequestParams = {
      path: "/status",
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<{ version: string }>(params, region);

    return result.version;
  }
}

const getVersion: typeof GetAPIVersion.getVersion = GetAPIVersion.getVersion;
export default getVersion;
