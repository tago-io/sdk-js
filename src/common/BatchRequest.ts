import TagoIOModule, { GenericModuleParams } from "./TagoIOModule";
import { Method } from "axios";

interface BatchData {
  method?: Method;
  endpoint: string;
  headers: {};
}

class Batch extends TagoIOModule<GenericModuleParams> {
  /**
   * Send a batch commands
   * Examples:
   * ```json
   * [
   *   {"method": "GET", "endpoint": "/data", "headers": {"token": "38935657-8491-4702-b951-a03374410db0"} },
   *   {"method": "GET", "endpoint": "/device" }
   * ]
   * ```
   * @param batchData
   * @param async
   * Async=true method send all commands in same time,
   * Async=false send command one by one, and stop if got a error
   */
  request(batchData: BatchData[], async = false): Promise<any> {
    const result = this.doRequest<any>({
      path: `/batch?async=${async}`,
      method: "POST",
      body: batchData,
    });

    return result;
  }
}

export default Batch;
