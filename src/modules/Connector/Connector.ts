import TagoIOModule, { ConnectorModuleParams } from "../../common/TagoIOModule";
import { ConnectorInfo } from "./connector.types";
import { GenericToken } from "../../common/common.types";

class Connector extends TagoIOModule<ConnectorModuleParams> {
  /**
   * Get information about the current connector
   */
  public async info(): Promise<ConnectorInfo> {
    const result = await this.doRequest<ConnectorInfo>({
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
    let path = `/connector/resolve/${serieNumber}`;

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

export default Connector;
