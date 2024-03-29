import Account from "../../Resources/AccountDeprecated";
import { RouterConstructor } from "./router.types";
import RouterService from "./service";
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
  constructor(private params: RouterConstructor) {
    if (params.account && !(params.account instanceof Account)) {
      throw "The parameter 'account' must be an instance of a TagoIO Account.";
    }
  }

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
