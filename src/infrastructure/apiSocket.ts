import io from "socket.io-client";
import config from "../config";
import regions from "../regions";
import { GenericModuleParams } from "../common/TagoIOModule";

/**
 * TagoIO Socket Connection
 * In some cases you will should emit channels to subscribe/unsubscribe
 * example:
 *  - socket.emit('attach', 'bucket', '5d30e5f8577736001b1a5e11');
 *  - socket.emit('unattach', 'bucket', '5d30e5f8577736001b1a5e11');
 * @internal
 * @param params TagoIO Token and Region
 * @param socketIOExtraOptions SocketIO Extra Options
 */
function apiSocket(params: GenericModuleParams, socketIOExtraOptions = {}) {
  const socket = io.connect(regions(params.region).realtime, {
    ...config.socketOpts,
    query: {
      token: params.token,
    },
    ...socketIOExtraOptions,
  });

  return socket;
}

/**
 * @internal
 */
const channels = {
  notification: "notification::data",
  analysisConsole: "analysis::console",
  analysisTrigger: "analysis::trigger",
  bucketData: "bucket::data",
};

export default apiSocket;
export { channels };
