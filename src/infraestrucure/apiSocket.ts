import io from "socket.io-client";
import config from "../config.js";
import regions from "../regions.js";
import { GenericModuleParams } from "../common/TagoIOModule.js";

/**
 * TagoIO Socket Connection
 * @param {String} token TagoIO Token
 * @param {JSON} socketIOExtraOptions SocketIO Extra Options
 * @return {io.Socket} SocketIO Instance
 * @description
 * In some cases you will should emit channels to subscribe/unsubscribe
 * exemple:
 *  - socket.emit('attach', 'bucket', '5d30e5f8577736001b1a5e11');
 *  - socket.emit('unattach', 'bucket', '5d30e5f8577736001b1a5e11');
 */
function apiSocket(params: GenericModuleParams, socketIOExtraOptions = {}) {
  const socket = io.connect(regions[params.region].realtime, {
    ...config.socketOpts,
    query: {
      token: params.token,
    },
    ...socketIOExtraOptions,
  });

  return socket;
}

const channels = {
  notification: "notification::data",
  analysisConsole: "analysis::console",
  analysisTrigger: "analysis::trigger",
  bucketData: "bucket::data",
};

export default apiSocket;
export { channels };
