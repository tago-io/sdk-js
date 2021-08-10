import axios from "axios";
import Account from "../Account/Account";
import { DownlinkOptions } from "./utils.types";

async function sendDownlink(account: Account, device_id: string, dn_options: DownlinkOptions) {
  if (!(account instanceof Account)) {
    throw "The parameter 'account' must be an instance of a TagoIO Account.";
  }

  // Find the token containing the authorization code used.
  const device_tokens = await account.devices.tokenList(device_id, {
    page: 1,
    fields: ["name", "serie_number", "last_authorization"],
    amount: 10,
  });

  const token = device_tokens.find((x) => x.serie_number && x.last_authorization);
  if (!token) throw "Can't perform the downlink. Wait for at least 1 uplink from the NS to use this operation.";

  // Get the connector ID from the device
  const { network: network_id } = await account.devices.info(device_id);
  if (!network_id) throw "Device is not using a network.";

  // Get the network information with the NS URL for the Downlink
  const network = await account.integration.networks.info(network_id, ["id", "middleware_endpoint", "name"]);
  if (!network.middleware_endpoint) throw "This device network doesn't support downlinks.";

  // Set the parameters for the device. Some NS like Everynet need this.
  const params = await account.devices.paramList(device_id);
  let downlink_param = params.find((x) => x.key === "downlink");
  downlink_param = {
    id: downlink_param ? downlink_param.id : null,
    key: "downlink",
    value: String(dn_options.payload),
    sent: false,
  };
  await account.devices.paramSet(device_id, downlink_param);

  const data = {
    device: token.serie_number,
    authorization: token.last_authorization,
    payload: dn_options.payload,
    port: dn_options.port,
  };

  return axios
    .post(`https://${network.middleware_endpoint}/downlink`, data)
    .then((result) => {
      return `Downlink accepted with status ${result.status}`;
    })
    .catch((error) => {
      if (error.response?.data.includes("Authorization is missing")) {
        throw "Additional parameter with in the Authorization used for this device";
      }
      throw `Downlink failed with status ${error.response.status}: ${error.response.data}`;
    });
}

export { sendDownlink };
