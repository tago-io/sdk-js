import TagoIOModule, { type doRequestParams } from "../../common/TagoIOModule.ts";
import type { Regions, RegionsObj } from "../../regions.ts";

/**
 * Gets the current TagoIO API version
 * @param region Optional region to check version for
 * @returns Promise resolving to version string
 *
 * @example
 * ```typescript
 * import { Utils } from "@tago-io/sdk";
 *
 * const version = await Utils.getAPIVersion();
 * console.log(version); // "1.0.0"
 * ```
 */
async function getAPIVersion(region?: Regions | RegionsObj): Promise<string> {
  const params: doRequestParams = {
    path: "/status",
    method: "GET",
  };

  const result = await GetAPIVersionInternal.doRequestAnonymous<{ version: string }>(params, region);

  return result.version;
}

/**
 * Internal class to access protected static method
 * @internal
 */
class GetAPIVersionInternal extends TagoIOModule<{ token: string }> {
  public static override async doRequestAnonymous<TR>(
    requestObj: doRequestParams,
    region?: Regions | RegionsObj
  ): Promise<TR> {
    return TagoIOModule.doRequestAnonymous<TR>(requestObj, region);
  }
}

export default getAPIVersion;
