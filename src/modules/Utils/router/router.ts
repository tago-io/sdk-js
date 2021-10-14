import { Data } from "../../../common/common.types";
import Account from "../../Account/Account";
import { MQTTResourceAction } from "../../Account/actions.types";
import { DeviceCreateInfo } from "../../Account/devices.types";
import { TagoContext } from "../../Analysis/analysis.types";
import Device from "../../Device/Device";
import RouterService from "./service";

type Scope = (Data | DeviceCreateInfo | { input_form_button_id: string } | MQTTResourceAction)[];
class RouterConstructor {
  scope: Scope;
  environment: { [key: string]: string };
  account?: Account;
  config_dev?: Device;
  context?: TagoContext;
}

class AnalysisRouter {
  services: RouterService[] = [];

  /**
   * Create an Analysis Router.
   * Use router.register to register new routes for your analysis.
   * Use router.exec() to execute the router and run your functions.
   * Example:
   *      router.register(myFunction).whenInputFormID('create-device-input');
   *      router.exec();
   */
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
      if (!service.verifyConditionsTrue(this.params.scope, this.params.environment)) {
        continue;
      }

      service.runService(this.params);
      my_list.push(service.getServiceName());
    }

    return { status: !!my_list.length, services: my_list };
  }
}

export { RouterConstructor };
export default AnalysisRouter;
