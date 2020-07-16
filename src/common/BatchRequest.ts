import TagoIOModule, { GenericModuleParams } from "./TagoIOModule";
import { Method } from "axios";

interface BatchData {
  method?: Method;
  endpoint: string;
  headers: {};
}

class Batch extends TagoIOModule<GenericModuleParams> {
  request(data: BatchData[], async = false): Promise<any> {
    const result = this.doRequest<any>({
      path: `/batch?async=${async}`,
      method: "POST",
      body: data,
    });

    return result;
  }
}

export default Batch;
