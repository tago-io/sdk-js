import TagoIOModule, { ConnectorModuleParams } from "../../common/TagoIOModule";
import { NetworkDeviceListQuery, INetworkInfo, NetworkDeviceListQueryInfo } from "./network.types";
import { GenericID, GenericToken } from "../../common/common.types";
import dateParser from "../Utils/dateParser";
import { ConfigurationParams } from "../Account/devices.types";

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

  /**
   * Retrieves a list with all devices tokens related to
   * network and connector. Network require_devices_access
   * param need to be true.
   * @default
   * queryObj: {
   *   page: 1,
   *   filter: {},
   *   amount: 20,
   *   orderBy: "name,asc"
   * }
   * @param connectorID Connector identification
   * @param queryObj Search query params
   */
  public async deviceList(
    connectorID: GenericID,
    queryObj?: NetworkDeviceListQuery
  ): Promise<NetworkDeviceListQueryInfo[]> {
    let result = await this.doRequest<NetworkDeviceListQueryInfo[]>({
      path: `/integration/network/${connectorID}/devices`,
      method: "GET",
      params: {
        page: queryObj?.page || 1,
        filter: queryObj?.filter || {},
        amount: queryObj?.amount || 20,
        orderBy: queryObj?.orderBy ? `${queryObj.orderBy[0]},${queryObj.orderBy[1]}` : "name,asc",
      },
    });

    result = result.map((data) =>
      dateParser(data, ["last_input", "last_output", "updated_at", "created_at", "inspected_at"])
    );

    return result;
  }

  /**
   * Create or edit param for the Device in network
   * @param deviceID Device ID
   * @param configObj Configuration Data
   * @param paramID Parameter ID
   */
  public async deviceParamSet(
    deviceID: GenericID,
    configObj: Partial<ConfigurationParams> | Partial<ConfigurationParams>[],
    paramID?: GenericID
  ): Promise<string> {
    if (paramID && Array.isArray(configObj)) {
      throw "paramSet must not be supplied with arg3 when using arrays";
    }
    const result = await this.doRequest<string>({
      path: `/integration/network/${deviceID}/params`,
      method: "POST",
      body: paramID
        ? {
            id: paramID,
            ...configObj,
          }
        : configObj,
    });

    return result;
  }
}

export default Network;
