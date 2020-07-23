import Account from "../Account/Account";

/**
 *
 * @param account Account instance
 * @param deviceID Id of device
 * @param names Array of names of the token, if null will return the first token found
 */
async function getTokenByName(Account: Account, deviceID: string, names?: string[] | string): Promise<string> {
  const tokens = await Account.devices.tokenList(deviceID);
  if (!tokens || !tokens[0]) {
    return null;
  }

  if (!names || !names.length) {
    return tokens[0]?.token;
  }

  const namesArray = Array.isArray(names) ? names : [names];

  const token = tokens.find((t) => namesArray.some((n) => t.name.includes(n)));

  if (!token) {
    throw `Can't find Token for ${deviceID} in ${namesArray.join(", ")}`;
  }

  return token.token;
}

export default getTokenByName;
