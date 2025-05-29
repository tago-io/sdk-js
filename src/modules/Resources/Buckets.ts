import type { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import Devices from "./Devices";
import type { DeviceQuery } from "./devices.types";

/**
 * @deprecated Use `Resources.devices` instead.
 */

class Buckets extends TagoIOModule<GenericModuleParams> {
  public devices = new Devices(this.params);

  /**
   * @description Lists all devices from your application with pagination.
   *
   * @deprecated Use `Resources.devices.list()` instead
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Device** / **Access** in Access Management.
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
   * @description Retrieves detailed information about a specific device.
   *
   * @deprecated Use `Resources.devices.info()` instead
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Device** / **Access** in Access Management.
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
   * @description Gets the amount of data stored for a device.
   *
   * @example
   * If receive an error "Authorization Denied", check policy **Device** / **Access** in Access Management.
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
