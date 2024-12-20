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
   * Lists all devices from your application with pagination.
   *
   * @param {DeviceQuery} queryObj - Query parameters for filtering and pagination
   * @param {number} queryObj.page - Page number
   * @param {string[]} queryObj.fields - Fields to be returned
   * @param {object} queryObj.filter - Filter conditions
   * @param {number} queryObj.amount - Number of items per page
   * @param {[string, 'asc' | 'desc']} queryObj.orderBy - Field and direction to sort by
   * @returns {Promise<DeviceInfo[]>} List of devices
   *
   * @deprecated Use `Resources.devices.list()` instead
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * // Use this instead of Buckets
   * const list = await Resources.devices.list({
   *   page: 1,
   *   fields: ["id", "name"],
   *   amount: 10,
   *   orderBy: ["name", "asc"]
   * });
   * console.log(list);
   * ```
   */
  public async list<T extends DeviceQuery>(queryObj?: T) {
    return await this.devices.list(queryObj);
  }

  /**
   * Retrieves detailed information about a specific device.
   *
   * @param {GenericID} deviceID - ID of the device
   * @returns {Promise<DeviceInfo>} Device details
   *
   * @deprecated Use `Resources.devices.info()` instead
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * // Use this instead of Buckets
   * const deviceInfo = await Resources.devices.info("device-id-123");
   * console.log(deviceInfo);
   * ```
   */
  public async info(deviceID: GenericID) {
    return await this.devices.info(deviceID);
  }

  /**
   * Gets the amount of data stored for a device.
   *
   * @param {GenericID} deviceID - ID of the device
   * @returns {Promise<number>} Amount of data stored
   * @deprecated Use `Resources.devices.amount()` instead
   *
   * @example If receive an error "Authorization Denied", check polices in Access Management.
   * ```typescript
   * // Use this instead of Buckets
   * const amount = await Resources.devices.amount("device-id-123");
   * console.log(amount);
   * ```
   */
  public async amount(deviceID: GenericID) {
    return await this.devices.amount(deviceID);
  }
}

export default Buckets;
