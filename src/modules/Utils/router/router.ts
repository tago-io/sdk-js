import { Data } from "../../../common/common.types";
import Account from "../../Account/Account";
import { MQTTResourceAction } from "../../Account/actions.types";
import { DeviceCreateInfo } from "../../Account/devices.types";
import { TagoContext } from "../../Analysis/analysis.types";
import Device from "../../Device/Device";
import RouterService from "./service";

class RouterConstructor {
  scope: Data[] | DeviceCreateInfo[] | { input_form_button_id: string }[] | MQTTResourceAction[];
  environment: { [key: string]: string };
  account?: Account;
  config_dev?: Device;
  context?: TagoContext;
}

class AnalysisRouter {
  services: RouterService[] = [];

  constructor(private params: RouterConstructor) {}

  public register(func: (parameters: RouterConstructor) => any) {
    const service = new RouterService(func);
    this.services.push(service);

    return service;
  }

  /**
   * Start the router. It will pick the service if all conditions are match
   * and send all parameter provided to the final function.
   * @returns json with status and services that run
   */
  public async exec() {
    const my_list: string[] = [];
    for (const service of this.services) {
      if (!service.internal.whenConditionsTrue(this.params.scope, this.params.environment)) {
        continue;
      }

      service.internal.runService(this.params);
      my_list.push(service.internal.getServiceName());
    }

    return { status: !!my_list.length, services: my_list };
  }
}

export { RouterConstructor };
export default AnalysisRouter;
