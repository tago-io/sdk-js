import { RouterConstructor } from "./router";

class RouterService {
  private serviceFunction: Function;
  private whenList: Function[] = [];
  constructor(service: Function) {
    this.serviceFunction = service;
  }

  private addFunc(func: Function) {
    this.whenList.push(func);
  }
  /**
   * Return true if specific variables are in the scope.
   * Information is available if Analysis is triggered by an widget or action.
   */
  public whenVariables(variable: string | string[]) {
    const variable_list = Array.isArray(variable) ? variable : [variable];
    this.addFunc((scope: any, environment: any) => !!scope.find((x: any) => variable_list.includes(x?.variable)));
    return this;
  }

  /**
   * Return true if variable is included in any variable name in the scope.
   * Information is available if Analysis is triggered by an widget or action.
   */
  public whenVariableLike(variable: string) {
    this.addFunc((scope: any, environment: any) => !!scope.find((x: any) => x?.variable?.includes(variable)));
    return this;
  }

  /**
   * Return true if value is present for any variable in the scope
   * Information is available if Analysis is triggered by an widget or action.
   */
  public whenValues(values: string | boolean | number | (string | boolean | number)[]) {
    const values_list = Array.isArray(values) ? values : [values];
    this.addFunc((scope: any, environment: any) => !!scope.find((x: any) => values_list.includes(x?.value)));
    return this;
  }

  /**
   * Return true if serie is present for any variable in the scope
   * Information is available if Analysis is triggered by an widget or action.
   */
  public whenSeries(series: string | string[]) {
    const series_list = Array.isArray(series) ? series : [series];
    this.addFunc((scope: any, environment: any) => !!scope.find((x: any) => series_list.includes(x?.serie)));
    return this;
  }

  /**
   * Return true if input form ID is the same
   * Information is available if Analysis is triggered by an input widget.
   */
  public whenInputFormID(id: string) {
    this.addFunc((scope: any, environment: any) => !!scope.find((x: any) => x.input_form_button_id === id));
    return this;
  }

  /**
   * Return true if a parameter in the scope exists
   * Useful to be used with Device List widget.
   */
  public whenParameterExists(parameter: string) {
    this.addFunc((scope: any, environment: any) => !!scope.find((x: any) => parameter in x));
    return this;
  }

  /**
   * Return true if widget_exec is the same
   * Information is available if Analysis is triggered by an widget.
   */
  public whenWidgetExec(widget_exec: "insert" | "delete" | "edit") {
    this.addFunc((scope: any, environment: any) => environment._widget_exec === widget_exec);
    return this;
  }

  /**
   * Return true if action_when is the same
   * Information is available if Analysis is triggered by an action.
   */
  public whenActionWhen(action_when: "create" | "update" | "delete" | "mqtt_connect" | "mqtt_disconnect") {
    this.addFunc((scope: any, environment: any) => environment._action_when === action_when);
    return this;
  }

  /**
   * Return true if action_type is the same
   * Information is available if Analysis is triggered by an action.
   */
  public whenActionType(action_type: "resource" | "condition" | "delete") {
    this.addFunc((scope: any, environment: any) => environment._action_type === action_type);
    return this;
  }

  /**
   * Return true if input form ID is the same
   * Information is always available.
   */
  public whenEnv(key: string, value: string) {
    this.addFunc((scope: any, environment: any) => environment[key] === value);
    return this;
  }

  /**
   * Start verifying if all when conditions are true.
   */
  public verifyConditionsTrue(scope: any, environment: any) {
    for (const func of this.whenList) {
      const result = func(scope, environment);
      if (!result) {
        return false;
      }
    }

    return true;
  }

  /**
   *
   * @param router_params
   * @returns
   */
  public runService(router_params: RouterConstructor) {
    return this.serviceFunction(router_params);
  }

  public getServiceName() {
    return this.serviceFunction.name;
  }
}

export default RouterService;
