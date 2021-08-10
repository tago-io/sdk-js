import Account from "../Account/Account";
import Device from "../Device/Device";
import getTokenByName from "./getTokenByName";

/**
 * Get the TagoIO Device instanced class from a device id
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
