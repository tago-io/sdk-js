import type { ExportOption, GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import Devices from "./Devices";
import type { ExportBucket, ExportBucketOption } from "./buckets.types";
import type { DeviceCreateInfo, DeviceEditInfo, DeviceQuery } from "./devices.types";

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
   * Create a new Device in the profile.
   * @param deviceObj Object with the fields and values for a new Device.
   *
   * @deprecated Use the method from `Resources.devices` instead.
   */
  public async create(deviceObj: DeviceCreateInfo) {
    return await this.devices.create(deviceObj);
  }

  /**
   * Modify any property of the Device.
   * @param deviceID Device ID
   * @param deviceObj Object with the fields and values to modify.
   *
   * @deprecated Use the method from `Resources.devices` instead.
   */
  public async edit(deviceID: GenericID, deviceObj: DeviceEditInfo) {
    return await this.devices.edit(deviceID, deviceObj);
  }

  /**
   * Delete a device from the profile.
   * @param deviceID Device ID
   *
   * @deprecated Use the method from `Resources.devices` instead.
   */
  public async delete(deviceID: GenericID) {
    return await this.devices.delete(deviceID);
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

  /**
   * Export Data from Bucket
   * @param buckets Array of JSON with get details
   * @param output Type of output
   * @param optionsObj Options of request
   *
   * @deprecated Use device.copyChunk or device.getData to build reports
   */
  public async exportData(
    buckets: ExportBucket,
    output: ExportOption,
    optionsObj?: ExportBucketOption
  ): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/data/export?output=${output}`,
      method: "POST",
      body: {
        buckets,
        ...optionsObj,
      },
    });

    return result;
  }
}

export default Buckets;
