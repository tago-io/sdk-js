import TagoIOModule, { type GenericModuleParams, type doRequestParams } from "../../common/TagoIOModule.ts";
import type { Regions, RegionsObj } from "../../regions.ts";

/**
 * Utility class for retrieving TagoIO API version information
 */
class GetAPIVersion extends TagoIOModule<GenericModuleParams> {
  /**
   * Gets the current TagoIO API version
   * @param region Optional region to check version for
   * @returns Promise resolving to version string
   */
  public static async getVersion(region?: Regions | RegionsObj): Promise<string> {
    const params: doRequestParams = {
      path: "/status",
      method: "GET",
    };

    const result = await TagoIOModule.doRequestAnonymous<{ version: string }>(params, region);

    return result.version;
  }
}

/**
 * Gets the current TagoIO API version
 * @param region Optional region to check version for
 * @returns Promise resolving to version string
 */
const getVersion: typeof GetAPIVersion.getVersion = GetAPIVersion.getVersion;
export default getVersion;
