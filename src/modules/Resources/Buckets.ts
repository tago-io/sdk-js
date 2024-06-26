import type { ExportOption, GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import Devices from "./Devices";
import type { ExportBucket, ExportBucketOption } from "./buckets.types";
import type { DeviceQuery } from "./devices.types";

/**
 * @deprecated Use `Resources.devices` instead.
 */

class Buckets extends TagoIOModule<GenericModuleParams> {
  public devices = new Devices(this.params);

  /**
   * List Devices in the profile according to filters and pagination.
   * @default
   * ```json
   * queryObj: {
   *   page: 1,
   *   fields: ["id", "name"],
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc",
   * }
   * ```
   * @param queryObj Search query params
   *
   * @deprecated Use the method from `Resources.devices` instead.
   */
  public async list<T extends DeviceQuery>(queryObj?: T) {
    return await this.devices.list(queryObj);
  }

  /**
   * Get information about the Device.
   * @param deviceID Device ID
   *
   * @deprecated Use the method from `Resources.devices` instead.
   */
  public async info(deviceID: GenericID) {
    return await this.devices.info(deviceID);
  }

  /**
   * Get amount of data on the Device.
   * @param deviceID Device ID
   *
   * @deprecated Use the method from `Resources.devices` instead.
   */
  public async amount(deviceID: GenericID) {
    return await this.devices.amount(deviceID);
  }
}

export default Buckets;
