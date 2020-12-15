import TagoIOModule, { ConnectorModuleParams } from "../../common/TagoIOModule";
import { INetworkInfo } from "./network.types";
import { GenericToken } from "../../common/common.types";

class Network extends TagoIOModule<ConnectorModuleParams> {
  /**
   * Get information about the current network
   */
  public async info(): Promise<INetworkInfo> {
    const result = await this.doRequest<INetworkInfo>({
      path: "/info",
      method: "GET",
      params: {
        details: this.params.details,
      },
    });

    return result;
  }

  /**
   * Get a valid token using token serie
   * @param serieNumber
   * @param authorization
   */
  public async resolveToken(serieNumber: string, authorization?: string): Promise<GenericToken> {
    let path = `/integration/network/resolve/${serieNumber}`;

    if (authorization) path = `${path}/${authorization}`;

    const result = await this.doRequest<GenericToken>({
      path,
      method: "GET",
      params: {
        details: this.params.details,
      },
    });

    return result;
  }
}

export default Network;
