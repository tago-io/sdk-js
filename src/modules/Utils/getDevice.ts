import Device from "../Device/Device.ts";
import Account from "../Resources/AccountDeprecated.ts";
import getTokenByName from "./getTokenByName.ts";

/**
 * Get the TagoIO Device instanced class from a device id
 * @deprecated Use the Resources.devices methods instead
 */
async function getDevice(account: Account, device_id: string): Promise<Device> {
  if (!(account instanceof Account)) {
    throw "The parameter 'account' must be an instance of a TagoIO Account.";
  }

  const token = await getTokenByName(account, device_id);
  if (!token) {
    throw `Token not found for the device id ${device_id}`;
  }

  const device = new Device({ token });

  return device;
}

export default getDevice;
